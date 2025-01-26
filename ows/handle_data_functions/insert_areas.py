import os
import json
import psycopg2
from psycopg2.extras import execute_values
from psycopg2 import sql

# Configurações do banco de dados
db_config = {
    "hostname": "postgres",
    "username": "postgres",
    "password": "opendatacubepassword",
    "database": "postgres",
    "port": 5432,
}

def validate_inputs(json_path, table_name):
    """
    Valida se o arquivo JSON existe e se o nome da tabela é válido.
    """
    if not os.path.isfile(json_path):
        raise FileNotFoundError(f"Arquivo JSON não encontrado: {json_path}")
    if not table_name.isidentifier():
        raise ValueError(f"Nome da tabela inválido: {table_name}")

def create_table_if_not_exists(conn, table_name):
    """
    Cria a tabela no banco de dados se ela não existir.
    """
    with conn.cursor() as cursor:
        cursor.execute(
            sql.SQL(
                """
                CREATE TABLE IF NOT EXISTS {} (
                    id SERIAL PRIMARY KEY,
                    geometry GEOMETRY,
                    properties JSONB,
                    bbox FLOAT8[]
                )
                """
            ).format(sql.Identifier(table_name))
        )
        conn.commit()

def insert_data_to_postgis(json_path, table_name):
    """
    Lê o arquivo JSON e insere os dados na tabela do banco PostGIS.
    """
    # Valida entradas
    validate_inputs(json_path, table_name)

    # Conectando ao banco de dados
    conn = psycopg2.connect(
        host=db_config["hostname"],
        user=db_config["username"],
        password=db_config["password"],
        dbname=db_config["database"],
        port=db_config["port"],
    )

    try:
        # Criando a tabela se necessário
        create_table_if_not_exists(conn, table_name)

        # Lendo o arquivo JSON
        with open(json_path, "r") as f:
            data = json.load(f)

        # Validando o JSON
        features = data.get("features", [])
        if not features:
            raise ValueError(f"O arquivo JSON não contém 'features' ou está vazio: {json_path}")

        print(f"Processando {len(features)} features do arquivo JSON...")
        rows = []
        for feature in features:
            geometry = json.dumps(feature.get("geometry"))  # Converte para GeoJSON
            properties = json.dumps(feature.get("properties", {}))  # Converte propriedades para JSONB
            bbox = feature.get("bbox", [])  # Obtem o bbox
            rows.append((geometry, properties, bbox))

        # Inserindo os dados na tabela
        with conn.cursor() as cursor:
            # Query com múltiplos placeholders
            query = sql.SQL(
                """
                INSERT INTO {} (geometry, properties, bbox)
                VALUES (
                    ST_GeomFromGeoJSON(%s), %s, %s
                )
                """
            ).format(sql.Identifier(table_name))
            
            # Executar os inserts usando executemany
            cursor.executemany(query, rows)

        conn.commit()



        print(f"Dados inseridos com sucesso na tabela '{table_name}'!")

    except Exception as e:
        print(f"Erro: {e}")

    finally:
        conn.close()

# Exemplo de uso
if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("Uso: python3 insert_areas.py <json_file> <table_name>")
        sys.exit(1)

    json_path = sys.argv[1]
    table_name = sys.argv[2]

    try:
        insert_data_to_postgis(json_path, table_name)
    except Exception as e:
        print(f"Erro ao executar o script: {e}")
        sys.exit(1)
