# Especificação de Produto: Weather App

## Overview

O Weather App permite buscar uma cidade, consultar temperatura e condição meteorológica atuais e ver o resumo diário de hoje e dos quatro dias seguintes. A interface é pt-BR; Celsius é o padrão, com alternância para Fahrenheit. A fonte definida é Open-Meteo, sem API key. Não há autenticação nem persistência de dados no servidor.

Esta é uma linha de base de produto para o MVP. Valores marcados como **proposta** precisam de aprovação antes de virarem compromisso de produção; as aprovações estão em Open Questions.

## Functional Requirements

- **FR-01 — Buscar cidade:** aceitar nomes de cidades com caracteres Unicode, remover espaços externos e exigir ao menos um caractere não branco. Buscar somente após Enter ou acionamento do botão de busca; não fazer requisição para entrada vazia. Exibir até 10 resultados na ordem recebida, cada um com cidade, região administrativa e país quando disponíveis. A pessoa deve selecionar um resultado, mesmo quando houver apenas um.
- **FR-02 — Consultar clima atual:** para a cidade selecionada, exibir temperatura atual, condição em pt-BR e horário de referência informado pela fonte, em horário local da cidade. Se um campo não vier na resposta, apresentá-lo como indisponível; não inventar valores.
- **FR-03 — Consultar previsão diária:** exibir uma entrada para cada data local de hoje até hoje + 4, com condição, temperatura mínima e máxima em cada dia. Usar fuso horário da cidade retornado pela fonte.
- **FR-04 — Alternar unidade de temperatura:** permitir alternar todas as temperaturas visíveis entre Celsius e Fahrenheit sem nova busca. Exibir temperaturas arredondadas ao inteiro mais próximo, com formato numérico pt-BR. A unidade volta a Celsius ao iniciar uma nova sessão de página; não persistir a preferência.
- **FR-05 — Comunicar estado da consulta:** distinguir carregamento, busca sem resultados, erro de serviço e resposta incompleta. Em falha técnica, oferecer nova tentativa sem tratar a falha como ausência de cidade.

## User Stories

- **US-01 (FR-01 — Buscar cidade):** Como pessoa que se desloca diariamente, quero buscar minha cidade para encontrar rapidamente a localidade cujo clima preciso consultar.
- **US-02 (FR-02 — Consultar clima atual):** Como pessoa que se desloca diariamente, quero ver as condições meteorológicas atuais da cidade escolhida para decidir o que esperar ao sair.
- **US-03 (FR-03 — Consultar previsão de cinco dias):** Como pessoa que planeja atividades, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher quando realizar uma atividade.
- **US-04 (FR-04 — Alternar unidade de temperatura):** Como pessoa que prefere Fahrenheit, quero alternar a unidade das temperaturas para compreender o clima atual e a previsão na escala que uso.
- **US-05 (FR-05 — Comunicar estado da consulta):** Como pessoa que se desloca diariamente, quero saber quando uma consulta está carregando ou falhou para entender se devo aguardar ou tentar novamente.

## Acceptance Criteria

- **AC-01.1 (FR-01) — Entrada vazia**
	- **Given:** o campo contém apenas espaços ou está vazio.
	- **When:** a pessoa tenta buscar.
	- **Then:** nenhuma requisição é enviada; o campo recebe foco e a mensagem “Informe uma cidade” é exibida em pt-BR.
- **AC-01.2 (FR-01) — Normalização**
	- **Given:** a pessoa informa `  São José-dos-Campos  `.
	- **When:** a busca é enviada.
	- **Then:** o serviço recebe `São José-dos-Campos`, preservando acentos e hífen.
- **AC-01.3 (FR-01) — Resultados**
	- **Given:** o serviço retorna mais de uma correspondência.
	- **When:** os resultados são exibidos.
	- **Then:** até 10 opções aparecem na ordem recebida, com cidade, região e país quando disponíveis; nenhuma é selecionada automaticamente.
- **AC-01.4 (FR-01) — Seleção**
	- **Given:** o serviço retorna uma ou mais correspondências.
	- **When:** a pessoa seleciona uma opção.
	- **Then:** a opção fica identificada como cidade consultada e a aplicação solicita clima e previsão para suas coordenadas.
- **AC-01.5 (FR-01) — Sem correspondência**
	- **Given:** uma busca válida recebe uma resposta bem-sucedida sem resultados.
	- **When:** a resposta é processada.
	- **Then:** aparece “Nenhuma cidade encontrada”; nenhuma requisição meteorológica é feita e a pessoa pode editar a busca.
- **AC-02.1 (FR-02) — Dados atuais**
	- **Given:** a resposta contém temperatura de 20 °C, código mapeado para “Nublado” e horário de referência.
	- **When:** a consulta termina.
	- **Then:** cidade, “20 °C”, “Nublado” e horário local são exibidos.
- **AC-02.2 (FR-02) — Campo ausente**
	- **Given:** falta temperatura ou condição na resposta atual.
	- **When:** o cartão atual é exibido.
	- **Then:** os demais campos disponíveis aparecem e o campo ausente é identificado como “Indisponível”, nunca como zero.
- **AC-03.1 (FR-03) — Cinco datas**
	- **Given:** a previsão retorna dados para cinco datas consecutivas no fuso da cidade.
	- **When:** a previsão é exibida.
	- **Then:** há exatamente cinco entradas, de hoje até hoje + 4, cada uma com data, condição e temperaturas mínima e máxima.
- **AC-03.2 (FR-03) — Previsão incompleta**
	- **Given:** a fonte não retorna dados para uma das cinco datas ou para um de seus campos.
	- **When:** a previsão é exibida.
	- **Then:** a data permanece na lista, o campo ausente aparece como “Indisponível” e nenhum valor é substituído por zero ou por dado de outra data.
- **AC-04.1 (FR-04) — Unidade inicial**
	- **Given:** uma nova sessão de página é iniciada.
	- **When:** temperaturas são exibidas.
	- **Then:** todas usam Celsius e o símbolo `°C`.
- **AC-04.2 (FR-04) — Celsius para Fahrenheit**
	- **Given:** clima atual e previsão contêm 20 °C e 10 °C.
	- **When:** a pessoa seleciona Fahrenheit.
	- **Then:** os valores aparecem como 68 °F e 50 °F; cidade e datas não mudam e nenhuma requisição de dados é feita.
- **AC-04.3 (FR-04) — Arredondamento**
	- **Given:** uma temperatura convertida tem casas decimais.
	- **When:** é exibida em qualquer unidade.
	- **Then:** é arredondada ao inteiro mais próximo e formatada conforme pt-BR; a conversão usa `°F = (°C × 9/5) + 32`.
- **AC-05.1 (FR-05) — Carregamento**
	- **Given:** uma busca ou consulta está pendente.
	- **When:** a interface aguarda a resposta.
	- **Then:** um indicador visível é exposto como status para tecnologia assistiva.
- **AC-05.2 (FR-05) — Erro ou timeout**
	- **Given:** a busca ou consulta falha ou excede o timeout de 8 segundos.
	- **When:** a falha é detectada.
	- **Then:** uma mensagem específica em pt-BR informa a indisponibilidade, uma ação “Tentar novamente” é apresentada e nenhum erro é mostrado como “cidade não encontrada”.
- **AC-05.3 (FR-05) — Nova tentativa**
	- **Given:** a tela está em estado de erro.
	- **When:** a pessoa seleciona “Tentar novamente”.
	- **Then:** uma nova requisição é enviada para a mesma consulta e o estado de carregamento é exibido.

## Non-Functional Requirements

- **NFR-01 — Idioma e formatos:** interface, erros e condições meteorológicas devem estar em pt-BR. Usar datas `dd/MM/yyyy`, hora de 24 horas e fuso da cidade selecionada. Códigos meteorológicos sem tradução conhecida devem aparecer como “Condição indisponível”.
- **NFR-02 — Plataforma e responsividade (proposta):** tratar o MVP como web responsiva. Busca, clima e previsão devem funcionar sem rolagem horizontal entre 320 px e 1920 px. A plataforma precisa ser aprovada antes do plano técnico.
- **NFR-03 — Acessibilidade (proposta):** atender WCAG 2.2 AA nos fluxos de busca, seleção de cidade, consulta e troca de unidade. Os fluxos devem ser completáveis por teclado; foco visível, nomes acessíveis e anúncios de carregamento/erro devem ser verificados em teste automatizado e revisão assistiva.
- **NFR-04 — Performance (meta proposta):** em teste E2E com rede de referência de 10 Mbps e RTT de 100 ms, pelo menos 95% das consultas bem-sucedidas devem exibir clima e previsão em até 3 segundos, medidos do envio da busca à renderização dos dados. Incluir a latência do provedor; registrar separadamente tempo de geocoding e previsão.
- **NFR-05 — Timeout e disponibilidade (metas propostas):** cada chamada externa deve terminar em até 8 segundos. Disponibilidade mensal da consulta completa: pelo menos 99,5%, incluindo falhas do provedor e excluindo somente manutenção anunciada. Medir a partir de sondas sintéticas a cada 5 minutos.
- **NFR-06 — Atualidade (limite proposto):** exibir horário de referência em todas as respostas atuais. Se os dados tiverem mais de 3 horas, marcá-los como desatualizados e não apresentá-los como “atuais”. Validar o limite com o provedor e stakeholders.
- **NFR-07 — Privacidade:** sem contas, analytics ou persistência de buscas/preferências no servidor. Proposta para o MVP: não persistir cidade nem unidade no navegador; consultas e dados meteorológicos permanecem apenas durante a sessão de página. Retenção de logs de infraestrutura e obrigações legais precisam de aprovação antes do lançamento.
- **NFR-08 — Compatibilidade (proposta):** suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, em desktop e mobile. Validar o fluxo principal em pelo menos um navegador móvel iOS e um Android.
- **NFR-09 — Dependência externa:** antes do lançamento, confirmar termos de uso, atribuição exigida, limites de requisição e cobertura da Open-Meteo para as localidades priorizadas. A aplicação não deve depender de API key, conforme decisão do discovery.

## Edge Cases

- Entrada vazia: validar localmente, não consultar geocoding e focar o campo.
- Cidade sem correspondência: exibir estado vazio; não solicitar dados meteorológicos.
- Cidades homônimas: exigir seleção explícita usando região e país quando disponíveis.
- Caracteres Unicode, acentos, apóstrofos ou hífens: preservar o texto após remover espaços externos e enviar uma consulta válida.
- Falha HTTP, resposta inválida, rede indisponível ou timeout: exibir erro distinto de “cidade não encontrada” e oferecer tentativa manual.
- Resposta parcial ou código meteorológico desconhecido: exibir campos conhecidos e indicar os demais como indisponíveis.
- Falta de uma ou mais datas na previsão: manter as cinco datas; marcar somente os dados ausentes como indisponíveis.
- Mudança de dia ou fuso: calcular as cinco datas pelo fuso retornado para a cidade, não pelo fuso do dispositivo.
- Troca de unidade durante carregamento: aplicar a unidade selecionada quando os dados chegarem, sem nova chamada.
- Atualização da página: iniciar em Celsius e não restaurar cidade ou preferência anterior.

## Assumptions

- O canal inicial proposto é web responsiva; isso não foi decidido no discovery e requer aprovação.
- A previsão inicial é diária, com temperatura mínima/máxima e condição para cinco datas locais consecutivas.
- “Hoje” significa a data corrente no fuso da cidade selecionada.
- O clima atual mínimo é temperatura, condição localizada em pt-BR e horário de referência fornecido pelo serviço.
- Cada resultado de busca exige seleção explícita; o limite de apresentação é 10 resultados.
- Unidade escolhida não persiste após recarregar ou reabrir a página; a unidade padrão é Celsius.
- Timeout de 8 segundos, limite de atualidade de 3 horas, metas de performance/disponibilidade, matriz de navegadores e WCAG 2.2 AA são propostas de baseline até aprovação.
- A cobertura geográfica é limitada às localidades retornadas pela Open-Meteo; nenhuma cobertura nacional específica está garantida.

## Risks

| Risco | Impacto | Mitigação |
|---|---|---|
| Cobertura, termos ou disponibilidade da Open-Meteo não atendem ao uso real. | Busca ou consulta pode falhar em localidades prioritárias ou exceder limites de uso. | Validar cobertura, termos, atribuição e volume esperado antes do lançamento; monitorar falhas e latência por operação. |
| Geocoding retorna resultados homônimos ou não reconhece a grafia consultada. | A pessoa pode selecionar a localidade errada ou não encontrar a cidade. | Preservar Unicode, mostrar região/país e exigir seleção explícita; testar casos de acento e nomes homônimos. |
| Dados do provedor são antigos ou incompletos. | O app pode mostrar informação enganosa ou uma previsão incompleta. | Mostrar o horário de referência, aplicar o limite de atualidade proposto e indicar campos/datas indisponíveis. |
| Metas NFR ainda são propostas. | Equipes podem considerar qualidade de produção de formas diferentes. | Obter aprovação dos thresholds e da matriz de testes antes de estimar e executar a implementação. |
| Requisitos de plataforma e cobertura regional permanecem pendentes. | A solução pode ser construída para canal ou localidades incorretos. | Aprovar plataforma e mercado-alvo antes do plano técnico e validar geocoding/forecast nessas regiões. |

## Out of Scope

- Cadastro, login e contas de usuário.
- Persistência de buscas ou preferências no servidor.
- Geolocalização automática, favoritos, histórico, alertas e notificações.
- Previsões horárias; o baseline contém apenas resumos diários.
- Aplicativos nativos, caso a proposta de web responsiva seja aprovada como canal do MVP.
- Uso offline ou exibição de dados meteorológicos armazenados após encerrar a sessão.

## Open Questions

1. Stakeholders aprovam web responsiva como canal do MVP e a matriz de navegadores proposta?
2. Quais países/regiões e idiomas de busca são prioritários? A cobertura limitada ao que a Open-Meteo retorna é aceitável?
3. Temperatura/condição atual e condição/mínima/máxima diária são os campos suficientes para o MVP?
4. Stakeholders aprovam os thresholds propostos: 3 s p95, 99,5% mensal, timeout de 8 s, dados atuais até 3 h e WCAG 2.2 AA?
5. Os termos, limites de requisição e atribuição da Open-Meteo permitem o uso comercial previsto?
6. Stakeholders aprovam não persistir cidade nem unidade no navegador? Qual política legal de retenção se aplica aos logs de infraestrutura?
7. As personas usadas nas histórias representam usuários prioritários e foram validadas com pesquisa?
8. Qual métrica de sucesso do MVP será acompanhada sem analytics de usuário, por exemplo, taxa de consultas concluídas em sondas sintéticas?

## Traceability Matrix

| User Story | Requisito funcional | Acceptance Criteria | NFRs relevantes |
|---|---|---|---|
| US-01 — Buscar cidade | FR-01 | AC-01.1 a AC-01.5 | NFR-01 idioma/formato; NFR-02 responsividade; NFR-03 acessibilidade; NFR-04 performance; NFR-05 timeout/disponibilidade; NFR-07 privacidade; NFR-08 compatibilidade; NFR-09 provedor externo |
| US-02 — Consultar clima atual | FR-02 | AC-02.1 e AC-02.2 | NFR-01 idioma/formato; NFR-02 responsividade; NFR-03 acessibilidade; NFR-04 performance; NFR-05 timeout/disponibilidade; NFR-06 atualidade; NFR-07 privacidade; NFR-08 compatibilidade; NFR-09 provedor externo |
| US-03 — Consultar previsão de cinco dias | FR-03 | AC-03.1 e AC-03.2 | NFR-01 idioma/formato; NFR-02 responsividade; NFR-03 acessibilidade; NFR-04 performance; NFR-05 timeout/disponibilidade; NFR-06 atualidade; NFR-07 privacidade; NFR-08 compatibilidade; NFR-09 provedor externo |
| US-04 — Alternar unidade | FR-04 | AC-04.1 a AC-04.3 | NFR-01 idioma/formato; NFR-02 responsividade; NFR-03 acessibilidade; NFR-07 privacidade/persistência; NFR-08 compatibilidade |
| US-05 — Comunicar estado da consulta | FR-05 | AC-05.1 a AC-05.3 | NFR-01 idioma/formato; NFR-02 responsividade; NFR-03 acessibilidade; NFR-04 performance; NFR-05 timeout/disponibilidade; NFR-08 compatibilidade; NFR-09 provedor externo |

Os NFRs NFR-02 a NFR-08 incluem metas ou políticas ainda sujeitas às aprovações listadas em Open Questions; a rastreabilidade não implica aprovação desses valores.