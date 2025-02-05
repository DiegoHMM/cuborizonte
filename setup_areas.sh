#!/bin/bash

# Verifica se os parâmetros foram passados
if [ $# -ne 2 ]; then
    echo "Uso: $0 <json_file> <table_name>"
    exit 1
fi

# Parâmetros passados pelo usuário
JSON_FILE="$1"
TABLE_NAME="$2"

# Caminho para o script Python
PYTHON_SCRIPT="/handle_data_functions/insert_areas.py"

# Caminho base para os arquivos JSON
BASE_PATH="data/areas"

# Verifica se o arquivo JSON existe
if [ ! -f "$BASE_PATH/$JSON_FILE" ]; then
    echo "Arquivo JSON não encontrado: $BASE_PATH/$JSON_FILE"
    exit 1
fi

# Executa o script Python com os parâmetros e exibe o log do Python
docker-compose exec ows python3 "$PYTHON_SCRIPT" "/$BASE_PATH/$JSON_FILE" "$TABLE_NAME"

# Verifica se o script foi executado com sucesso
if [ $? -eq 0 ]; then
    echo "Script executado com sucesso!"
else
    echo "Erro ao executar o script. Verifique os logs acima para mais detalhes."
fi
