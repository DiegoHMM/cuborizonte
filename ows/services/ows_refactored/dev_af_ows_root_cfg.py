ows_cfg = {
    "global": {
        # Master config for all services and products.
        "message_file": "/env/config/ows_refactored/messages.po",
        "response_headers": {
            "Access-Control-Allow-Origin": "*",  # CORS header
        },
        "services": {
            "wms": True,
            "wcs": True,
            "wmts": True,
        },
        "published_CRSs": {
            "EPSG:3857": {  # Web Mercator
                "geographic": False,
                "horizontal_coord": "x",
                "vertical_coord": "y",
            },
            "EPSG:4326": {"geographic": True, "vertical_coord_first": True},  # WGS-84
            "EPSG:6933": {  # Cylindrical equal area
                "geographic": False,
                "horizontal_coord": "x",
                "vertical_coord": "y",
            },
            "EPSG:29193": {  # SAD69 / Brazil Polyconic (deprecated) 
                "geographic": False,
                "horizontal_coord": "x",
                "vertical_coord": "y",
            },
            "EPSG:31983": {  # SIRGAS 2000 / UTM zone 23S
                "geographic": False,
                "horizontal_coord": "x",
                "vertical_coord": "y",
            },  
        },
        "allowed_urls": [
            "http://localhost:8000/",
            "http://localhost:8001/",
            "http://localhost:8004/",
            
        ],
        # Metadata to go straight into GetCapabilities documents
        "title": "Cuborizonte - OGC Web Services",
        "abstract": """Cuborizonte OGC Web Services""",
        "info_url": "/",
        "keywords": [
            "remote sensing",
            "time-series",
            "datacube",
        ],
        "contact_info": {
            "person": "Cuborizonte",
            "organisation": "Cuborizonte - UFMG",
            "position": "",
            "address": {
                "type": "",
                "address": "",
                "city": "Belo Horizonte",
                "state": "MG",
                "postcode": "",
                "country": "Brazil",
            },
            "telephone": "",
            "fax": "",
            "email": "",
        },
        "fees": "",
        "access_constraints": ""
        "This product is released under the Creative Commons Attribution 4.0 International Licence. "
        "http://creativecommons.org/licenses/by/4.0/legalcode",
        "translations_directory": "/env/config/ows_refactored/translations",
        "supported_languages": [
            "pt_BR", 
            "en",
        ],
    },  # END OF global SECTION
    "wms": {
        # Config for WMS service, for all products/layers
        "s3_aws_zone": "sa-east-1",
        "max_width": 512,
        "max_height": 512,
        "formats": {
            "image/png": {
                "renderer": "datacube_ows.wms_utils.png_renderer",
                "mime": "image/png",
                "extension": "png"
            },
            "image/geotiff": {
                "renderer": "datacube_ows.wms_utils.tiff_renderer",
                "mime": "image/geotiff",
                "extension": "tif"
            },
        },
    },  # END OF wms SECTION
    "wcs": {
        # Config for WCS service, for all products/coverages
        "default_geographic_CRS": "EPSG:4326",
        "formats": {
            "GeoTIFF": {
                # "renderer": "datacube_ows.wcs_utils.get_tiff",
                "renderers": {
                    "1": "datacube_ows.wcs1_utils.get_tiff",
                    "2": "datacube_ows.wcs2_utils.get_tiff",
                },
                "mime": "image/geotiff",
                "extension": "tif",
                "multi-time": False,
            },
        },
        "native_format": "GeoTIFF",
    },  # END OF wcs SECTION
    "layers": [
        {
            "title": "Cuborizonte - OGC Web Services",
            "abstract": "Cuborizonte OGC Web Services",
            "layers": [
                 {
                    "title": "Planta da cidade de Belo Horizonte.",
                    "abstract": "Coleção das plantas de alta resolução da cidade Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.planta.bh_planta_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
                {
                    "title": "Imagens Aéreas de Belo Horizonte - MG.",
                    "abstract": "Coleção de fotos aéreas de alta resolução de Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.aerial_image.bh_aerial_image_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
                {
                    "title": "Máscaras de segmentação semantica de Belo Horizonte - MG.",
                    "abstract": "Coleção de máscaras com as classes de vegetação, edificações e background de Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.class_layers.bh_classes_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
                {
                    "title": "Rasters obtained from lidar file of the city of Belo Horizonte, Brazil",
                    "abstract": "Rasters obtidos através de processamento de arquivos lidar da cidade de Belo Horizonte, Minas Gerais, Brasil. Estas imagens oferecem uma visão detalhada da cidade com uma alta resolução espacial.",
                    "layers": [
                                {
                                    "include": "ows_refactored.lidar_rasterized.bh_lidar_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
            ],
        },
    ],
}
