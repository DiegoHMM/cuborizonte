from ows_refactored.ortophoto.bands_rgb_dsm_ortophoto import ortophoto_bands
from ows_refactored.ortophoto.style_ortophoto_rgb_dsm_cfg import styles_ortophoto_dsm_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Orthophoto of the city of Belo Horizonte, Brazil, 2007.",
    "name": "bh_ortophoto_2007",
    "abstract": """
Imagem aérea de Belo Horizonte, Minas Gerais, Brasil, capturada em 2007. Esta imagem oferece uma visão detalhada da cidade de 2007 com uma alta resolução espacial.

Licença: CC-BY-4.0
""",
    "product_name": "bh_ortophoto_2007",
    "low_res_product_name": "bh_ortophoto_2007_lowres",
    "bands": ortophoto_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["red", "green", "blue"],
        "manual_merge": True,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.2, -0.2],
    "styling": {
        "default_style": "simple_rgb",
        "styles": styles_ortophoto_dsm_list,
    }
}
