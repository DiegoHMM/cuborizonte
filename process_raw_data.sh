#!/bin/bash

# Verificar se três argumentos foram passados
if [ "$#" -ne 3 ]; then
    echo "Uso: $0 <pasta_de_origem> <nome_do_produto> <ano>"
    exit 1
fi

# Atribuir argumentos a variáveis
PASTA_DE_ORIGEM=$1
NOME_DO_PRODUTO=$2
ANO=$3

echo "Aguardando os serviços inicializarem..."
# Ajuste o tempo de espera conforme necessário
sleep 60

echo "Iniciando configurações do sistema..."

# Inicializar o sistema de DBs
docker-compose exec ows datacube -v system init

# Dividir bandas e construir dataset
docker-compose exec ows python /handle_data_functions/divide_bands.py "/data/raw/${PASTA_DE_ORIGEM}" "/data/processed/${PASTA_DE_ORIGEM}"
docker-compose exec ows python /handle_data_functions/build_dataset_ortofoto.py "/data/processed/${PASTA_DE_ORIGEM}" "/data/raw/${PASTA_DE_ORIGEM}" $NOME_DO_PRODUTO $ANO

echo "Configurações concluídas."
