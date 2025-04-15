style_lidar_simple_rgb = {
    "name": "simple_rgb",
    "title": "Simple RGB",
    "abstract": "Simple true-colour image, using the elevation, intensity and classification bands",
    "components": {"elevation": {"elevation": 1.0}, "intensity": {"intensity": 1.0}, "classification": {"classification": 1.0}},
    "scale_range": "auto",
}


style_lidar_enhanced_contrast = {
    "name": "enhanced_contrast",
    "title": "Enhanced Contrast",
    "abstract": "Enhanced contrast using the elevation, intensity, and classification bands",
    "components": {"elevation": {"elevation": 1.0}, "intensity": {"intensity": 1.0}, "classification": {"classification": 1.0}},
    "scale_range": "auto",
}


style_lidar_inverted = {
    "name": "inverted",
    "title": "Color Inversion",
    "abstract": "Inverted colors of the elevation, intensity, and classification bands",
    "components": {
        "elevation": {"elevation": -1.0},
        "intensity": {"intensity": -1.0},
        "classification": {"classification": -1.0},
    },
    "scale_range": "auto",
}


style_lidar_elevation_emphasis = {
    "name": "elevation_emphasis",
    "title": "elevation Emphasis",
    "abstract": "Emphasizes the elevation band",
    "components": {"elevation": {"elevation": 1.2}, "intensity": {"intensity": 0.8}, "classification": {"classification": 0.8}},
    "scale_range": "auto",
}


style_lidar_intensity_emphasis = {
    "name": "intensity_emphasis",
    "title": "intensity Emphasis",
    "abstract": "Emphasizes the intensity band",
    "components": {"elevation": {"elevation": 0.8}, "intensity": {"intensity": 1.2}, "classification": {"classification": 0.8}},
    "scale_range": "auto",
}

style_lidar_classification_emphasis = {
    "name": "classification_emphasis",
    "title": "classification Emphasis",
    "abstract": "Emphasizes the classification band",
    "components": {"elevation": {"elevation": 0.8}, "intensity": {"intensity": 0.8}, "classification": {"classification": 1.2}},
    "scale_range": "auto",
}


style_lidar_pure_elevation = {
    "name": "elevation",
    "title": "elevation",
    "abstract": "elevation band",
    "components": {"elevation": {"elevation": 1.0}, "intensity": {"intensity": 0.0}, "classification": {"classification": 0.0}},
    "scale_range": "auto",
}

style_lidar_pure_intensity = {
    "name": "intensity",
    "title": "intensity",
    "abstract": "intensity band",
    "components": {"elevation": {"elevation": 0.0}, "intensity": {"intensity": 1.0}, "classification": {"classification": 0.0}},
    "scale_range": "auto",
}

style_lidar_pure_classification = {
    "name": "classification",
    "title": "classification",
    "abstract": "classification band",
    "components": {"elevation": {"elevation": 0.0}, "intensity": {"intensity": 0.0}, "classification": {"classification": 1.0}},
    "scale_range": "auto",
}


styles_lidar_list = [
    style_lidar_simple_rgb,
    style_lidar_enhanced_contrast,
    style_lidar_inverted,
    style_lidar_elevation_emphasis,
    style_lidar_intensity_emphasis,
    style_lidar_classification_emphasis,
    style_lidar_pure_elevation,
    style_lidar_pure_intensity,
    style_lidar_pure_classification,
]