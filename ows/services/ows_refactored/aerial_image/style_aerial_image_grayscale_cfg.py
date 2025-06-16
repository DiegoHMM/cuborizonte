style_aerial_image_grayscale_simple = {
    "name": "simple_grayscale",
    "title": "Simple Grayscale",
    "abstract": "Simple grayscale image",
    "components": {"red": {"gray": 1.0},
                   "green": {"gray": 1.0},
                   "blue": {"gray": 1.0}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_grayscale_contrast_enhanced = {
    "name": "enhanced_contrast_grayscale",
    "title": "Enhanced Contrast Grayscale",
    "abstract": "Enhanced contrast for grayscale images",
    "components": {"red": {"gray": 1.0},
                   "green": {"gray": 1.0},
                   "blue": {"gray": 1.0}},
    "scale_range": [30.0, 220.0],
}

style_aerial_image_grayscale_inverted = {
    "name": "inverted_grayscale",
    "title": "Inverted Grayscale",
    "abstract": "Inverted grayscale image",
    "components": {"red": {"gray": -1.0},
                   "green": {"gray": -1.0},
                   "blue": {"gray": -1.0}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_grayscale_highlights = {
    "name": "grayscale_highlights",
    "title": "Grayscale Highlights",
    "abstract": "Emphasizes the lighter parts of the grayscale image",
    "components": {"red": {"gray": 1.2},
                   "green": {"gray": 1.2},
                   "blue": {"gray": 1.2}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_grayscale_shadows = {
    "name": "grayscale_shadows",
    "title": "Grayscale Shadows",
    "abstract": "Emphasizes the darker parts of the grayscale image",
    "components": {"red": {"gray": 0.8},
                   "green": {"gray": 0.8},
                   "blue": {"gray": 0.8}},
    "scale_range": [0.0, 255.0],
}

styles_aerial_image_grayscale_list = [
    style_aerial_image_grayscale_simple,
    style_aerial_image_grayscale_contrast_enhanced,
    style_aerial_image_grayscale_inverted,
    style_aerial_image_grayscale_highlights,
    style_aerial_image_grayscale_shadows,
]