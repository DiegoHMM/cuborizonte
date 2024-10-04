from ows_refactored.class_layers.bands_classes import classes_bands
from ows_refactored.class_layers.style_classes import styles_classes_list
from ows_refactored.common.ows_reslim_cfg import reslim_bh_images


layer = {
    "title": "Semantic segmentation mask of the city of Belo Horizonte, Brazil, 2015.",
    "name": "bh_class_layer_2015",
    "abstract": """
Mascara de segmentação semantica de Belo Horizonte, Minas Gerais, Brasil, classificada com as imagens capturadas em 2015. As imagens foram classificadas entre vegetação, edificações e background.

Licença: CC-BY-4.0
""",
    "product_name": "bh_class_layer_2015",
    "low_res_product_name": "bh_class_layer_2015_lowres",
    "bands": classes_bands,
    "resource_limits": reslim_bh_images,  # Defina um limite de recursos apropriado
    "image_processing": {
        "extent_mask_func": "datacube_ows.ogc_utils.mask_by_val",
        "always_fetch_bands": ["vegetation", "building", "background"],  # Supondo que estas sejam as bandas do seu produto
        "manual_merge": True,  # Defina conforme necessário
        "apply_solar_corrections": False,  # Defina conforme necessário
    },
    "native_crs": "EPSG:31983",
    "native_resolution": [0.2, -0.2],
    "styling": {
        "default_style": "simple_class",  # Defina um estilo padrão apropriado
        "styles": styles_classes_list,
    }
}
