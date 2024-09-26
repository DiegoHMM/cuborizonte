style_class_simples = {
    "name": "simple_class",
    "title": "Simple classes",
    "abstract": "Simple false-colour image, using the vegetation, building, and background bands",
    "components": {
        "red": {
            "building": 1.0,
        },
        "green": {
            "vegetation": 1.0,
        },
        "blue": {
            "background": 1.0
        },
    },
    "scale_range": [0.0, 255.0],
}

styles_classes_list = [
    style_class_simples,
]