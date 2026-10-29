# Discovery: Aplicação de previsão do tempo

## Contexto

A empresa solicitou uma aplicação que permita consultar condições meteorológicas de cidades e acompanhar a previsão de cinco dias, considerando hoje e os quatro dias seguintes. A experiência deve oferecer temperaturas em Celsius ou Fahrenheit e funcionar também em dispositivos móveis. O briefing não define público-alvo, região de lançamento ou canais de distribuição.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que a pessoa usuária informe uma cidade para consultar seu clima. O comportamento para cidades homônimas ou não encontradas ainda precisa ser definido.
- **RF-02 — Ver clima atual:** apresentar as condições meteorológicas atuais da cidade selecionada.
- **RF-03 — Ver previsão de cinco dias:** apresentar a previsão para hoje e os quatro dias seguintes.
- **RF-04 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e exibir as temperaturas na unidade escolhida.
- **RF-05 — Usar em dispositivos móveis:** disponibilizar os fluxos de busca e consulta em dispositivos móveis.

## Requisitos Não-Funcionais

- **RNF-01 — Compatibilidade móvel:** a interface deve ser utilizável em telas de dispositivos móveis. O briefing não informa dimensões mínimas nem navegadores suportados.
- **RNF-02 — Clareza de apresentação:** condições atuais, previsão e unidade de temperatura devem ser compreensíveis para a pessoa usuária. Critérios de legibilidade e acessibilidade precisam ser definidos.
- **RNF-03 — Atualidade e confiabilidade dos dados:** os dados apresentados devem ser adequados para uma consulta de previsão do tempo. Frequência de atualização, tolerância a indisponibilidade e níveis de precisão ainda não foram especificados.

## Riscos

- **Ambiguidade na busca:** nomes de cidades repetidos ou variações de idioma e grafia podem levar à seleção de uma localidade incorreta.
- **Dependência de dados meteorológicos:** indisponibilidade, atraso ou cobertura desigual da fonte de dados pode impedir ou degradar as consultas.
- **Interpretação da previsão:** não está definido se “cinco dias” inclui o dia atual ou representa os cinco dias completos seguintes.
- **Experiência móvel insuficientemente definida:** sem dispositivos, navegadores e critérios de acessibilidade acordados, a validação de compatibilidade pode ser incompleta.
- **Expectativas divergentes sobre o escopo:** não há informação sobre localidades atendidas, idioma, detalhes das condições ou apresentação da previsão.

## Perguntas em Aberto

1. Quem são as pessoas usuárias prioritárias e em quais regiões a aplicação será lançada?
2. A busca deve aceitar nomes de cidades em quais idiomas? Deve oferecer sugestões enquanto a pessoa digita?
3. Como diferenciar cidades homônimas: estado, país, região ou outro identificador?
4. O clima atual deve incluir quais informações além da temperatura, como sensação térmica, umidade, vento e condição climática?
5. A previsão será diária, horária ou ambas?
6. A unidade escolhida deve persistir entre visitas ou sessões no dispositivo?
7. Quais requisitos de atualização, cobertura e disponibilidade dos dados meteorológicos devem ser atendidos?
8. Como a aplicação deve se comportar quando não houver resultados, a fonte estiver indisponível ou os dados estiverem desatualizados?
9. Quais navegadores, tamanhos de tela e critérios de acessibilidade devem ser suportados?
10. Há requisitos adicionais de privacidade ou analytics, além de não usar autenticação nem persistência de servidor?

## Decisões

- **Fonte de dados — Open-Meteo, sem API key.** Justificativa: atende à necessidade de dados meteorológicos sem exigir uma chave de API para o escopo definido. Resolve a escolha do provedor na pergunta 7; cobertura, atualização e disponibilidade ainda precisam de critérios.
- **Período da previsão — hoje e os quatro dias seguintes.** Justificativa: fixa uma interpretação única para “cinco dias”. Resolve se o dia atual está incluído na pergunta 5; a granularidade diária ou horária permanece em aberto.
- **Unidade padrão — Celsius.** Justificativa: estabelece um valor inicial consistente para a experiência em pt-BR. Resolve a unidade padrão da pergunta 6; persistência da escolha no dispositivo continua em aberto.
- **Sem autenticação e sem persistência de servidor.** Justificativa: mantém o escopo sem contas e sem armazenamento de dados associado a usuários no servidor. Resolve essa parte da pergunta 10; não define eventual persistência local nem outros requisitos de privacidade ou analytics.
- **Idioma da interface — pt-BR.** Justificativa: define o idioma inicial da experiência. Resolve a definição de idioma da pergunta 10; não determina formatos locais, como data e hora.

## Suposições

- A busca é feita pelo nome da cidade informado pela pessoa usuária; geolocalização automática não foi solicitada.
- A aplicação exibe informações meteorológicas, mas não precisa enviar alertas ou notificações.
- Celsius e Fahrenheit se aplicam às temperaturas do clima atual e da previsão.
- A experiência deve manter as mesmas capacidades essenciais em dispositivos móveis e em telas maiores.