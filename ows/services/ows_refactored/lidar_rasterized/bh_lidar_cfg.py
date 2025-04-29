from ows_refactored.lidar_rasterized.bands_lidar import lidar_bands
from ows_refactored.lidar_rasterized.style_lidar_cfg import styles_lidar_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Rasters obtained from lidar file of the city of Belo Horizonte, Brazil.",
    "name": "bh_lidar_rasterized",
    "abstract": """
Rasters obtidos através de processamento de arquivos lidar da cidade de Belo Horizonte, Minas Gerais, Brasil. Estas imagens oferecem uma visão detalhada da cidade com uma alta resolução espacial.

Licença: CC-BY-4.0
""",
    "product_name": "bh_lidar_rasterized",
    "bands": lidar_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["elevation", "intensity", "classification"],
        "manual_merge": False,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.8, -0.8],
    "styling": {
        "default_style": "simple_lidar",
        "styles": styles_lidar_list,
    }
}
