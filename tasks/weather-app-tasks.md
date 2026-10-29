# Backlog de Tarefas: Weather App

Fonte: `specs/weather-app-spec.md` e `plans/weather-app-plan.md`. Propostas da spec só viram critérios de entrega após aprovação em T-01. A ordem abaixo respeita tipos → funções puras → services → hook → componentes → integração → testes → hardening.

## Entrega 1 — Gates e bootstrap

### T-01 — Aprovar gates de produto e operação

- **Descrição:** resolver decisões que bloqueiam arquitetura, experiência e validação: canal/plataforma, navegadores/dispositivos, regiões e idiomas, campos meteorológicos, personas, metas NFR, termos/limites/atribuição da Open-Meteo, política de persistência/logs e métrica de sucesso.
- **Critérios de aceite:**
  - Decisões e thresholds aprovados ou revisados estão registrados na spec e no plano (NFR-02 a NFR-09).
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

## Entrega 2 — Tipos

### T-03 — Definir contratos TypeScript do domínio

- **Descrição:** criar tipos internos de cidade, clima atual, previsão diária, unidade, dados agregados e erros de serviço.
- **Critérios de aceite:**
  - Os contratos ficam em `src/types/weather.ts` e compilam com TypeScript strict (plano: Data Model).
  - Temperaturas meteorológicas são representadas em Celsius; valores ausentes são `null` (FR-02, FR-03).
  - Erros distinguem operação (`geocoding`/`forecast`) e código (`network`, `http`, `timeout`, `invalid-response`) (FR-05, AC-05.2).
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data

## Entrega 3 — Funções puras

### T-04 — Implementar conversão de temperatura

- **Descrição:** criar a função pura que converte Celsius canônico para a unidade de apresentação e aplica o arredondamento.
- **Critérios de aceite:**
  - 20 °C converte para 68 °F; valores fracionários são arredondados ao inteiro mais próximo (FR-04, AC-04.2, AC-04.3).
  - Valores negativos, zero e `null` são tratados sem produzir `NaN`.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data

### T-05 — Implementar formatação e códigos meteorológicos

- **Descrição:** criar funções puras para data/hora por timezone e mapeamento de códigos WMO para rótulos pt-BR.
- **Critérios de aceite:**
  - Datas e horários usam pt-BR e o fuso IANA recebido (NFR-01, FR-02, FR-03).
  - Códigos conhecidos retornam rótulos pt-BR; código desconhecido retorna “Condição indisponível” (NFR-01).
  - As funções não dependem de React, DOM ou rede.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/format.ts`, `src/lib/weatherCodes.ts`.
- **Tipo:** Data

## Entrega 4 — Services

### T-06 — Implementar serviço de geocoding

- **Descrição:** implementar busca de cidades Open-Meteo, normalização de espaços, encoding Unicode e mapeamento para `City`.
- **Critérios de aceite:**
  - Usa `name`, `count=10`, `language=pt` e `format=json` (FR-01, AC-01.2, AC-01.3).
  - Resposta válida sem resultados retorna lista vazia; campos administrativos opcionais ausentes viram `null` (AC-01.3, AC-01.5).
  - HTTP, rede, timeout e JSON inválido retornam erros tipados, não lista vazia (FR-05, AC-05.2).
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-07 — Implementar serviço de forecast

- **Descrição:** implementar consulta de clima atual e cinco dias locais a partir das coordenadas selecionadas.
- **Critérios de aceite:**
  - Envia `current`, `daily`, `forecast_days=5`, `timezone=auto` e `temperature_unit=celsius` (FR-02, FR-03).
  - Mapeia hoje e os quatro dias seguintes; alinha arrays por índice e preserva campos ausentes como `null` (AC-03.1, AC-03.2).
  - HTTP, rede, timeout, JSON inválido e resposta estruturalmente inválida retornam erros tipados (FR-05, AC-05.2).
- **Dependências:** T-03, T-06.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

## Entrega 5 — Hook

### T-08 — Implementar hook de estado do clima

- **Descrição:** implementar `useWeather` para orquestrar busca, seleção, forecast, retry, cancelamento e unidade.
- **Critérios de aceite:**
  - Busca e forecast mantêm estados independentes `idle`, `loading`, `success`, `empty` e `error`; `empty` representa só geocoding sem resultados (FR-05, AC-01.5).
  - Forecast parcial permanece em `success` com os campos ausentes em `null` (FR-05, AC-03.2, AC-05.3).
  - Retry repete a mesma operação; resposta cancelada ou obsoleta não sobrescreve o estado atual (AC-05.2, AC-05.3).
  - Unidade inicia em Celsius e sua alternância não chama os serviços (FR-04, AC-04.1, AC-04.2).
- **Dependências:** T-04, T-05, T-06, T-07.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI

## Entrega 6 — Componentes

### T-09 — Implementar campo de busca

- **Descrição:** criar formulário acessível com envio por Enter ou botão e validação local.
- **Critérios de aceite:**
  - Input vazio ou só com espaços não chama serviço, mantém foco e mostra “Informe uma cidade” (FR-01, AC-01.1).
  - Texto enviado tem espaços externos removidos e preserva acentos/hífens (FR-01, AC-01.2).
  - Campo e botão possuem labels acessíveis e funcionam por teclado (NFR-03).
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Tipo:** UI

### T-10 — Implementar resultados e seleção de cidade

- **Descrição:** apresentar resultados do geocoding e enviar a cidade explicitamente selecionada ao hook.
- **Critérios de aceite:**
  - Exibe nome e, quando disponíveis, região administrativa e país (FR-01, AC-01.3).
  - Nenhum resultado é selecionado automaticamente; a seleção explícita define a localidade consultada (FR-01, AC-01.4).
  - Selecionar uma opção inicia forecast para suas coordenadas (AC-01.4).
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Tipo:** UI

### T-11 — Implementar indicador de carregamento

- **Descrição:** criar apresentação reutilizável do estado loading.
- **Critérios de aceite:**
  - O estado é visível e exposto como status para tecnologia assistiva (FR-05, AC-05.1, NFR-03).
  - O formulário permanece disponível para leitura.
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Tipo:** UI

### T-12 — Implementar estados vazio e erro

- **Descrição:** criar apresentações de ausência de resultados e falha técnica, com ações apropriadas.
- **Critérios de aceite:**
  - Vazio informa “Nenhuma cidade encontrada” e permite editar a busca (FR-05, AC-01.5).
  - Erro informa indisponibilidade em pt-BR e oferece “Tentar novamente” (FR-05, AC-05.2).
  - Erro técnico nunca é apresentado como cidade não encontrada (FR-05, AC-05.2).
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`, `src/components/states/ErrorState.tsx`.
- **Tipo:** UI

### T-13 — Apresentar clima atual

- **Descrição:** criar componente de clima atual com localidade, temperatura, condição e horário disponível.
- **Critérios de aceite:**
  - Exibe cidade, temperatura, condição localizada e horário local quando fornecidos (FR-02, AC-02.1, AC-02.2).
  - Campo ausente aparece como indisponível; código WMO desconhecido não descarta os demais valores (FR-02, AC-02.2).
- **Dependências:** T-05, T-08.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI

### T-14 — Apresentar previsão diária

- **Descrição:** criar lista e cartão diário para os cinco dias locais.
- **Critérios de aceite:**
  - Apresenta exatamente cinco datas de hoje até hoje + 4, conforme timezone da cidade (FR-03, AC-03.1).
  - Cada entrada mostra condição, mínima e máxima; campos ausentes ficam identificados como indisponíveis (FR-03, AC-03.2).
- **Dependências:** T-05, T-08.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- **Tipo:** UI

### T-15 — Implementar alternância de unidade

- **Descrição:** criar controle acessível C/F conectado ao estado de apresentação.
- **Critérios de aceite:**
  - O controle permite selecionar Celsius ou Fahrenheit e informa a unidade ativa (FR-04, AC-04.1).
  - A troca atualiza todas as temperaturas por conversão derivada, sem nova chamada (FR-04, AC-04.2, AC-04.3).
  - Seleção funciona por teclado e tem nome acessível (NFR-03).
- **Dependências:** T-04, T-08.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI

### T-16 — Aplicar tema e responsividade

- **Descrição:** criar os estilos globais e breakpoints do layout aprovado usando a configuração Tailwind existente.
- **Critérios de aceite:**
  - A folha global aplica o tema dark glassmorphism configurado no projeto.
  - Busca, resultados, clima e previsão não apresentam rolagem horizontal nos viewports aprovados (NFR-02, NFR-08).
- **Dependências:** T-02, T-09, T-10, T-11, T-12, T-13, T-14, T-15.
- **Arquivos prováveis:** `src/styles/index.css`, `src/main.tsx`.
- **Tipo:** UI

## Entrega 7 — Integração

### T-17 — Compor a tela Weather App

- **Descrição:** integrar busca, resultados, clima atual, previsão, unidade e estados em `App.tsx`.
- **Critérios de aceite:**
  - O fluxo integrado permite buscar, selecionar cidade, consultar dados, alternar unidade e tentar novamente (FR-01 a FR-05).
  - Layout segue a matriz aprovada e não apresenta rolagem horizontal (NFR-02, NFR-08).
  - Estados dinâmicos e controles têm semântica acessível e foco visível (NFR-03).
- **Dependências:** T-09, T-10, T-11, T-12, T-13, T-14, T-15, T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI

## Entrega 8 — Testes

### T-18 — Preparar setup de testes unitários

- **Descrição:** criar o setup referenciado pela configuração Vitest existente, sem duplicar configuração.
- **Critérios de aceite:**
  - `tests/setup.ts` registra os matchers DOM usados pela suíte.
  - A configuração Vitest existente descobre e executa os testes adicionados nas próximas tarefas.
- **Dependências:** T-17.
- **Arquivos prováveis:** `tests/setup.ts`.
- **Tipo:** Infra

### T-19 — Testar services com mock de fetch

- **Descrição:** testar os services de geocoding e forecast usando `fetch` mockado, sem chamar a API pública.
- **Critérios de aceite:**
  - O mock confirma os endpoints e parâmetros de geocoding/forecast, encoding, campos opcionais, lista vazia e mapeamento diário (FR-01 a FR-03).
  - Todas as chamadas a `fetch` são mockadas; nenhuma requisição real à Open-Meteo é enviada. Fixtures cobrem resposta parcial, JSON inválido, HTTP não-2xx/429, rede, timeout e cancelamento (FR-05, AC-05.2, AC-05.3).
  - `pnpm test` executa estes testes deterministicamente sem conexão externa.
- **Dependências:** T-18, T-06, T-07.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test

### T-20 — Testar conversão Celsius/Fahrenheit com Vitest

- **Descrição:** criar testes unitários Vitest para a função pura de conversão e arredondamento.
- **Critérios de aceite:**
  - 20 °C produz 68 °F e 10 °C produz 50 °F; conversão inversa e arredondamento são verificados (FR-04, AC-04.2, AC-04.3).
  - Valores positivos, zero, negativos e `null` são cobertos; nenhuma saída é `NaN`.
- **Dependências:** T-18, T-04.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test

### T-21 — Testar formatação e códigos WMO

- **Descrição:** testar helpers de data/hora e mapeamento meteorológico.
- **Critérios de aceite:**
  - Testa formato pt-BR por timezone, mudança de data e horário de verão aplicável (NFR-01, AC-03.1).
  - Testa códigos conhecidos e fallback desconhecido (AC-02.2, AC-03.2).
- **Dependências:** T-18, T-05.
- **Arquivos prováveis:** `tests/unit/format.test.ts`, `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test

### T-22 — Testar transições do hook

- **Descrição:** testar `useWeather` com `WeatherService` mockado.
- **Critérios de aceite:**
  - Cobre estados idle/loading/success/empty/error, seleção, retry e cancelamento (FR-01, FR-05, AC-01.5, AC-05.1 a AC-05.3).
  - Confirma Celsius inicial e ausência de chamadas ao alternar C/F (FR-04, AC-04.1, AC-04.2).
- **Dependências:** T-18, T-08.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Tipo:** Test

### T-23 — Testar componentes nos estados loading, erro, vazio e sucesso

- **Descrição:** testar componentes de busca, estados, clima, previsão e unidade com Vitest + Testing Library.
- **Critérios de aceite:**
  - **Loading:** indicador visível e exposto como status acessível (AC-05.1).
  - **Erro:** mensagem pt-BR e ação “Tentar novamente” visíveis; erro não é rotulado como cidade inexistente (AC-05.2).
  - **Vazio:** mensagem “Nenhuma cidade encontrada” e possibilidade de editar a busca (AC-01.5).
  - **Sucesso:** cidade, clima atual e cinco dias são renderizados; campos ausentes aparecem como indisponíveis (AC-02.1, AC-02.2, AC-03.1, AC-03.2).
  - Busca vazia, seleção e retry são cobertos (AC-01.1, AC-01.4, AC-05.3).
  - Verifica labels, interação por teclado e conteúdo visível sem mockar rede (NFR-03).
- **Dependências:** T-18, T-09, T-10, T-11, T-12, T-13, T-14, T-15.
- **Arquivos prováveis:** `tests/unit/components.test.tsx`.
- **Tipo:** Test

### T-24 — Testar integração de App

- **Descrição:** validar o encadeamento hook-serviço-componentes usando serviço mockado.
- **Critérios de aceite:**
  - Percorre busca, seleção, carregamento, clima, previsão, erro/retry e troca de unidade (FR-01 a FR-05).
  - Confirma que alternar C/F não provoca nova chamada (AC-04.2).
- **Dependências:** T-17, T-19, T-20, T-21, T-22, T-23.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Tipo:** Test

### T-25 — Testar fluxo principal E2E em desktop e viewport mobile

- **Descrição:** testar com Playwright o fluxo principal de busca, seleção, consulta e troca de unidade, com APIs interceptadas e viewport mobile.
- **Critérios de aceite:**
  - O fluxo principal completo passa em viewport mobile de 375 × 812 px e desktop de 1280 × 800 px (FR-01 a FR-04, NFR-02).
  - No mobile não há rolagem horizontal (`scrollWidth <= clientWidth`) e busca, seleção, previsão e toggle permanecem utilizáveis.
  - Testes adicionais cobrem cidade ambígua, nenhum resultado, erro/retry, resposta parcial e troca C/F sem chamada extra (FR-01 a FR-05).
  - Respostas são interceptadas; o E2E não depende da Open-Meteo real e executa na matriz de navegadores aprovada em T-01 (NFR-08).
- **Dependências:** T-17, T-24.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test

## Entrega 9 — Hardening

### T-26 — Instalar ferramenta de acessibilidade aprovada

- **Descrição:** adicionar a dependência de análise automatizada aprovada em T-01, mantendo Playwright como runner.
- **Critérios de aceite:**
  - Dependência e lockfile são atualizados com pnpm.
  - A ferramenta executa no ambiente Playwright existente sem introduzir runner paralelo (NFR-03).
- **Dependências:** T-01, T-18.
- **Arquivos prováveis:** `package.json`, `pnpm-lock.yaml`.
- **Tipo:** Infra

### T-27 — Verificar acessibilidade automatizada e assistiva

- **Descrição:** adicionar verificações de acessibilidade aos fluxos principais e registrar revisão manual.
- **Critérios de aceite:**
  - Testes automatizados cobrem busca, seleção, dados e erro sem violações críticas da meta aprovada (NFR-03).
  - Revisão por teclado e leitor de tela é executada e seus resultados registrados.
- **Dependências:** T-17, T-25, T-26.
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

## Matriz de rastreabilidade funcional

| Requisito da spec | Tarefas de implementação | Tarefas de teste/verificação | Cobertura |
|---|---|---|---|
| FR-01 — Buscar cidade | T-06 (geocoding), T-08 (orquestração), T-09 (input), T-10 (resultados/seleção), T-12 (estado vazio/erro), T-17 (integração) | T-19 (service), T-22 (hook), T-23 (componentes), T-24 (App), T-25 (E2E) | Coberto |
| FR-02 — Consultar clima atual | T-07 (forecast/current), T-08 (orquestração), T-13 (apresentação), T-17 (integração) | T-19 (service), T-21 (formatação/códigos), T-23 (componentes), T-24 (App), T-25 (E2E) | Coberto |
| FR-03 — Consultar previsão diária | T-07 (forecast), T-08 (orquestração), T-14 (apresentação), T-17 (integração) | T-19 (service), T-21 (timezone/códigos), T-23 (componentes), T-24 (App), T-25 (E2E) | Coberto |
| FR-04 — Alternar unidade | T-04 (conversão), T-08 (estado da unidade), T-15 (controle), T-17 (integração) | T-20 (conversão), T-22 (hook), T-23 (componentes), T-24 (App), T-25 (E2E) | Coberto |
| FR-05 — Comunicar estados e erros | T-03 (tipos de erro), T-06 e T-07 (erros dos services), T-08 (estados/retry), T-11 (loading), T-12 (empty/error), T-17 (integração) | T-19 (service), T-22 (hook), T-23 (componentes), T-24 (App), T-25 (E2E) | Coberto |

Todos os requisitos funcionais da spec têm tarefas de implementação e de verificação correspondentes; não há FR sem tarefa nesta versão do backlog.

## Prioridade, tamanho e sequência de entrega

**Escala:** P0 é necessário para aceitar o MVP; P1 é hardening/prontidão antes de produção; P2 pode ser adiado sem bloquear o MVP. Tamanho relativo: P = pequeno, M = médio, G = grande, considerando complexidade e incerteza, não duração fixa.

| Tarefa | Prioridade | Tamanho |
|---|---|---|
| T-01 | P0 | G |
| T-02 | P0 | P |
| T-03 | P0 | P |
| T-04 | P0 | P |
| T-05 | P0 | M |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | G |
| T-09 | P0 | P |
| T-10 | P0 | P |
| T-11 | P0 | P |
| T-12 | P0 | P |
| T-13 | P0 | P |
| T-14 | P0 | M |
| T-15 | P0 | P |
| T-16 | P0 | M |
| T-17 | P0 | G |
| T-18 | P0 | P |
| T-19 | P0 | M |
| T-20 | P0 | P |
| T-21 | P0 | P |
| T-22 | P0 | M |
| T-23 | P0 | M |
| T-24 | P0 | M |
| T-25 | P0 | M |
| T-26 | P1 | P |
| T-27 | P1 | M |
| T-28 | P1 | M |

Não há tarefas P2 explícitas: as tarefas funcionais e seus testes são necessárias para cobrir o MVP; as tarefas P1 podem ficar após a demonstração funcional, mas antes do lançamento de produção.

### Fatias verticais sugeridas

1. **Base visível:** T-01, T-02 e T-03. Aprovar decisões bloqueantes, montar o app e mostrar a página inicial; é um shell demonstrável, ainda sem consulta meteorológica.
2. **Busca + clima atual:** T-04 a T-13, mais o estilo global de T-16 e a integração de T-17. Entrega busca, escolha explícita da cidade, clima atual e estados de loading/vazio/erro. Embora a resposta do serviço já inclua previsão, esta fatia ainda não precisa renderizar a lista diária nem oferecer o toggle.
3. **Previsão + Celsius/Fahrenheit:** T-14 e T-15 integrados à aplicação; T-18 a T-25 validam services, funções, hook, componentes, integração e E2E das duas fatias.
4. **Prontidão de produção:** T-26 a T-28, após aprovação de acessibilidade e metas operacionais em T-01.

**Ajuste recomendado para entrega mais cedo:** hoje T-16 depende de T-14/T-15 e T-17 depende de todos os componentes, portanto a segunda fatia só fica integrada depois de previsão e toggle. Para tornar a sequência realmente vertical, separar o estilo base de T-16 e dividir T-17 em integração de busca/clima atual e uma extensão posterior para previsão/unidade. Antecipar o setup de testes de T-18 para após T-02 e dividir T-23/T-24/T-25 em verificações da fatia atual e da fatia completa; assim cada incremento pode ser demonstrado e validado antes de avançar.