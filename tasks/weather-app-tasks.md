# Backlog de Tarefas: Weather App

Fonte: `specs/weather-app-spec.md` e `plans/weather-app-plan.md`. Propostas da spec só viram critérios de entrega após aprovação em T-01.

## Entrega 1 — Decisões e fundação

### T-01 — Aprovar gates de produto e operação

- **Descrição:** resolver decisões que bloqueiam arquitetura, experiência e validação: canal/plataforma, navegadores/dispositivos, regiões e idiomas, campos meteorológicos, personas, metas NFR, termos/limites/atribuição da Open-Meteo, política de persistência/logs e métrica de sucesso.
- **Critérios de aceite:**
  - As decisões e thresholds aprovados ou revisados estão registrados na spec e no plano (NFR-02 a NFR-09).
  - Canal, matriz de compatibilidade e regiões prioritárias estão definidos (NFR-02, NFR-08).
  - Termos de uso, atribuição e limites do provedor foram verificados (NFR-09).
  - Personas e métrica de sucesso do MVP estão validadas ou registradas como fora do gate inicial (US-01 a US-05).
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Infra

### T-02 — Criar ponto de entrada React

- **Descrição:** preparar a montagem da aplicação usando Vite e React já configurados no repositório.
- **Critérios de aceite:**
  - `src/main.tsx` monta a aplicação React e `src/App.tsx` renderiza uma página inicial válida (plano: Project Structure).
  - `pnpm build` conclui sem erros.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`.
- **Tipo:** Infra

### T-03 — Criar estilos base do tema

- **Descrição:** conectar a folha de estilos ao entrypoint e aplicar a base dark glassmorphism usando a paleta Tailwind já configurada.
- **Critérios de aceite:**
  - A folha global é carregada pela aplicação e usa o tema do projeto (.github/copilot-instructions.md, Stack).
  - A página inicial não tem rolagem horizontal em viewport de 320 px (NFR-02).
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/styles/index.css`, `src/main.tsx`.
- **Tipo:** UI

### T-04 — Preparar setup de testes unitários

- **Descrição:** criar o setup referenciado pela configuração Vitest existente, sem duplicar configuração já presente.
- **Critérios de aceite:**
  - `tests/setup.ts` registra os matchers DOM usados pela suíte (plano: Testing Strategy).
  - Vitest continua usando os scripts e configuração já existentes no repositório.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/setup.ts`.
- **Tipo:** Infra

## Entrega 2 — Contratos e dados

### T-05 — Definir contratos TypeScript do domínio

- **Descrição:** criar tipos internos de cidade, clima atual, previsão diária, unidade, dados agregados e erros de serviço.
- **Critérios de aceite:**
  - Os contratos ficam em `src/types/weather.ts` e compilam com TypeScript strict (plano: Data Model).
  - Temperaturas são representadas em Celsius e valores ausentes em `null` (FR-02, FR-03).
  - Erros distinguem operação (`geocoding`/`forecast`) e código (`network`, `http`, `timeout`, `invalid-response`) (FR-05, AC-05.2).
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data

### T-06 — Implementar conversão de temperatura

- **Descrição:** criar a função pura que converte Celsius canônico para a unidade de apresentação e aplica o arredondamento.
- **Critérios de aceite:**
  - 20 °C converte para 68 °F; valores fracionários são arredondados ao inteiro mais próximo (FR-04, AC-04.2, AC-04.3).
  - A função aceita valores negativos, zero e `null`, sem produzir `NaN`.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data

### T-07 — Implementar formatação e códigos meteorológicos

- **Descrição:** criar funções puras para data/hora por timezone e mapeamento de códigos WMO para rótulos pt-BR.
- **Critérios de aceite:**
  - Datas e horários usam pt-BR e o fuso IANA recebido (NFR-01, FR-02, FR-03).
  - Códigos conhecidos retornam rótulos pt-BR; código desconhecido retorna “Condição indisponível” (NFR-01, AC-02.2).
  - As funções não dependem de React, DOM ou rede.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/lib/format.ts`, `src/lib/weatherCodes.ts`.
- **Tipo:** Data

### T-08 — Implementar serviço de geocoding

- **Descrição:** implementar busca de cidades Open-Meteo, normalização de espaços, encoding Unicode e mapeamento para `City`.
- **Critérios de aceite:**
  - Usa `name`, `count=10`, `language=pt` e `format=json` (FR-01, AC-01.2, AC-01.3).
  - Resposta válida sem resultados retorna lista vazia; campos administrativos opcionais ausentes viram `null` (AC-01.3, AC-01.5).
  - HTTP, rede, timeout e JSON inválido retornam erros tipados, não lista vazia (FR-05, AC-05.2).
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-09 — Implementar serviço de forecast

- **Descrição:** implementar consulta de clima atual e cinco dias locais a partir das coordenadas selecionadas.
- **Critérios de aceite:**
  - Envia `current`, `daily`, `forecast_days=5`, `timezone=auto` e `temperature_unit=celsius` (FR-02, FR-03).
  - Mapeia hoje e os quatro dias seguintes; alinha arrays por índice e preserva campos ausentes como `null` (AC-03.1, AC-03.2).
  - HTTP, rede, timeout, JSON inválido e resposta estruturalmente inválida retornam erros tipados (FR-05, AC-05.2).
- **Dependências:** T-05, T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-10 — Testar contratos dos serviços

- **Descrição:** testar geocoding e forecast com `fetch` mockado, sem chamar a API pública.
- **Critérios de aceite:**
  - Verifica URL, parâmetros, encoding, campos opcionais, lista vazia e mapeamento dos arrays diários (FR-01 a FR-03).
  - Cobre resposta parcial, JSON inválido, HTTP não-2xx/429, rede, timeout e cancelamento (FR-05, AC-05.2, AC-05.3).
  - Os testes passam de modo determinístico sem conexão externa (plano: Testing Strategy).
- **Dependências:** T-08, T-09.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test

## Entrega 3 — Orquestração e interface

### T-11 — Implementar hook de estado do clima

- **Descrição:** implementar `useWeather` para orquestrar busca, seleção, forecast, retry, cancelamento e unidade.
- **Critérios de aceite:**
  - Busca e forecast mantêm estados independentes `idle`, `loading`, `success`, `empty` e `error`; `empty` representa só geocoding sem resultados (FR-05, AC-01.5).
  - Forecast parcial permanece em `success` com os campos ausentes em `null` (FR-05, AC-03.2, AC-05.3).
  - Retry repete a mesma operação; resposta cancelada ou obsoleta não sobrescreve o estado atual (AC-05.2, AC-05.3).
  - Unidade inicia em Celsius e sua alternância não chama os serviços (FR-04, AC-04.1, AC-04.2).
- **Dependências:** T-05, T-06, T-07, T-08, T-09.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI

### T-12 — Implementar campo de busca

- **Descrição:** criar formulário acessível com envio por Enter ou botão e validação local.
- **Critérios de aceite:**
  - Input vazio ou só com espaços não chama serviço, mantém foco e mostra “Informe uma cidade” (FR-01, AC-01.1).
  - Texto enviado tem espaços externos removidos e preserva acentos/hífens (FR-01, AC-01.2).
  - Campo e botão possuem labels acessíveis e funcionam por teclado (NFR-03).
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Tipo:** UI

### T-13 — Implementar resultados e seleção de cidade

- **Descrição:** apresentar resultados do geocoding e enviar a cidade explicitamente selecionada ao hook.
- **Critérios de aceite:**
  - Exibe nome e, quando disponíveis, região administrativa e país (FR-01, AC-01.3).
  - Nenhum resultado é selecionado automaticamente; a seleção explícita define a localidade consultada (FR-01, AC-01.4).
  - A seleção inicia forecast para as coordenadas correspondentes (AC-01.4).
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Tipo:** UI

### T-14 — Implementar indicador de carregamento

- **Descrição:** criar apresentação reutilizável do estado loading.
- **Critérios de aceite:**
  - O estado é visível e exposto como status para tecnologia assistiva (FR-05, AC-05.1, NFR-03).
  - O formulário permanece disponível para leitura e não é substituído pelo indicador.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Tipo:** UI

### T-15 — Implementar estados vazio e erro

- **Descrição:** criar apresentações de ausência de resultados e falha técnica, com ações apropriadas.
- **Critérios de aceite:**
  - Vazio informa “Nenhuma cidade encontrada” e permite editar a busca (FR-05, AC-01.5).
  - Erro informa indisponibilidade em pt-BR e oferece “Tentar novamente” (FR-05, AC-05.2).
  - Erro técnico nunca é apresentado como cidade não encontrada (FR-05, AC-05.2).
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`, `src/components/states/ErrorState.tsx`.
- **Tipo:** UI

### T-16 — Apresentar clima atual

- **Descrição:** criar componente de clima atual com localidade, temperatura, condição e horário disponível.
- **Critérios de aceite:**
  - Exibe cidade, temperatura, condição localizada e horário local quando fornecidos (FR-02, AC-02.1, AC-02.2).
  - Campo ausente aparece como indisponível; código WMO desconhecido não descarta os demais valores (FR-02, AC-02.2).
- **Dependências:** T-07, T-11.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI

### T-17 — Apresentar previsão diária

- **Descrição:** criar lista e cartão diário para os cinco dias locais.
- **Critérios de aceite:**
  - Apresenta exatamente cinco datas de hoje até hoje + 4, conforme timezone da cidade (FR-03, AC-03.1).
  - Cada entrada mostra condição, mínima e máxima; campos ausentes ficam identificados como indisponíveis (FR-03, AC-03.2).
- **Dependências:** T-07, T-09, T-11.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- **Tipo:** UI

### T-18 — Implementar alternância de unidade

- **Descrição:** criar controle acessível C/F conectado ao estado de apresentação.
- **Critérios de aceite:**
  - O controle permite selecionar Celsius ou Fahrenheit e informa a unidade ativa (FR-04, AC-04.1).
  - A troca atualiza todas as temperaturas por conversão derivada, sem nova chamada (FR-04, AC-04.2, AC-04.3).
  - Seleção funciona por teclado e tem nome acessível (NFR-03).
- **Dependências:** T-06, T-11.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI

### T-19 — Compor a tela Weather App

- **Descrição:** compor busca, resultados, clima atual, previsão, unidade e estados de carregamento/vazio/erro em `App.tsx`.
- **Critérios de aceite:**
  - O fluxo integrado permite buscar, selecionar cidade, consultar dados, alternar unidade e tentar novamente (FR-01 a FR-05).
  - Layout segue a matriz aprovada e não apresenta rolagem horizontal (NFR-02, NFR-08).
  - Estados dinâmicos e controles têm semântica acessível e foco visível (NFR-03).
- **Dependências:** T-12, T-13, T-14, T-15, T-16, T-17, T-18.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI

## Entrega 4 — Testes e prontidão para lançamento

### T-20 — Testar conversão de temperatura

- **Descrição:** cobrir a função pura de conversão e arredondamento.
- **Critérios de aceite:**
  - Testa Celsius/Fahrenheit com valores positivos, zero, negativos e fracionários (FR-04, AC-04.2, AC-04.3).
  - Testa valor ausente e garante saída sem `NaN`.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test

### T-21 — Testar formatação e códigos WMO

- **Descrição:** testar helpers de data/hora e mapeamento meteorológico.
- **Critérios de aceite:**
  - Testa formato pt-BR por timezone, mudança de data e horário de verão aplicável (NFR-01, AC-03.1).
  - Testa códigos conhecidos e fallback desconhecido (AC-02.2, AC-03.2).
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/format.test.ts`, `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test

### T-22 — Testar transições do hook

- **Descrição:** testar `useWeather` com `WeatherService` mockado.
- **Critérios de aceite:**
  - Cobre estados idle/loading/success/empty/error, seleção, retry e cancelamento (FR-01, FR-05, AC-01.5, AC-05.1 a AC-05.3).
  - Confirma Celsius inicial e ausência de chamadas ao alternar C/F (FR-04, AC-04.1, AC-04.2).
- **Dependências:** T-10, T-11.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Tipo:** Test

### T-23 — Testar componentes de apresentação

- **Descrição:** testar componentes de busca, estados, clima, previsão e unidade com Testing Library.
- **Critérios de aceite:**
  - Cobre loading, erro, vazio e sucesso, busca vazia, campos ausentes, seleção e retry (AC-01.1, AC-01.4, AC-01.5, AC-02.1, AC-02.2, AC-03.2, AC-05.1 a AC-05.3).
  - Verifica labels, interação por teclado e conteúdo visível sem mockar rede (NFR-03).
- **Dependências:** T-12, T-13, T-14, T-15, T-16, T-17, T-18.
- **Arquivos prováveis:** `tests/unit/components.test.tsx`.
- **Tipo:** Test

### T-24 — Testar integração de App

- **Descrição:** validar o encadeamento hook-serviço-componentes usando serviço mockado.
- **Critérios de aceite:**
  - Percorre busca, seleção, carregamento, clima, previsão, erro/retry e troca de unidade (FR-01 a FR-05).
  - Confirma que alternar C/F não provoca nova chamada (AC-04.2).
- **Dependências:** T-19, T-22, T-23.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Tipo:** Test

### T-25 — Validar fluxos E2E e navegadores

- **Descrição:** cobrir fluxos críticos com Playwright e respostas de API interceptadas nos viewports e navegadores aprovados.
- **Critérios de aceite:**
  - Cobre sucesso, cidade ambígua, nenhum resultado, erro/retry, resposta parcial e troca C/F sem chamada extra (FR-01 a FR-05).
  - Fluxo principal passa em mobile 375 × 812 px e desktop 1280 × 800 px, além da matriz aprovada em T-01 (NFR-02, NFR-08).
  - Mobile não apresenta rolagem horizontal; E2E é determinístico e não depende da Open-Meteo real.
- **Dependências:** T-01, T-24.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test

### T-26 — Instalar ferramenta de acessibilidade aprovada

- **Descrição:** adicionar a dependência de análise automatizada aprovada em T-01, mantendo Playwright como runner.
- **Critérios de aceite:**
  - Dependência e lockfile são atualizados com pnpm.
  - A ferramenta executa no ambiente Playwright existente sem introduzir runner paralelo (NFR-03).
- **Dependências:** T-01, T-04.
- **Arquivos prováveis:** `package.json`, `pnpm-lock.yaml`.
- **Tipo:** Infra

### T-27 — Verificar acessibilidade automatizada e assistiva

- **Descrição:** adicionar verificações de acessibilidade aos fluxos principais e registrar revisão manual.
- **Critérios de aceite:**
  - Testes automatizados cobrem busca, seleção, dados e erro sem violações críticas da meta aprovada (NFR-03).
  - Revisão por teclado e leitor de tela é executada e seus resultados registrados.
- **Dependências:** T-19, T-25, T-26.
- **Arquivos prováveis:** `tests/e2e/accessibility.spec.ts`, `docs/accessibility-review.md`.
- **Tipo:** Test

### T-28 — Configurar sondas e métricas de produção

- **Descrição:** configurar sondas sintéticas e documentar medição/alertas para os SLOs aprovados em T-01.
- **Critérios de aceite:**
  - Sondas verificam busca e consulta na frequência acordada e medem geocoding e forecast separadamente (NFR-04, NFR-05).
  - Disponibilidade e p95 são calculados pela janela e limites aprovados; alertas e responsáveis estão documentados.
- **Dependências:** T-01, T-25.
- **Arquivos prováveis:** configuração do provedor de monitoramento aprovado, `docs/operations.md`.
- **Tipo:** Infra