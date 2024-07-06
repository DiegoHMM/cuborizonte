# Cubo em uma Caixa (Cube in a Box)

O **Cubo em uma Caixa** oferece uma maneira simplificada de executar o [Open Data Cube](https://www.opendatacube.org), facilitando a gestão e análise de grandes volumes de dados de observação da Terra.

## Processamento de Dados

### Passos do Processamento:

1. **Verificação de Argumentos:** Confirma se todos os três argumentos necessários foram fornecidos. Em caso negativo, uma mensagem de uso é exibida e a execução é interrompida.
   
2. **Atribuição de Argumentos a Variáveis:** Os argumentos são armazenados em variáveis para facilitar seu uso ao longo do script.

3. **Inicialização de Serviços Docker:** O script aguarda 60 segundos para assegurar a correta inicialização dos serviços Docker antes de prosseguir com as configurações do sistema.

4. **Inicialização do Sistema de Banco de Dados:** Utiliza `docker-compose exec` para iniciar o sistema de banco de dados necessário para o Open Data Cube.

5. **Processamento de Dados:** Executa scripts Python para separar as bandas das imagens e construir os conjuntos de dados com base nos parâmetros fornecidos.

6. **Finalização:** Exibe uma mensagem indicando que as configurações foram concluídas com sucesso.

### Requisitos:

- Docker e Docker Compose instalados e configurados no sistema.
- Dados brutos organizados na pasta especificada por `<pasta_de_origem>`.
- O ambiente Docker deve ter acesso aos diretórios de dados brutos e processados.

### Uso:

#### Parâmetros:

- `<pasta_de_origem>`: Caminho para a pasta contendo os dados brutos.
- `<nome_do_produto>`: Identificador único do produto no Data Cube.
- `<ano>`: Ano correspondente aos dados a serem processados.

#### Sintaxe do Comando:

```bash
./process_raw_data.sh <pasta_de_origem> <nome_do_produto> <ano>
```

####  Exemplo de Uso:

```bash
./process_raw_data.sh ORTOFOTO_1999 bh_ortophoto_1999 1999
```


## Indexação do Banco de Dados

### Processo de Indexação:

  1. **Adição de Produtos ao Data Cube:** Inclui definições de produtos no Data Cube, utilizando arquivos YAML localizados no repositório GitHub especificado.

  2. **Indexação dos Conjuntos de Dados:** Realiza a indexação dos conjuntos de dados na pasta de origem fornecida, preparando-os para análise e visualização.

  3. **Atualizações do OWS (Open Web Services):** Atualiza o esquema e as visualizações do OWS para incorporar os novos produtos e conjuntos de dados.

  4. **Atualização de Uma Camada Específica:** Permite a atualização de uma camada específica no OWS, utilizando o nome do produto fornecido.

### Requisitos:

  - Docker e Docker Compose instalados e configurados no sistema.
  - Acesso ao repositório de produtos do Open Data Cube no GitHub.
  - Estrutura de diretórios correta para os dados de origem e processados.

### Uso:

#### Parâmetros:

  - `<nome_do_produto>`: Nome do produto no Data Cube, correspondendo ao nome do arquivo YAML no repositório GitHub.
  - `<pasta_de_origem>`: Pasta onde os dados de origem estão localizados e acessíveis pelo Docker Compose e pelo script.

#### Sintaxe do Comando:
```bash
./setup_datacube.sh <nome_do_produto> <pasta_de_origem>
```

####  Exemplo de Uso:
```bash
./setup_datacube.sh bh_ortophoto_1999 ORTOFOTO_1999
```