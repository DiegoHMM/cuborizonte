import os
import sys
import uuid
import numpy as np
import rasterio
from datetime import datetime
import yaml
import random
import argparse

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

def build_dataset(tif_path, product_name, bands_path, start_date, end_date, band_names=None):
    crs = str(get_crs(tif_path))
    grid = get_grids(tif_path)
    bounding_box = calculate_bounding_box(tif_path)

    file_name = os.path.splitext(os.path.basename(tif_path))[0]
    band_dir = os.path.join(bands_path, file_name)

    # Build a mapping of file base names to file paths
    band_files = {os.path.splitext(f)[0]: f for f in os.listdir(band_dir) if f.endswith('.tif')}
    band_count = len(band_files)

    measurements = {}
    if band_count == 1:
        # If there's only one file, assume it's a 'gray' band
        gray_band_file = next(iter(band_files.values()))
        measurements = {
            'gray': {'path': os.path.join(band_dir, gray_band_file)},
        }
    else:
        if band_names:
            print(f"Usando nomes de bandas personalizados: {band_names}")
            if len(band_names) != band_count:
                raise ValueError(f"Número de nomes de bandas ({len(band_names)}) não corresponde ao número de arquivos de bandas ({band_count})")
            # Map band names to files based on filenames
            for band_name in band_names:
                if band_name in band_files:
                    measurements[band_name] = {'path': os.path.join(band_dir, band_files[band_name])}
                else:
                    raise ValueError(f"Band name '{band_name}' does not correspond to any file in {band_dir}")
        elif band_count == 3:
            # Default to RGB bands if no band names are provided
            expected_bands = ['red', 'green', 'blue']
            for band_name in expected_bands:
                if band_name in band_files:
                    measurements[band_name] = {'path': os.path.join(band_dir, band_files[band_name])}
                else:
                    raise ValueError(f"Expected band '{band_name}' not found in {band_dir}")
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

    # Using argparse for better command-line parsing
    parser = argparse.ArgumentParser(description='Build dataset for ortophoto.')
    parser.add_argument('bands_path', help='Path to the bands directory.')
    parser.add_argument('photo_folder', help='Path to the photo folder.')
    parser.add_argument('product_name', help='Name of the product.')
    parser.add_argument('year', type=int, help='Year of the dataset.')
    parser.add_argument('--band-names', nargs='+', help='List of band names.', default=None)
    args = parser.parse_args()

    bands_path = args.bands_path
    photo_folder = args.photo_folder
    product_name = args.product_name
    year = args.year
    band_names = args.band_names

    all_files = os.listdir(photo_folder)

    for tif_file in all_files:
        tif_path = os.path.join(photo_folder, tif_file)
        
        start_date = format_date(year, 1, 1)
        end_date = format_date(year, 12, 31)

        dataset, file_name = build_dataset(tif_path, product_name, bands_path, start_date, end_date, band_names)

        save_yaml(dataset, os.path.join(bands_path, file_name, file_name + '.yaml'))
