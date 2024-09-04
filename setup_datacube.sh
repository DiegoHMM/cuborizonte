#!/bin/bash

# Verificar se dois argumentos foram passados
if [ "$#" -ne 2 ]; then
    echo "Uso: $0 <nome_do_produto> <pasta_de_origem>"
    exit 1
fi

# Atribuir argumentos a variáveis
NOME_DO_PRODUTO=$1
PASTA_DE_ORIGEM=$2

# Parar o script em caso de erro
set -e


#start db
docker-compose exec ows datacube -v system init

# Adicionar produtos ao Data Cube
docker-compose exec ows datacube product add "https://raw.githubusercontent.com/DiegoHMM/cuborizonte_products/main/${NOME_DO_PRODUTO}.yaml"
docker-compose exec ows datacube product add "https://raw.githubusercontent.com/DiegoHMM/cuborizonte_products/main/${NOME_DO_PRODUTO}_lowres.yaml"

# Indexar os datasets
docker-compose exec ows python /handle_data_functions/indexer.py "/data/processed/${PASTA_DE_ORIGEM}"

# Atualizações do OWS
docker-compose exec ows datacube-ows-update --schema --role postgres
docker-compose exec ows datacube-ows-update --views

# Atualizar uma camada específica
docker-compose exec ows datacube-ows-update $NOME_DO_PRODUTO

# Reiniciar o container ows
docker-compose restart ows