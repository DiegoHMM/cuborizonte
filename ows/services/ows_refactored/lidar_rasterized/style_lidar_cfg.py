style_lidar_simple_lidar = {
    "name": "simple_lidar",
    "title": "Simple lidar",
    "abstract": "Simple true-colour image, using the elevation, intensity and classification bands",
    "components": {
        "red": {
            "elevation": 1.0,
             "scale_range": [0.0, 255.0],
        },
        "green": {
            "intensity": 1.0,
             "scale_range": [0.0, 255.0],
        },
        "blue": {
            "classification": 1.0,
             "scale_range": [0.0, 255.0],
        },
    },
}

styles_lidar_list = [
    style_lidar_simple_lidar
]