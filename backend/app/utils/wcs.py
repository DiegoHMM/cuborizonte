import numpy as np
import requests
import xml.etree.ElementTree as ET
import rasterio
from io import BytesIO


def get_available_products_with_metadata(wcs_url):
    """
    Obtém a lista de produtos disponíveis no serviço WCS com metadados adicionais.

    Parâmetros:
    - wcs_url: URL do serviço WCS.

    Retorna:
    - Uma lista de dicionários contendo metadados dos produtos.
    """
    # Parâmetros da requisição GetCapabilities
    params = {
        'SERVICE': 'WCS',
        'VERSION': '1.0.0',
        'REQUEST': 'GetCapabilities'
    }

    # Faz a requisição GetCapabilities
    response = requests.get(wcs_url, params=params)

    if response.status_code == 200:
        # Analisa o XML de resposta
        root = ET.fromstring(response.content)

        # Define os namespaces
        ns = {
            'wcs': 'http://www.opengis.net/wcs',
            'xlink': 'http://www.w3.org/1999/xlink',
            'gml': 'http://www.opengis.net/gml'
        }

        # Encontra todos os elementos CoverageOfferingBrief
        coverage_offerings = root.findall('.//wcs:CoverageOfferingBrief', ns)

        products = []

        for coverage in coverage_offerings:

            product_info = {}
            # Nome da cobertura
            name_elem = coverage.find('wcs:name', ns)
            if name_elem is not None:
                product_info['name'] = name_elem.text

            # Título ou descrição
            label_elem = coverage.find('wcs:label', ns)
            if label_elem is not None:
                product_info['label'] = label_elem.text

            # Resumo
            desc_elem = coverage.find('wcs:description', ns)
            if desc_elem is not None:
                product_info['description'] = desc_elem.text

            date_time = get_coverage_datetime(wcs_url, product_info['name'])



            products.append({'name': product_info['name'], 'label': product_info['label'], 'description': product_info['description'], 'datetime': date_time})

        return products
    else:
        # Trata erros na requisição
        raise Exception(f"Falha ao obter as capacidades do serviço WCS. Código HTTP: {response.status_code}")

def get_plans_products(wcs_url):
    all_products = get_available_products_with_metadata(wcs_url)
    plans_products = []
    for product in all_products:
        if product['name'].startswith('bh_planta_'):
            plans_products.append(product)
    return plans_products

def get_ortho_products(wcs_url):
    all_products = get_available_products_with_metadata(wcs_url)
    ortho_products = []
    for product in all_products:
        if product['name'].startswith('bh_ortophoto'):
            ortho_products.append(product)
    return ortho_products

def get_classified_products(wcs_url):
    all_products = get_available_products_with_metadata(wcs_url)
    classified_products = []
    for product in all_products:
        if product['name'].startswith('bh_class'):
            classified_products.append(product)
    return classified_products

def get_coverage_datetime(wcs_url, coverage_name):
    params = {
        'SERVICE': 'WCS',
        'VERSION': '1.0.0',
        'REQUEST': 'DescribeCoverage',
        'COVERAGE': coverage_name
    }
    response = requests.get(wcs_url, params=params)
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        ns = {
            'wcs': 'http://www.opengis.net/wcs',
            'gml': 'http://www.opengis.net/gml',
            'xlink': 'http://www.w3.org/1999/xlink',
            'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
        }

        # Tenta encontrar o elemento que contém o datetime
        datetime_value = None

        # Tenta extrair de um elemento 'timePosition'
        time_positions = root.findall('.//gml:timePosition', ns)
        if time_positions:
            datetime_value = time_positions[0].text.strip()
            return datetime_value

        # Se não encontrar, tente acessar metadados personalizados
        metadata_links = root.findall('.//wcs:metadataLink', ns)
        for metadata_link in metadata_links:
            href = metadata_link.get('{http://www.w3.org/1999/xlink}href')
            if href:
                metadata_response = requests.get(href)
                if metadata_response.status_code == 200:
                    try:
                        metadata_content = metadata_response.content.decode('utf-8')
                        # Assume que o metadado está em formato YAML
                        import yaml
                        metadata_dict = yaml.safe_load(metadata_content)
                        datetime_value = metadata_dict.get('properties', {}).get('datetime')
                        if datetime_value:
                            return datetime_value
                    except Exception as e:
                        print(f"Erro ao analisar metadados: {e}")
                        continue

        return None
    else:
        raise Exception(f"Falha ao obter DescribeCoverage para {coverage_name}. Código HTTP: {response.status_code}")

def get_layer_resolution(wcs_url, layer):
    params = {
        'SERVICE': 'WCS',
        'VERSION': '1.0.0',
        'REQUEST': 'DescribeCoverage',
        'COVERAGE': layer
    }
    response = requests.get(wcs_url, params=params)

    if response.status_code == 200:
        root = ET.fromstring(response.content)
        ns = {'wcs': 'http://www.opengis.net/wcs', 'gml': 'http://www.opengis.net/gml'}
        rectified_grid = root.find('.//gml:RectifiedGrid', ns)
        if rectified_grid is None:
            raise Exception(f"RectifiedGrid não encontrado para a camada {layer}")
        offset_vectors = rectified_grid.findall('gml:offsetVector', ns)
        if len(offset_vectors) < 2:
            raise Exception(f"OffsetVectors insuficientes para a camada {layer}")
        offset_vector_x = [float(i) for i in offset_vectors[0].text.strip().split()]
        offset_vector_y = [float(i) for i in offset_vectors[1].text.strip().split()]
        res_x = (offset_vector_x[0] ** 2 + offset_vector_x[1] ** 2) ** 0.5
        res_y = (offset_vector_y[0] ** 2 + offset_vector_y[1] ** 2) ** 0.5
        resolution = (abs(res_x) + abs(res_y)) / 2
        return resolution
    else:
        print(response.content)
        raise Exception(f"Falha ao obter a resolução da camada {layer}. Código HTTP: {response.status_code}")

def get_pixel_class(lat, lon, product, x, y, resolution, wcs_url):
    half_pixel = resolution / 2
    minx = x - half_pixel
    maxx = x + half_pixel
    miny = y - half_pixel
    maxy = y + half_pixel

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

    response = requests.get(wcs_url, params=params)

    if response.status_code == 200:
        with rasterio.open(BytesIO(response.content)) as dataset:
            #print metadata
            print(dataset.profile)

            for idx in range(1, dataset.count + 1):
                band = dataset.read(idx)
                value = band[0, 0]
                
                # Convertendo para tipos nativos de Python
                value = int(value) if isinstance(value, np.integer) else float(value)

                if idx == 1 and value == 255:
                    return 'Vegetation'
                elif idx == 2 and value == 255:
                    return 'Building'
                elif idx == 3 and value == 255:
                    return 'Background'

        return 'no_data'
    else:
        raise Exception(f"Falha ao obter o valor do pixel. Código HTTP: {response.status_code}")
