import datacube
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()  # Carrega as variáveis de ambiente do .env

def validate_and_correct_intervals(query):
    # Validar e corrigir coordenadas X (longitude)
    if 'x' in query:
        lon_min, lon_max = min(query['x']), max(query['x'])
        query['x'] = (lon_min, lon_max)

    # Validar e corrigir coordenadas Y (latitude)
    if 'y' in query:
        lat_min, lat_max = min(query['y']), max(query['y'])
        query['y'] = (lat_min, lat_max)

    # Validar e corrigir intervalo de tempo
    if 'time' in query and query['time'][0] > query['time'][1]:
        query['time'] = (query['time'][1], query['time'][0])  # Inverter para garantir que o menor valor venha primeiro

def load_datacube_data(query):
    # Validar e corrigir intervalos no query
    validate_and_correct_intervals(query)

    # Inicializar o DataCube
    dc = datacube.Datacube()

    product_name = 'bh_ortophoto_1999'
    product_info = dc.index.products.get_by_name(product_name)

    # Verificação se o produto foi encontrado
    if product_info is None:
        raise ValueError(f"Produto '{product_name}' não encontrado no DataCube.")

    # Obter informações de resolução e CRS do produto
    resolution = product_info.definition['storage']['resolution']
    crs = product_info.definition['storage']['crs']

    # Atualizar o query para incluir resolução e crs, se necessário
    query.update({
        'output_crs': crs,
        'resolution': (resolution['x'], resolution['y']),
    })

    try:
        # Carregar os dados do DataCube
        ds = dc.load(
            product=product_name,
            **query
        )

        # Manipular os dados carregados
        selected_data = ds.isel(time=0).to_array().transpose('y', 'x', 'variable')
        data = selected_data.values

        if data.ndim == 4:
            data = data.squeeze(0)

        data = data[::1, ::1, :]  # Inverte os eixos para corrigir a orientação

        return data, crs

    except Exception as e:
        # Captura e log de qualquer erro que ocorra durante o carregamento
        print(f"Erro ao carregar dados do DataCube: {e}")
        raise HTTPException(status_code=500, detail=str(e))

