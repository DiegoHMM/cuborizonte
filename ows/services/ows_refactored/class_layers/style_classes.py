style_class_simples = {
    "name": "simple_class",
    "title": "Simple classes",
    "abstract": "Simple false-colour image, using the vegetation, building, and background bands",
    "components": {
        "red": {
            "building": 1.0,
            "vegetation": 0.0,
            "background": 0.0
        },
        "green": {
            "building": 0.0,
            "vegetation": 1.0,
            "background": 0.0
        },
        "blue": {
            "building": 0.0,
            "vegetation": 0.0,
            "background": 1.0
        },
    },
    "scale_range": [0.0, 255.0],
}



styles_classes_list = [
    style_class_simples,
]