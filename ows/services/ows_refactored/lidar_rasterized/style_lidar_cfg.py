style_lidar_simple_lidar = {
    "name": "simple_lidar",
    "title": "Simple lidar",
    "abstract": "Simple false-colour image, using the only elevation bands",
    "components": {
        "red": {
            "elevation": 1.0,
        },
        "green": {
            "elevation": 1.0,
        },
        "blue": {
            "elevation": 1.0
        },
    },
    "scale_range": [700, 1160.45],
}

style_lidar_heatmap = {
    "name": "elevation_heatmap",
    "title": "Elevation Heatmap",
    "abstract": "Heatmap of elevation data using matplotlib colormap",
    "index_function": {
        "function": "datacube_ows.band_utils.single_band",
        "mapped_bands": True,
        "kwargs": {
            "band": "elevation",
        },
    },
    "needed_bands": ["elevation"],
    "mpl_ramp": "viridis",
    "range": [690, 1000],
    "legend": {
        "show_legend": True,
        "units": "meters",
        "decimal_places": 0,
    }
}

styles_lidar_list = [
    style_lidar_simple_lidar,
    style_lidar_heatmap
]