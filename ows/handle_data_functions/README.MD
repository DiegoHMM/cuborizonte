# Orthophoto Ingestion Pipeline for Open Data Cube

This repository contains a set of Python scripts designed to process orthophotos, generate metadata compliant with the Open Data Cube (ODC) standard, and index them into a database. It also includes a utility script for inserting vector data (areas of interest) into a PostGIS database.

The main workflow is designed to be executed in the following order:
1.  **`divide_bands.py`**: Splits multispectral orthophotos (GeoTIFFs) into individual GeoTIFF files for each band.
2.  **`build_dataset_ortofoto.py`**: Generates metadata (`.yaml`) files for each orthophoto, following the ODC schema.
3.  **`indexer.py`**: Adds the datasets, described by the `.yaml` files, to the Open Data Cube index.

A helper script, **`insert_areas.py`**, is provided to load vector data (e.g., municipal boundaries, deforestation areas) into a PostGIS table, which can be used for future analysis in conjunction with ODC data.

## ⚙️ General Prerequisites

Before running the scripts, ensure you have the following installed and configured:

1.  **Python 3.8+**
2.  **Python Libraries**:
    ```bash
    pip install rasterio pyproj pyyaml numpy tqdm psycopg2-binary shapely
    ```
3.  **Open Data Cube**: The command-line interface (`datacube`) must be installed and configured to connect to your ODC database.
    ```bash
    pip install datacube
    datacube system init
    ```
4.  **PostGIS Database**: A PostgreSQL database with the PostGIS extension enabled is required for both the ODC and the `insert_areas.py` script.

---

## 📜 `divide_bands.py`

This script is the first step in the pipeline. It reads GeoTIFF files from an input directory, which may contain multiple bands (e.g., Red, Green, Blue), and splits them into single-band GeoTIFF files.

### 🎯 Purpose
To prepare images for ODC, which typically works with bands as separate files. This provides the flexibility to load only the necessary bands for an analysis.

### 🛠️ How it Works
1.  The script scans the input directory for all `.tif` files.
2.  For each image found, it creates a corresponding subdirectory in the output directory (e.g., `input/image_A.tif` -> `output/image_A/`).
3.  It uses the `rasterio` library to read the GeoTIFF file.
4.  **3-Band Images**: By default, it assumes the bands are Red, Green, and Blue (RGB) and saves each one as `red.tif`, `green.tif`, and `blue.tif` in the output subdirectory.
5.  **1-Band Images**: If the image has only one band, it is treated as a grayscale image and saved as `grayscale.tif`.
6.  **Custom Band Names**: You can provide a list of custom band names via the `--band-names` argument. This is useful for images with more than 3 bands or with non-visual bands (e.g., Near-Infrared).

### 🚀 Usage

```bash
python3 divide_bands.py <input_directory> <output_directory> [--band-names NAME1 NAME2 ...]
```

**Example (Default RGB):**
```bash
python3 divide_bands.py ./original_orthophotos/ ./split_bands/
```

**Example (With Custom Band Names):**
```bash
python3 divide_bands.py ./sentinel_images/ ./sentinel_bands/ --band-names coastal aerosol blue green red
```

---

## 📜 `build_dataset_ortofoto.py`

This script creates the metadata (`.yaml`) files that describe each orthophoto, making them "discoverable" by the Open Data Cube.

### 🎯 Purpose
To generate a `.yaml` metadata file for each orthophoto, containing essential information such as the coordinate reference system (CRS), geographic extent (bounding box), paths to each band's file, and the acquisition time period.

### 🛠️ How it Works
1.  The script iterates over the original `.tif` files in an input folder (`photo_folder`).
2.  For each file, it extracts geospatial metadata using `rasterio`:
    * **CRS**: Gets the coordinate reference system from the file.
    * **Grids**: Extracts the affine transformation and image dimensions.
    * **Bounding Box**: Calculates the image's geographic extent and converts it to the `EPSG:4326` standard (latitude/longitude). It includes a specific validation to ensure the image is within the boundaries of Minas Gerais, Brazil.
3.  It builds the metadata structure:
    * Generates a unique `UUID` for the dataset.
    * Sets the ODC product name.
    * Creates the `measurements` section, which maps each band name (e.g., `red`) to its corresponding file path in the bands directory (`bands_path`). It expects that the band files have already been separated by `divide_bands.py`.
    * Adds time properties, such as `datetime`, `dtr:start_datetime`, and `dtr:end_datetime`.
4.  Finally, it saves the metadata dictionary as a `.yaml` file in the same subdirectory where the image's split bands are located.

### 🚀 Usage

```bash
python3 build_dataset_ortofoto.py <path_to_bands> <original_photos_folder> <product_name> <year> --base-url <base_url_for_files> [--band-names NAME1 NAME2 ...]
```

* **`<path_to_bands>`**: The output directory from the `divide_bands.py` script.
* **`<original_photos_folder>`**: The input directory for the `divide_bands.py` script.
* **`<product_name>`**: The name of the product to be used in ODC (e.g., `orthophoto_mg_2020`).
* **`<year>`**: The acquisition year of the photos, used to define the time range.
* **`--base-url`**: A URL or file path prefix to be added to the band paths. Use `file:///` for local absolute paths.

**Example:**
```bash
python3 build_dataset_ortofoto.py ./split_bands/ ./original_orthophotos/ orthophoto_mg_2020 2020 --base-url file:///data/
```
*In this example, the script would expect the band files to be in `/data/split_bands/`. The path in the YAML will be, for example, `file:///data/split_bands/image_A/red.tif`.*

---

## 📜 `indexer.py`

After the `.yaml` files are generated, this script adds them to the Open Data Cube database, officially making the datasets part of the data cube and available for query and analysis.

### 🎯 Purpose
To automate the process of running the `datacube dataset add` command for a large number of metadata files.

### 🛠️ How it Works
1.  The script takes a root path as an argument. This path should be the directory containing the subdirectories for each image (the output of `divide_bands.py`).
2.  It locates all `.yaml` files within these subdirectories, assuming the structure `root/<image_name>/<image_name>.yaml`.
3.  For each `.yaml` file found, it executes the command `subprocess.run(['datacube', 'dataset', 'add', yaml_path])`.
4.  A progress bar (`tqdm`) is displayed to monitor the indexing process.

### 🚀 Usage

```bash
python3 indexer.py <root_path_of_datasets>
```

**Example:**
```bash
python3 indexer.py ./split_bands/
```
*This command will search for all `.yaml` files within the subdirectories of `./split_bands/` and add them to the ODC.*

---

## 📜 `insert_areas.py`

This is a utility script for loading geographic vector data from a JSON file (in GeoJSON format) into a table in a PostGIS database.

### 🎯 Purpose
To populate a database table with geometries and properties (e.g., municipal polygons, points of interest, mining areas), which can be used to filter or analyze the raster data from the Open Data Cube.

### 🛠️ How it Works
1.  The script connects to the PostGIS database using **hardcoded credentials** (warning: modify the `db_config` dictionary if necessary).
2.  It ensures the target table exists, creating it with columns for `id`, `geometry`, `properties` (JSONB), and `bbox` (array of floats) if it doesn't already exist.
3.  It reads the input JSON file, which should have a structure similar to a GeoJSON FeatureCollection.
4.  For each "feature" in the JSON:
    * It uses the `shapely` library to calculate the geometry's bounding box.
    * It prepares the data for insertion: the geometry as a GeoJSON string, the properties as a JSON string, and the bounding box as a list.
5.  It uses the `psycopg2.extras.execute_values` function to perform an efficient bulk insert into the database. The geometry is converted to the PostGIS `GEOMETRY` type with SRID 4326 using the `ST_GeomFromGeoJSON` function.

### 🚀 Usage

```bash
python3 insert_areas.py <input_json_file> <target_table_name>
```

**Example:**
```bash
python3 insert_areas.py ./municipal_boundaries.geojson brazil_municipalities
```