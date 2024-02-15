from ows_refactored.planta.bands_plan import plan_rgb_bands
from ows_refactored.planta.style_plan_rgb_cfg import styles_plan_rgb_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Plan of the city of Belo Horizonte, Brazil, 1942.",
    "name": "bh_plan_1942",
    "abstract": """
Planta da cidade de Belo Horizonte, Minas Gerais, Brasil, feita em 1942. Esta imagem oferece uma visão detalhada da planta em 1942 com uma alta resolução.

Licença: CC-BY-4.0
""",
    "product_name": "bh_plan_1942",
    "low_res_product_name": "bh_plan_1942_lowres",
    "bands": plan_rgb_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["red", "green", "blue"],
        "manual_merge": True,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.16990, -0.16990],
    "styling": {
        "default_style": "simple_rgb",
        "styles": styles_plan_rgb_list,
    }
}
