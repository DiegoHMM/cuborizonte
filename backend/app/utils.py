import requests
from pyproj import Transformer
import rasterio
from io import BytesIO
import xml.etree.ElementTree as ET
import os

def transform_coordinates(lat, lon):
    """
    Transforma coordenadas de EPSG:4326 para EPSG:31983.

    Parâmetros:
    - lat: Latitude em graus.
    - lon: Longitude em graus.

    Retorna:
    - x, y: Coordenadas em EPSG:31983.
    """
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:31983", always_xy=True)
    x, y = transformer.transform(lon, lat)
    return x, y

def get_layer_resolution(wcs_url, layer):
    """
    Obtém a resolução (tamanho do pixel) de uma camada via DescribeCoverage.

    Parâmetros:
    - wcs_url: URL do serviço WCS.
    - layer: Nome da camada (cobertura).

    Retorna:
    - resolution: Resolução da camada em unidades de coordenadas (metros).
    """
    # Faz a requisição DescribeCoverage
    params = {
        'SERVICE': 'WCS',
        'VERSION': '1.0.0',
        'REQUEST': 'DescribeCoverage',
        'COVERAGE': layer
    }
    response = requests.get(wcs_url, params=params)

    if response.status_code == 200:
        # Analisa o XML para obter a resolução
        root = ET.fromstring(response.content)

        # Define os namespaces
        ns = {
            'wcs': 'http://www.opengis.net/wcs',
            'gml': 'http://www.opengis.net/gml'
        }

        # Encontra o elemento RectifiedGrid
        rectified_grid = root.find('.//gml:RectifiedGrid', ns)
        if rectified_grid is None:
            raise Exception(f"RectifiedGrid não encontrado para a camada {layer}")

        # Obtém os offsetVectors
        offset_vectors = rectified_grid.findall('gml:offsetVector', ns)
        if len(offset_vectors) < 2:
            raise Exception(f"OffsetVectors insuficientes para a camada {layer}")

        # Processa os offsetVectors
        offset_vector_x = [float(i) for i in offset_vectors[0].text.strip().split()]
        offset_vector_y = [float(i) for i in offset_vectors[1].text.strip().split()]

        # Calcula a magnitude dos offsetVectors (resolução)
        res_x = (offset_vector_x[0] ** 2 + offset_vector_x[1] ** 2) ** 0.5
        res_y = (offset_vector_y[0] ** 2 + offset_vector_y[1] ** 2) ** 0.5

        # Retorna a resolução média (assumindo pixels quadrados)
        resolution = (abs(res_x) + abs(res_y)) / 2
        return resolution
    else:
        # Trata erros na requisição
        raise Exception(f"Falha ao obter a resolução da camada {layer}. Código HTTP: {response.status_code}")

def get_pixel_values(lat, lon, product):
    """
    Obtém os valores dos canais (r, g, b, dms) de um produto WCS para uma localização específica.

    Parâmetros:
    - lat: Latitude em graus (EPSG:4326).
    - lon: Longitude em graus (EPSG:4326).
    - product: Nome do produto (cobertura).

    Retorna:
    - Um dicionário com os nomes dos canais como chaves e os valores dos pixels como valores.
    """
    # Transforma as coordenadas para EPSG:31983
    x, y = transform_coordinates(lat, lon)

    # URL do serviço WCS
    ows_url = os.getenv('OWS_URL')
    wcs_url = f"{ows_url}/wcs"

    # Obtém a resolução do produto
    try:
        resolution = get_layer_resolution(wcs_url, product)
    except Exception as e:
        print(f"Erro ao obter a resolução: {e}")
        return None

    # Calcula o meio do tamanho do pixel
    half_pixel = resolution / 2

    # Define o BBOX em torno do ponto
    minx = x - half_pixel
    maxx = x + half_pixel
    miny = y - half_pixel
    maxy = y + half_pixel

    # Parâmetros da requisição GetCoverage
    params = {
        'SERVICE': 'WCS',
        'VERSION': '1.0.0',
        'REQUEST': 'GetCoverage',
        'COVERAGE': product,
        'CRS': 'EPSG:31983',
        'BBOX': f'{minx},{miny},{maxx},{maxy}',
        'WIDTH': '1',
        'HEIGHT': '1',
        'FORMAT': 'GeoTIFF'
    }

    # Faz a requisição GetCoverage
    response = requests.get(wcs_url, params=params)

    if response.status_code == 200:
        # Lê o dado GeoTIFF da resposta
        with rasterio.open(BytesIO(response.content)) as dataset:
            # Lê os valores dos pixels para cada banda
            pixel_values = {}
            for idx in range(1, dataset.count + 1):
                band = dataset.read(idx)
                value = band[0, 0]
                # Mapear o índice da banda para o nome do canal
                if idx == 1:
                    channel = 'R'
                elif idx == 2:
                    channel = 'G'
                elif idx == 3:
                    channel = 'B'
                elif idx == 4:
                    channel = 'DMS'
                else:
                    channel = f'Banda_{idx}'
                pixel_values[channel] = value
        return pixel_values
    else:
        print(f"Falha ao obter o valor do pixel. Código HTTP: {response.status_code}")
        return None
