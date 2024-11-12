#!/bin/bash

# Verificar se pelo menos três argumentos foram passados
if [ "$#" -lt 3 ]; then
    echo "Uso: $0 <pasta_de_origem> <nome_do_produto> <ano> [nomes_das_bandas...]"
    exit 1
fi

# Atribuir os três primeiros argumentos a variáveis
PASTA_DE_ORIGEM=$1
NOME_DO_PRODUTO=$2
ANO=$3

# Capturar nomes das bandas, se fornecidos
if [ "$#" -gt 3 ]; then
    BAND_NAMES="${@:4}" # Pega todos os argumentos a partir do quarto (nomes das bandas)
    BAND_NAMES_FLAG="--band-names ${BAND_NAMES}"
else
    BAND_NAMES_FLAG="" # Se nenhum nome de banda for fornecido, não passa o argumento
fi

echo "Aguardando os serviços inicializarem..."
# Ajuste o tempo de espera conforme necessário
sleep 30

echo "Iniciando configurações do sistema..."

# Inicializar o sistema de DBs
docker-compose exec ows datacube -v system init

# Dividir bandas e construir dataset
docker-compose exec ows python /handle_data_functions/divide_bands.py "/data/raw/${PASTA_DE_ORIGEM}" "/data/processed/${PASTA_DE_ORIGEM}" ${BAND_NAMES_FLAG}
docker-compose exec ows python /handle_data_functions/build_dataset_ortofoto.py "/data/processed/${PASTA_DE_ORIGEM}" "/data/raw/${PASTA_DE_ORIGEM}" $NOME_DO_PRODUTO $ANO ${BAND_NAMES_FLAG}

echo "Configurações concluídas."
