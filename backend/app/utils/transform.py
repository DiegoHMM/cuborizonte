from pyproj import Transformer

def transform_coordinates(lat, lon):
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:31983", always_xy=True)
    x, y = transformer.transform(lon, lat)
    return x, y
