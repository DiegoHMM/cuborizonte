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
        "zoomed_out_fill_colour": [255, 255, 255, 0],  # Cor de preenchimento quando afastado
        "min_zoom_factor": 2,  # Limita o nível de zoom para manter o usuário mais próximo
        "max_datasets": 100,  #Pode ser definido se necessário limitar o número de datasets
        "dataset_cache_rules": dataset_cache_rules,  # Regras de cache conforme necessário
    },
}