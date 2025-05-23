from ows_refactored.ortophoto.bands_ortophoto import ortophoto_rgb_bands
from ows_refactored.ortophoto.style_ortophoto_rgb_cfg import styles_ortophoto_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Orthophoto of the city of Belo Horizonte, Brazil.",
    "name": "bh_ortophoto",
    "abstract": """
Imagens aéreas de Belo Horizonte, Minas Gerais, Brasil. Estas imagens oferecem uma visão detalhada da cidade com uma alta resolução espacial.

Licença: CC-BY-4.0
""",
    "product_name": "bh_ortophoto",
    "bands": ortophoto_rgb_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["red", "green", "blue"],
        "manual_merge": False,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [1.0, -1.0],
    "styling": {
        "default_style": "simple_rgb",
        "styles": styles_ortophoto_list,
    }
}
