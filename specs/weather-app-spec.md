# Especificação de Produto: Weather App

## Overview

O Weather App permite pesquisar uma cidade, consultar suas condições meteorológicas atuais e ver uma previsão de cinco dias. A interface será em pt-BR, a unidade inicial será Celsius e a pessoa usuária poderá alternar para Fahrenheit. O período da previsão está definido como hoje e os quatro dias seguintes. A fonte escolhida é Open-Meteo, sem API key. O produto não terá autenticação nem persistência de dados no servidor.

Esta especificação deriva de `specs/discovery.md`. Onde o discovery não tomou uma decisão, o texto identifica a proposta como premissa a validar, em vez de tratá-la como compromisso aprovado.

## Functional Requirements

- **FR-01 — Buscar cidade:** permitir que a pessoa usuária pesquise uma cidade pelo nome e escolha o resultado correspondente.
- **FR-02 — Consultar clima atual:** apresentar as condições atuais para a cidade selecionada, incluindo ao menos temperatura e descrição da condição, conforme disponibilidade dos dados.
- **FR-03 — Consultar previsão de cinco dias:** apresentar a previsão para hoje e os quatro dias seguintes, na granularidade diária como premissa inicial a validar.
- **FR-04 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e atualizar as temperaturas exibidas. Celsius é a unidade inicial.
- **FR-05 — Comunicar estado da consulta:** informar quando uma busca ou consulta está carregando, não encontra resultados ou não pode ser concluída.

## User Stories

- **US-01 (FR-01 — Buscar cidade):** Como pessoa que se desloca diariamente, quero buscar minha cidade para encontrar rapidamente a localidade cujo clima preciso consultar.
- **US-02 (FR-02 — Consultar clima atual):** Como pessoa que se desloca diariamente, quero ver as condições meteorológicas atuais da cidade escolhida para decidir o que esperar ao sair.
- **US-03 (FR-03 — Consultar previsão de cinco dias):** Como pessoa que planeja atividades, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher quando realizar uma atividade.
- **US-04 (FR-04 — Alternar unidade de temperatura):** Como pessoa que prefere Fahrenheit, quero alternar a unidade das temperaturas para compreender o clima atual e a previsão na escala que uso.
- **US-05 (FR-05 — Comunicar estado da consulta):** Como pessoa que se desloca diariamente, quero saber quando uma consulta está carregando ou falhou para entender se devo aguardar ou tentar novamente.

## Acceptance Criteria

- **AC-01.1 (FR-01)**
	- **Given:** o serviço de busca retorna duas ou mais cidades correspondentes ao texto pesquisado.
	- **When:** os resultados da busca são exibidos.
	- **Then:** cada resultado mostra o nome da cidade e, quando fornecidos pelo serviço, a região administrativa e o país; nenhuma cidade é selecionada automaticamente.
- **AC-01.2 (FR-01)**
	- **Given:** o serviço de busca não retorna cidades correspondentes.
	- **When:** a busca termina.
	- **Then:** uma mensagem em pt-BR informa que nenhuma cidade foi encontrada e a pessoa pode iniciar outra busca.
- **AC-02.1 (FR-02)**
	- **Given:** uma cidade foi selecionada e a resposta contém temperatura atual de 20 °C e condição “Nublado”.
	- **When:** a consulta do clima atual termina.
	- **Then:** a tela exibe o nome da cidade selecionada, “20 °C” e “Nublado”.
- **AC-02.2 (FR-02)**
	- **Given:** a resposta da fonte contém horário de referência dos dados.
	- **When:** o clima atual é exibido.
	- **Then:** esse horário fica visível junto às informações da cidade consultada.
- **AC-03.1 (FR-03)**
	- **Given:** uma cidade selecionada tem dados de previsão para hoje e os quatro dias seguintes no fuso local.
	- **When:** a previsão é exibida.
	- **Then:** são mostradas cinco datas locais consecutivas, começando por hoje e terminando quatro dias depois.
- **AC-03.2 (FR-03)**
	- **Given:** falta dado de previsão para uma das cinco datas.
	- **When:** a previsão é exibida.
	- **Then:** a data continua identificável, o dado ausente é indicado como indisponível e nenhum valor numérico zero é usado como substituto.
- **AC-04.1 (FR-04)**
	- **Given:** uma consulta de clima é aberta sem alteração prévia de unidade.
	- **When:** as temperaturas são exibidas pela primeira vez.
	- **Then:** elas usam Celsius e o símbolo “°C”.
- **AC-04.2 (FR-04)**
	- **Given:** a tela exibe temperaturas de 20 °C para o clima atual e 10 °C para a previsão.
	- **When:** a pessoa seleciona Fahrenheit.
	- **Then:** as temperaturas correspondentes passam a “68 °F” e “50 °F”, e a cidade e as datas exibidas permanecem inalteradas.
- **AC-04.3 (FR-04)**
	- **Given:** a tela exibe 68 °F e 50 °F para a mesma cidade e as mesmas datas.
	- **When:** a pessoa seleciona Celsius.
	- **Then:** as temperaturas passam a “20 °C” e “10 °C”, sem uma nova busca de cidade.
- **AC-05.1 (FR-05)**
	- **Given:** uma busca ou consulta foi iniciada e a resposta ainda não chegou.
	- **When:** a solicitação permanece pendente.
	- **Then:** a interface exibe um indicador de carregamento perceptível e acessível.
- **AC-05.2 (FR-05)**
	- **Given:** a fonte retorna erro ou não responde dentro do limite da solicitação.
	- **When:** a busca ou consulta falha.
	- **Then:** a interface exibe uma mensagem de erro em pt-BR e uma ação para tentar novamente.
- **AC-05.3 (FR-05)**
	- **Given:** a resposta contém alguns campos meteorológicos, mas omite outros.
	- **When:** os dados são exibidos.
	- **Then:** os campos recebidos são apresentados, os campos ausentes são indicados como indisponíveis e nenhum campo ausente é preenchido com zero ou outro valor presumido.

## Non-Functional Requirements

- **NFR-01 — Idioma:** toda a interface e as mensagens de estado devem estar em pt-BR. Datas e horários devem ser apresentados de forma compreensível para esse idioma; o formato exato de data/hora ainda requer confirmação.
- **NFR-02 — Uso em dispositivos móveis:** os fluxos de busca, consulta atual, previsão e alternância de unidade devem ser utilizáveis em dispositivos móveis e telas maiores. Como alvo inicial a validar, a interface não deve exigir rolagem horizontal em largura de 320 px ou superior.
- **NFR-03 — Acessibilidade:** busca e alternância de unidade devem ser operáveis por teclado, ter rótulos acessíveis e manter foco perceptível. WCAG 2.2 nível AA é uma meta proposta, ainda sujeita à aprovação.
- **NFR-04 — Atualidade dos dados:** a interface deve apresentar o horário de referência quando fornecido pela fonte e não deve rotular dados antigos como atuais. A idade máxima aceitável dos dados ainda precisa ser definida.
- **NFR-05 — Performance:** meta proposta para validação: 95% das consultas bem-sucedidas devem exibir clima e previsão em até 3 segundos sob condições de rede acordadas. A medição deve deixar explícito se inclui o tempo de resposta do provedor externo.
- **NFR-06 — Disponibilidade e resiliência:** a aplicação deve tratar falhas da fonte sem apresentar dados incorretos como atuais e deve permitir nova tentativa. Meta de disponibilidade e política de cache/uso offline ainda não foram definidas.
- **NFR-07 — Privacidade e dados:** não deve haver autenticação nem persistência de dados no servidor. Logs, analytics, armazenamento local e retenção de dados operacionais precisam de decisão antes de serem adicionados.
- **NFR-08 — Compatibilidade:** navegadores, sistemas operacionais e dimensões oficialmente suportados ainda precisam ser acordados; o requisito de uso móvel não substitui essa matriz.

## Edge Cases

- A busca retorna várias cidades com o mesmo nome: exibir opções que permitam distingui-las e exigir escolha da pessoa usuária.
- A busca não retorna cidades: apresentar estado vazio e permitir editar ou repetir a consulta.
- A conexão ou Open-Meteo está indisponível, excede o tempo limite ou rejeita a solicitação: informar a falha e oferecer nova tentativa.
- A resposta não contém todos os dados esperados: apresentar apenas campos disponíveis e indicar a ausência, sem inventar valores.
- A previsão cruza a meia-noite ou um limite de fuso: agrupar os dias de acordo com o fuso da localidade, premissa que precisa ser confirmada.
- A pessoa alterna a unidade enquanto uma consulta está carregando: aplicar a unidade escolhida ao resultado assim que ele for exibido.
- A previsão não contém todos os cinco dias: informar quais datas não têm dados, sem substituir por previsões de outras datas.
- A pessoa atualiza ou reabre a página: o comportamento de persistência da unidade ainda não está definido; até decisão, a unidade garantida é Celsius ao iniciar uma nova consulta.

## Assumptions

- A pessoa usuária informa o nome da cidade; geolocalização automática não faz parte do fluxo base.
- A previsão será exibida como resumo diário de cinco datas locais consecutivas. A escolha de granularidade diária é provisória e deve ser confirmada.
- As datas da previsão seguem o calendário e o fuso horário da localidade consultada.
- O mínimo de clima atual compreende temperatura e descrição da condição quando fornecidas pela fonte; outros campos ainda serão definidos.
- Sem persistência no servidor significa que buscas e preferências não serão salvas em uma conta. A existência de armazenamento local não está decidida.
- Os requisitos NFR com metas numéricas ou padrões propostos não são compromissos aprovados até validação dos stakeholders.

## Risks

| Risco | Impacto | Mitigação |
|---|---|---|
| Cobertura, atualização ou disponibilidade da Open-Meteo não atende às localidades ou expectativas escolhidas. | Consultas incompletas, desatualizadas ou indisponíveis. | Validar cobertura e comportamento do serviço para as regiões-alvo; definir limite de idade dos dados e estratégia de falha antes de fechar os critérios de produção. |
| Cidades homônimas ou variações de grafia levam à localidade errada. | A previsão pode ser atribuída a uma cidade diferente da pretendida. | Apresentar região e país nos resultados quando disponíveis e exigir seleção quando houver ambiguidade. |
| Granularidade diária e fuso horário ainda são premissas. | A apresentação de datas pode divergir da expectativa dos usuários. | Validar com stakeholders e usuários; definir regras explícitas de data local na especificação final. |
| Metas de performance, disponibilidade, acessibilidade e compatibilidade ainda não foram aprovadas. | O produto pode não atender às expectativas ou não ter critérios objetivos de aceite. | Aprovar metas, matriz de dispositivos e padrão de acessibilidade antes do plano técnico e dos testes finais. |
| O discovery contém riscos e referências a perguntas que ficaram desatualizados após as decisões de cinco dias e idioma. | Artefatos posteriores podem herdar contradições. | Tratar as decisões explícitas desta especificação como fonte vigente e revisar o discovery para alinhá-lo antes de usá-lo como entrada para outras etapas. |

## Out of Scope

- Cadastro, login e contas de usuário.
- Persistência de buscas ou preferências no servidor.
- Geolocalização automática, favoritos, histórico de consultas, alertas e notificações; não foram solicitados no escopo base e devem ser reavaliados se stakeholders os priorizarem.
- Aplicativos nativos; o canal final ainda precisa ser confirmado, portanto esta exclusão é provisória.
- Previsões horárias; a granularidade diária é a premissa da especificação inicial, ainda pendente de validação.

## Open Questions

1. O produto será web responsivo, PWA, aplicativo nativo ou uma combinação? Quais navegadores, sistemas e tamanhos de tela serão suportados?
2. Quem são os usuários prioritários e quais regiões/cidades precisam ter cobertura garantida?
3. Como devem ser tratados idiomas, acentos, nomes alternativos e cidades homônimas? Sugestões durante a digitação são necessárias?
4. Quais campos devem compor o clima atual e cada resumo diário da previsão?
5. A previsão diária é suficiente ou também são necessários dados horários? Qual é a regra de fuso e de início do dia?
6. A unidade escolhida deve persistir após atualizar ou reabrir a página? Se sim, por quanto tempo e em qual local?
7. Qual idade máxima dos dados é aceitável? Quais metas de atualização, disponibilidade e precisão são esperadas?
8. Qual política aplicar a cache, modo offline, timeouts e indisponibilidade da Open-Meteo? É necessária uma fonte alternativa?
9. Os alvos propostos de largura mínima de 320 px, WCAG 2.2 AA e performance p95 de 3 segundos são aceitáveis? Em quais dispositivos e condições de rede devem ser medidos?
10. Há requisitos de analytics, logs, retenção ou privacidade que complementem a ausência de autenticação e persistência de servidor?
11. Qual métrica de produto define sucesso para o MVP e quais critérios indicam que a cobertura funcional é suficiente?