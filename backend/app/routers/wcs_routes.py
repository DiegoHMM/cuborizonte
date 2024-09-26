import os
from fastapi import APIRouter, HTTPException
from app.models import Coordinates
from app.utils.transform import transform_coordinates
from app.utils.wcs import get_layer_resolution, get_pixel_class, get_available_products_with_metadata

ows_url = os.getenv('OWS_URL', 'http://localhost:8000')


router = APIRouter()

@router.post("/get_pixel_class")
def api_get_pixel_class(coords: Coordinates):
    try:
        pixel_classes = []
        x, y = transform_coordinates(coords.latitude, coords.longitude)
        wcs_url = f"{ows_url}"
        #get products
        products = get_available_products_with_metadata(wcs_url)

        for product in products:
            resolution = get_layer_resolution(wcs_url, product.get('name'))
            pixel_class = get_pixel_class(coords.latitude, coords.longitude, product.get('name'), x, y, resolution, wcs_url)
            pixel_classes.append({'product': product.get('name'), 'class': pixel_class, 'date_time': product.get('datetime')})
        return pixel_classes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/get_wcs_products")
def api_get_wcs_products():
    try:
        return get_available_products_with_metadata(ows_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))