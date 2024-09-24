import argparse
import os
from tqdm import tqdm
import rasterio

def get_image_list(image_dir):
    image_list = []
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            if file.endswith('.tif'):
                filename, _ = os.path.splitext(file)
                image_list.append(os.path.join(root, file))
    return image_list

def divide_rgb_bands(image_list, output_dir):
    # Mapeamento do número da banda para o nome da banda para imagens RGB
    band_names_rgb = {1: 'red', 2: 'green', 3: 'blue'}
    # Nome padrão para imagens com uma única banda
    single_band_name = 'grayscale'

    for image_path in tqdm(image_list, desc='Processing images', unit='image'):
        # Extrai o nome do arquivo sem a extensão
        image_name = os.path.splitext(os.path.basename(image_path))[0]

        # Cria o diretório de saída para a imagem atual
        output_image_dir = os.path.join(output_dir, image_name)
        os.makedirs(output_image_dir, exist_ok=True)

        # Abre o arquivo TIFF de múltiplas bandas
        with rasterio.open(image_path) as src:
            # Caso a imagem tenha apenas uma banda, trata como cinza
            if src.count == 1:
                band = src.read(1)
                output_tif_path = os.path.join(output_image_dir, f'{single_band_name}.tif')
                with rasterio.open(output_tif_path, 'w', driver='GTiff',
                                   width=src.width, height=src.height,
                                   count=1, dtype=band.dtype, crs=src.crs,
                                   transform=src.transform) as dst:
                    dst.write(band, 1)
            elif src.count in band_names_rgb:
                # Loop pelas bandas para imagens RGB
                for band_number in range(1, src.count + 1):
                    # Lê os dados da banda
                    band = src.read(band_number)

                    # Nome da banda com base no mapeamento
                    band_name = band_names_rgb[band_number]

                    # Cria um novo arquivo TIFF para a banda
                    output_tif_path = os.path.join(output_image_dir, f'{band_name}.tif')
                    with rasterio.open(output_tif_path, 'w', driver='GTiff',
                                       width=src.width, height=src.height,
                                       count=1, dtype=band.dtype, crs=src.crs,
                                       transform=src.transform) as dst:
                        dst.write(band, 1)
            else:
                print(f"Aviso: A imagem '{image_name}' tem um número inesperado de bandas ({src.count}). Pulando...")
def main():
    parser = argparse.ArgumentParser(description="Divide imagens RGB em bandas individuais.")
    parser.add_argument("input_dir", help="Caminho para o diretório de entrada contendo imagens TIFF.")
    parser.add_argument("output_dir", help="Caminho para o diretório de saída para as bandas processadas.")
    args = parser.parse_args()

    image_list = get_image_list(args.input_dir)
    divide_rgb_bands(image_list, args.output_dir)

if __name__ == '__main__':
    main()
