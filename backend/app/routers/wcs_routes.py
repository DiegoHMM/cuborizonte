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
        print("[DEBUG] Iniciando api_get_pixel_class...")
        print(f"[DEBUG] Coords recebidas: lat={coords.latitude}, lon={coords.longitude}")

        pixel_classes = []
        x, y = transform_coordinates(coords.latitude, coords.longitude)
        print(f"[DEBUG] Coordenadas transformadas: x={x}, y={y}")

        wcs_url = f"{ows_url}"
        print(f"[DEBUG] WCS URL: {wcs_url}")

        # Obtém os produtos
        products = get_products(wcs_url, 'bh_class')
        print(f"[DEBUG] Produtos retornados: {products}")

        # Para cada produto retornado
        for product in products:
            # Ajuste aqui:
            product_name = product.get('name')       # era 'product'
            date_times   = product.get('datetime', [])  # era 'date_time'

            print(f"[DEBUG] Processando product_name={product_name}, date_times={date_times}")

            # Obtenha a resolução
            resolution = get_layer_resolution(wcs_url, product_name)
            print(f"[DEBUG] Resolução obtida: {resolution}")

            # Iterar sobre cada data
            for dt in date_times:
                print(f"[DEBUG] Chamando get_pixel_class para data {dt}")
                pixel_class = get_pixel_class(
                    coords.latitude,
                    coords.longitude,
                    product_name, 
                    x, y, 
                    resolution, 
                    wcs_url,
                    dt  # passamos a data para a função
                )

                print(f"[DEBUG] pixel_class retornado: {pixel_class}")

                # Adiciona ao resultado
                pixel_classes.append({
                    'product': product_name,
                    'class': pixel_class,
                    'date_time': dt
                })

        print("[DEBUG] Finalizando api_get_pixel_class com sucesso")
        return pixel_classes

    except Exception as e:
        print(f"[ERROR] Ocorreu um erro em api_get_pixel_class: {e}")
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/get_products")
def api_get_products(product_prefix: str = Query("", description="Prefixo do produto")):
    try:
        wcs_url = f"{ows_url}"
        return get_products(wcs_url, product_prefix)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
