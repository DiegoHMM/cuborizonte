style_lidar_simple_lidar = {
    "name": "simple_lidar",
    "title": "Simple lidar",
    "abstract": "Simple false-colour image, using the only classification bands",
    "components": {
        "red": {
            "elevation": 0.0,
        },
        "green": {
            "intensity": 0.0,
        },
        "blue": {
            "classification": 1.0
        },
    },
    "scale_range": [0, 15],
}

styles_lidar_list = [
    style_lidar_simple_lidar
]