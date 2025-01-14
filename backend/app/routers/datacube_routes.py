from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datacube import Datacube
import logging

router = APIRouter()

# Dependência para o Data Cube
def get_datacube():
    return Datacube(app="generate_datacube_multiple_products")

# Modelo da requisição
class MultiCubeRequest(BaseModel):
    products: list[str]  # Lista de produtos
    x_min: float         # Coordenada mínima X
    x_max: float         # Coordenada máxima X
    y_min: float         # Coordenada mínima Y
    y_max: float         # Coordenada máxima Y
    time: tuple[str, str]  # Intervalo de tempo (início, fim)
    resolution: float    # Resolução espacial
    measurements: list[str]

@router.post("/generate_cube_multiple")
def generate_data_cube_multiple(request: MultiCubeRequest, dc: Datacube = Depends(get_datacube)):
    """
    Endpoint para gerar cubos de dados de múltiplos produtos com suporte a intervalo de tempo.
    """
    try:
        results = {}

        # Parâmetros comuns da consulta
        query = {
            "x": (request.x_min, request.x_max),
            "y": (request.y_min, request.y_max),
            "time": (request.time[0], request.time[1]),
            "measurements": request.measurements,
            "resolution": (-request.resolution, request.resolution),
            "like": None,  # optional reference
            "dask_chunks": {"x": 512, "y": 512}  # added for chunking
        }

        # Iterar sobre os produtos e carregar dados
        for product in request.products:
            try:
                dataset = dc.load(product=product, **query)

                if dataset is None or len(dataset.dims) == 0:
                    results[product] = {"error": "Nenhum dado encontrado"}
                else:
                    # Converter o dataset para dicionário
                    results[product] = dataset.to_array().to_dict()
            except Exception as e:
                results[product] = {"error": str(e)}

        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar cubo de dados: {str(e)}")
