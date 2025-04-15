style_lidar_simple_lidar = {
    "name": "simple_lidar",
    "title": "Simple lidar",
    "abstract": "Simple false-colour image, using the only elevation bands",
    "components": {
        "red": {
            "elevation": 1.0,
        },
        "green": {
            "intensity": 0.0,
        },
        "blue": {
            "classification": 0.0
        },
    },
    "scale_range": [700, 1160.45],
}

styles_lidar_list = [
    style_lidar_simple_lidar
]