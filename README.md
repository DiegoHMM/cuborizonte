# Cuborizonte in a Box

The Cube in a Box is a simple way to run the [Open Data Cube](https://www.opendatacube.org).


## Processamento de dados:

    Verificação de Argumentos: Garante que todos os três argumentos necessários são fornecidos. Caso contrário, exibe uma mensagem de uso e termina a execução.
    
    Atribuição de Argumentos a Variáveis: Armazena os argumentos fornecidos em variáveis para uso fácil ao longo do script.

    Inicialização de Serviços Docker: O script aguarda 60 segundos (ajustável conforme necessário) para permitir que os serviços Docker inicializem corretamente antes de prosseguir com as configurações do sistema.

    Inicialização do Sistema de Banco de Dados: Utiliza o comando docker-compose exec para inicializar o sistema de banco de dados necessário para o Open Data Cube.

    Processamento de Dados: Executa scripts Python para dividir as bandas das imagens e construir os conjuntos de dados com base nos parâmetros fornecidos.

    Finalização: Exibe uma mensagem indicando a conclusão das configurações.

### Requisitos:
    Docker e Docker Compose devem estar instalados e configurados no sistema.
    Os dados brutos devem estar organizados na pasta especificada por <pasta_de_origem>.
    O ambiente Docker deve ter acesso aos diretórios de dados brutos e processados.


### Uso:

  #### Parâmetros:
      `<pasta_de_origem>:` O caminho para a pasta contendo os dados brutos.
      v<nome_do_produto>:` O identificador único do produto no Data Cube.
      `<ano>:` O ano correspondente aos dados a serem processados.

  #### Sintaxe do comando:
      `./start_processing.sh <pasta_de_origem> <nome_do_produto> <ano>`

  #### Exemplo de uso:
      `./start_processing.sh ORTOFOTO_1999 bh_ortophoto_1999 1999`



## Indexação do banco de dados:

  Adição de Produtos ao Data Cube: Adiciona definições de produtos ao Data Cube, utilizando arquivos YAML localizados no repositório GitHub especificado.

  Indexação dos Conjuntos de Dados: Indexa os conjuntos de dados localizados na pasta de origem fornecida, preparando-os para análise e visualização.

  Atualizações do OWS (Open Web Services): Atualiza o esquema e as visualizações do OWS para refletir os novos produtos e conjuntos de dados adicionados ao Data Cube.

  Atualização de Uma Camada Específica: Atualiza uma camada específica no OWS, utilizando o nome do produto fornecido.

### Requisitos

    Docker e Docker Compose instalados e configurados em seu sistema.
    Acesso ao repositório de produtos do Cubo Horizonte no GitHub.
    Estrutura de diretórios correta para os dados de origem e processados, conforme esperado pelo script.

### Uso

  #### Parâmetros:
      `nome_do_produto:` O nome do produto no Data Cube. Este nome deve corresponder exatamente ao nome do arquivo YAML no repositório GitHub.
      `pasta_de_origem:` A pasta onde os dados de origem estão localizados. Esta pasta deve estar acessível pelo Docker Compose e pelo script.

  #### Sintaxe do comando:
      `./nome_do_script.sh <nome_do_produto> <pasta_de_origem>`
  #### Exemplo de uso:
      `./nome_do_script.sh bh_ortophoto_1999 ORTOFOTO_1999`



