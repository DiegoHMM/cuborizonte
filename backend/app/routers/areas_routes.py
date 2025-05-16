from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List
import logging

DB_CONFIG = {
    "host": "postgres",
    "user": "postgres",
    "password": "opendatacubepassword",
    "dbname": "cuborizonte_db",
    "port": 5432,
}

logger = logging.getLogger(__name__)

router = APIRouter()

class AreaResponse(BaseModel):
    nome: str
    bounding_box: List[float]


def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            dbname=DB_CONFIG["dbname"],
            port=DB_CONFIG["port"],
            cursor_factory=RealDictCursor,
        )
        return conn
    except psycopg2.Error as e:
        logger.error(f"Erro ao conectar ao banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")


@router.get("/areas", response_model=List[AreaResponse])
def get_area(table_name: str):
    """
    Retorna os nomes e bounding boxes dos area da tabela especificada.
    """
    query = f"""
        SELECT
            (properties ->> 'NOME') AS nome,
            bbox
        FROM {table_name}
        WHERE bbox IS NOT NULL
    """

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
            if not result:
                raise HTTPException(status_code=404, detail="Nenhuma area encontrado.")
    except psycopg2.Error as e:
        logger.error(f"Erro ao consultar o banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao consultar o banco de dados")
    finally:
        conn.close()

    return [{"nome": row["nome"], "bounding_box": row["bbox"]} for row in result]
