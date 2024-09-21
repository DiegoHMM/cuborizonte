import os
from fastapi import APIRouter, HTTPException
from app.models import Coordinates
from app.utils.transform import transform_coordinates
from app.utils.wcs import get_layer_resolution, get_pixel_values, get_available_products_with_metadata

ows_url = os.getenv("OWS_URL", "http://localhost:8000")  # Valor padrão para localhost caso a variável não exista


router = APIRouter()

@router.post("/get_pixel_values")
def api_get_pixel_values(coords: Coordinates):
    try:
        x, y = transform_coordinates(coords.latitude, coords.longitude)
        wcs_url = f"{ows_url}/wcs"
        resolution = get_layer_resolution(wcs_url, 'bh_ortophoto_2007_2015')
        pixel_values = get_pixel_values(coords.latitude, coords.longitude, 'bh_ortophoto_2007_2015', x, y, resolution, wcs_url)
        return {"latitude": coords.latitude, "longitude": coords.longitude, "pixel_values": pixel_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/get_wcs_products")
def api_get_wcs_products(wcs_url: str):
    try:
        return get_available_products_with_metadata(wcs_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))