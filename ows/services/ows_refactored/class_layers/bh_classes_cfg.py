from ows_refactored.class_layers.bands_classes import classes_bands
from ows_refactored.class_layers.style_classes import styles_classes_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Semantic segmentation mask of the city of Belo Horizonte, Brazil.",
    "name": "bh_class_layer",
    "abstract": """
Mascara de segmentação semantica de Belo Horizonte, Minas Gerais, Brasil. As imagens foram classificadas entre vegetação, edificações e background.

Licença: CC-BY-4.0
""",
    "product_name": "bh_class_layer",
    "bands": classes_bands,
    "resource_limits": reslim_bh_images,
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["vegetation", "building", "background"],
        "manual_merge": True,
        "apply_solar_corrections": False,
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.2, -0.2],
    "styling": {
        "default_style": "simple_class",
        "styles": styles_classes_list,
    }
}
