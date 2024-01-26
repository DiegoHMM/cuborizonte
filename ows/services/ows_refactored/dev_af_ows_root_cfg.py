ows_cfg = {
    "global": {
        
        # Master config for all services and products.
        "message_file": "/env/config/ows_refactored/messages.po",
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
            "EPSG:31983": {  # SIRGAS 2000 / UTM zone 23S
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
            "pt_BR", 
            "en",
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
            "title": "Cuborizonte - OGC Web Services",
            "abstract": "Cuborizonte OGC Web Services",
            "layers": [
                {
                    "title": "Imagens Aéreas de Belo Horizonte - MG - 1999",
                    "abstract": "Coleção de fotos aéreas de alta resolução de Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.ortophoto.bh_ortophoto_1999_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
                {
                    "title": "Imagens Aéreas de Belo Horizonte - MG - 2007-2015",
                    "abstract": "Coleção de fotos aéreas de alta resolução de Belo Horizonte, Minas Gerais",
                    "layers": [
                                {
                                    "include": "ows_refactored.ortophoto.bh_ortophoto_2007_2015_cfg.layer",
                                    "type": "python",
                                },
                    ],
                },
            ],
        },
    ],
}
