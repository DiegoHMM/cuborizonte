from ows_refactored.aerial.band_aerial import bands_bh_aerial_1999
from ows_refactored.aerial.style_bh_aerial_1999_cfg import styles_bh_aerial_1999_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Imagem Aérea de Belo Horizonte - 1999",
    "name": "bh_aerial_image_1999",
    "abstract": """
Imagem aérea de Belo Horizonte, Minas Gerais, Brasil, capturada em 1999. Esta imagem oferece uma visão detalhada da cidade em 1999 com uma alta resolução espacial.

Licença: CC-BY-4.0
""",
    "product_name": "bh_aerial_image_1999",
    "bands": bands_bh_aerial_1999,
    "resource_limits": reslim_bh_images,  # Defina um limite de recursos apropriado
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["red", "green", "blue"],  # Supondo que estas sejam as bandas do seu produto
        "manual_merge": True,  # Defina conforme necessário
        "apply_solar_corrections": False,  # Defina conforme necessário
    },
    "native_crs": "EPSG:29193",
    "native_resolution": [0.399711, -0.399711],
    "styling": {
        "default_style": "simple_rgb",  # Defina um estilo padrão apropriado
        "styles": styles_bh_aerial_1999_list,
    }
}
