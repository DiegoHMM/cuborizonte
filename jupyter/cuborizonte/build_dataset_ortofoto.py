import os
import sys
import uuid
import numpy as np
import rasterio
from datetime import datetime
import yaml
import random

def format_date(year, month, day):
    date_object = datetime(year, month, day, 0, 0, 0)
    date_str = date_object.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    return date_str

def get_crs(tif_path):
    with rasterio.open(tif_path) as src:
        crs = src.crs

    return crs

def get_grids(tif_path):
    with rasterio.open(tif_path) as src:
        transform = src.transform
        shape = src.shape

        transform = np.array(transform).flatten().tolist()
        shape = np.array(shape).flatten().tolist()

    return {
        'default': {
            'shape': shape,
            'transform': transform,
        }
    }

def calculate_bounding_box(tif_path):
    with rasterio.open(tif_path) as src:
        bounds = src.bounds

    return {
        'latitude': {'start': bounds.bottom, 'end': bounds.top},
        'longitude': {'start': bounds.left, 'end': bounds.right},
    }

def save_yaml(dataset, output_file):
    with open(output_file, 'w') as yaml_file:
        yaml.dump(dataset, yaml_file, default_flow_style=False)

def build_dataset(tif_path, product_name, bands_path, start_date, end_date):
    crs = str(get_crs(tif_path))
    grid = get_grids(tif_path)
    bounding_box = calculate_bounding_box(tif_path)

    file_name = os.path.splitext(os.path.basename(tif_path))[0]
    band_dir = os.path.join(bands_path, file_name)

    # Lista os arquivos no diretório da banda
    band_files = [f for f in os.listdir(band_dir) if f.endswith('.tif')]
    band_count = len(band_files)

    measurements = {}
    if band_count == 1:
        # Se existir apenas um arquivo, assume que é uma banda 'gray'
        gray_band_file = band_files[0]  # Pega o nome do arquivo
        measurements = {
            'gray': {'path': os.path.join(band_dir, gray_band_file)},
        }
    elif band_count == 3:
        # Se existirem três arquivos, configura para as bandas RGB
        measurements = {
            'red': {'path': os.path.join(band_dir, 'red.tif')},
            'green': {'path': os.path.join(band_dir, 'green.tif')},
            'blue': {'path': os.path.join(band_dir, 'blue.tif')},
        }
    else:
        raise ValueError(f"Número inesperado de arquivos de banda ({band_count}) para {file_name}")

    return { 
        'id': str(uuid.uuid4()),
        '$schema': 'https://schemas.opendatacube.org/dataset',
        'product': {
            'name': product_name
        },
        'crs': crs,
        'grids': grid,
        'measurements': measurements,
        'properties': {
            'dtr:start_datetime': start_date,
            'dtr:end_datetime': end_date,
            'bounds': bounding_box,
        },
        'file_format': 'GeoTIFF',
        'lineage': {},
    }, file_name

if __name__ == '__main__':
    random.seed(42)
    print(sys.argv)
    if len(sys.argv) != 5:
        print("Usage: python script.py <bands_path> <photo_folder> <product_name> <year>")
        sys.exit(1)

    bands_path = sys.argv[1]
    photo_folder = sys.argv[2]
    product_name = sys.argv[3]
    year = sys.argv[4]

    all_files = os.listdir(photo_folder)

    for tif_file in all_files:
        tif_path = os.path.join(photo_folder, tif_file)
        
        start_date = format_date(int(year), 1, 1)
        end_date = format_date(int(year), 12, 31)

        dataset, file_name = build_dataset(tif_path, product_name, bands_path, start_date, end_date)

        save_yaml(dataset, os.path.join(bands_path, file_name, file_name + '.yaml'))
