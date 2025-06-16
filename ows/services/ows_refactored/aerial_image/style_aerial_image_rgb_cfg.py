style_aerial_image_simple_rgb = {
    "name": "simple_rgb",
    "title": "Simple RGB",
    "abstract": "Simple true-colour image, using the red, green and blue bands",
    "components": {"red": {"red": 1.0}, "green": {"green": 1.0}, "blue": {"blue": 1.0}},
    "scale_range": [0.0, 255.0],
}


style_aerial_image_enhanced_contrast = {
    "name": "enhanced_contrast",
    "title": "Enhanced Contrast",
    "abstract": "Enhanced contrast using the red, green, and blue bands",
    "components": {"red": {"red": 1.0}, "green": {"green": 1.0}, "blue": {"blue": 1.0}},
    "scale_range": [30.0, 220.0],
}


style_aerial_image_inverted = {
    "name": "inverted",
    "title": "Color Inversion",
    "abstract": "Inverted colors of the red, green, and blue bands",
    "components": {
        "red": {"red": -1.0},
        "green": {"green": -1.0},
        "blue": {"blue": -1.0},
    },
    "scale_range": [0.0, 255.0],
}


style_aerial_image_red_emphasis = {
    "name": "red_emphasis",
    "title": "Red Emphasis",
    "abstract": "Emphasizes the red band",
    "components": {"red": {"red": 1.2}, "green": {"green": 0.8}, "blue": {"blue": 0.8}},
    "scale_range": [0.0, 255.0],
}


style_aerial_image_green_emphasis = {
    "name": "green_emphasis",
    "title": "Green Emphasis",
    "abstract": "Emphasizes the green band",
    "components": {"red": {"red": 0.8}, "green": {"green": 1.2}, "blue": {"blue": 0.8}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_blue_emphasis = {
    "name": "blue_emphasis",
    "title": "Blue Emphasis",
    "abstract": "Emphasizes the blue band",
    "components": {"red": {"red": 0.8}, "green": {"green": 0.8}, "blue": {"blue": 1.2}},
    "scale_range": [0.0, 255.0],
}


style_aerial_image_pure_red = {
    "name": "red",
    "title": "Red",
    "abstract": "Red band",
    "components": {"red": {"red": 1.0}, "green": {"green": 0.0}, "blue": {"blue": 0.0}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_pure_green = {
    "name": "green",
    "title": "Green",
    "abstract": "Green band",
    "components": {"red": {"red": 0.0}, "green": {"green": 1.0}, "blue": {"blue": 0.0}},
    "scale_range": [0.0, 255.0],
}

style_aerial_image_pure_blue = {
    "name": "blue",
    "title": "Blue",
    "abstract": "Blue band",
    "components": {"red": {"red": 0.0}, "green": {"green": 0.0}, "blue": {"blue": 1.0}},
    "scale_range": [0.0, 255.0],
}


styles_aerial_image_list = [
    style_aerial_image_simple_rgb,
    style_aerial_image_enhanced_contrast,
    style_aerial_image_inverted,
    style_aerial_image_red_emphasis,
    style_aerial_image_green_emphasis,
    style_aerial_image_blue_emphasis,
    style_aerial_image_pure_red,
    style_aerial_image_pure_green,
    style_aerial_image_pure_blue,
]