from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datacube import Datacube
import logging
from typing import List, Tuple

router = APIRouter()

def get_datacube():
    return Datacube(app="generate_datacube_multiple_products")

class MultiCubeRequest(BaseModel):
    products: List[str]
    x: Tuple[float, float]
    y: Tuple[float, float]
    time: Tuple[str, str]
    resolution: float
    measurements: List[str]
    output_crs: str  

@router.post("/generate_cube_multiple")
def generate_data_cube_multiple(request: MultiCubeRequest, dc: Datacube = Depends(get_datacube)):
    """
    Endpoint para gerar cubos de dados de múltiplos produtos com suporte a intervalo de tempo.
    """
    try:
        results = {}

        query = {
            "x": (request.x[0], request.x[1]),
            "y": (request.y[0], request.y[1]),
            "time": (request.time[0], request.time[1]),
            "measurements": request.measurements,
            "resolution": (-request.resolution, request.resolution),
            "output_crs": request.output_crs,
            "like": None,
            "dask_chunks": {"x": 512, "y": 512}
        }

        for product in request.products:
            try:
                dataset = dc.load(product=product, **query)

                if dataset is None or len(dataset.dims) == 0:
                    results[product] = {"error": "Nenhum dado encontrado"}
                else:
                    results[product] = dataset.to_array().to_dict()
            except Exception as e:
                results[product] = {"error": str(e)}

        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar cubo de dados: {str(e)}")

