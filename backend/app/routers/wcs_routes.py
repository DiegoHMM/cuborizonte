import os
from fastapi import APIRouter, HTTPException, Query
from app.models import Coordinates
from app.utils.transform import transform_coordinates
from app.utils.wcs import get_layer_resolution, get_pixel_class,  get_products

ows_url = os.getenv('OWS_URL', 'http://localhost:8000')


router = APIRouter()

@router.post("/get_pixel_class")
def api_get_pixel_class(coords: Coordinates):
    try:
        pixel_classes = []
        x, y = transform_coordinates(coords.latitude, coords.longitude)
        wcs_url = f"{ows_url}"
        #get products
        products = get_products(wcs_url, 'bh_class')

        for product in products:
            resolution = get_layer_resolution(wcs_url, product.get('name'))
            pixel_class = get_pixel_class(coords.latitude, coords.longitude, product.get('name'), x, y, resolution, wcs_url)
            pixel_classes.append({'product': product.get('name'), 'class': pixel_class, 'date_time': product.get('datetime')})
        return pixel_classes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/get_products")
def api_get_products(product_prefix: str = Query(..., description="Prefixo do produto")):
    try:
        wcs_url = f"{ows_url}"
        return get_products(wcs_url, product_prefix)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))