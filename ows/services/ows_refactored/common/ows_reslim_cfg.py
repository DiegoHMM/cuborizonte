# reslim

# Defines cache control on GetMap requests
dataset_cache_rules = [
    {
        "min_datasets": 1,
        "max_age": 60 * 60 * 24,
    },
    {
        "min_datasets": 5,
        "max_age": 60 * 60 * 24 * 7,
    },
    #{
    #    "min_datasets": 10,
    #    "max_age": 60 * 60 * 24 * 30,
    #},
    #{
    #    "min_datasets": 15,
    #    "max_age": 60 * 60 * 24 * 120,
    #},
]


reslim_bh_images = {
    "wms": {
        "min_zoom_factor": 2,
        "max_datasets": 10,
        "dataset_cache_rules": dataset_cache_rules,
    },
}