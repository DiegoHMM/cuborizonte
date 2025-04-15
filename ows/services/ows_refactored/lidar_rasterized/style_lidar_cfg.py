style_lidar_simple_lidar = {
    "name": "simple_lidar",
    "title": "Simple lidar",
    "abstract": "Simple true-colour image, using the elevation, intensity and classification bands",
    "components": {"elevation": {"elevation": 1.0}, "intensity": {"intensity": 1.0}, "classification": {"classification": 1.0}},
    "scale_range": "auto",
}

styles_lidar_list = [
    style_lidar_simple_lidar
]