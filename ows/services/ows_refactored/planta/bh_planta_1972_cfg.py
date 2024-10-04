from ows_refactored.planta.bands_plan import plan_grayscale_bands
from ows_refactored.planta.style_plan_grayscale_cfg import styles_plan_grayscale_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Plan of the city of Belo Horizonte, Brazil, 1972.",
    "name": "bh_planta_1972",
    "abstract": """
Planta da cidade de Belo Horizonte, Minas Gerais, Brasil, feita de 1972. Esta imagem oferece uma visão detalhada da planta da cidade de 1972 com uma alta resolução.

Licença: CC-BY-4.0
""",
    "product_name": "bh_planta_1972",
    "low_res_product_name": "bh_planta_1972_lowres",
    "bands": plan_grayscale_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["gray"],
        "manual_merge": True,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.16990, -0.16990],
    "styling": {
        "default_style": "simple_grayscale",
        "styles": styles_plan_grayscale_list,
    }
}
