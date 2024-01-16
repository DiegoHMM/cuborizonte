ows_cfg = {
    "global": {
        # Master config for all services and products.
        "response_headers": {
            "Access-Control-Allow-Origin": "*",  # CORS header
        },
        "services": {
            "wms": True,
            "wcs": False,
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
        },
        "allowed_urls": [
            "http://localhost:8000/",
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
            "pt-br",
        ],
    },  # END OF global SECTION
    "wms": {
        # Config for WMS service, for all products/layers
        "s3_aws_zone": "sa-east-1",
        "max_width": 10000,
        "max_height": 10000,
    },  # END OF wms SECTION
    "layers": [
        {
            "title": "Digital Earth Africa - OGC Web Services",
            "abstract": "Digital Earth Africa OGC Web Services",
            "layers": [
                {
                    "title": "Satellite images",
                    "abstract": "Satellite images",
                    "layers": [
                        {
                            "title": "Surface reflectance",
                            "abstract": "Surface reflectance",
                            "layers": [
                                {
                                    "title": "Daily      reflectance",
                                    "abstract": "Daily surface reflectance",
                                    "layers": [
                                        {
                                            "include": "ows_refactored.surface_reflectance.ows_s2_cfg.layer",
                                            "type": "python",
                                        },
                                        {
                                            "include": "ows_refactored.surface_reflectance.ows_lsc2_sr_cfg.layer_ls9",
                                            "type": "python",
                                        },
                                        {
                                            "include": "ows_refactored.surface_reflectance.ows_lsc2_sr_cfg.layer_ls8",
                                            "type": "python",
                                        },
                                        {
                                            "include": "ows_refactored.surface_reflectance.ows_lsc2_sr_cfg.layer_ls7",
                                            "type": "python",
                                        },
                                        {
                                            "include": "ows_refactored.surface_reflectance.ows_lsc2_sr_cfg.layer_ls5",
                                            "type": "python",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            "title": "Cuborizonte - OGC Web Services",
            "abstract": "Cuborizonte OGC Web Services",
            "layers": [
                {
                    "title": "Imagens Aéreas de Belo Horizonte - MG",
                    "abstract": "Coleção de fotos aéreas de alta resolução de Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.aerial.bh_aerial_1999_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
            ],
        },
    ],
}
