from ows_refactored.ortophoto.bands_ortophoto import ortophoto_gray_bands
from ows_refactored.ortophoto.style_ortophoto_grayscale_cfg import styles_ortophoto_grayscale_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Orthophoto of the city of Belo Horizonte, Brazil, 1994.",
    "name": "bh_ortophoto_1994",
    "abstract": """
Imagem aérea de Belo Horizonte, Minas Gerais, Brasil, capturada em 1994. Esta imagem oferece uma visão detalhada da cidade em 1994 com uma alta resolução espacial.

Licença: CC-BY-4.0
""",
    "product_name": "bh_ortophoto_1994",
    "low_res_product_name": "bh_ortophoto_1994_lowres",
    "bands": ortophoto_gray_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["gray"],
        "manual_merge": True,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.00001, -0.00001],
    "styling": {
        "default_style": "simple_grayscale",
        "styles": styles_ortophoto_grayscale_list,
    }
}
