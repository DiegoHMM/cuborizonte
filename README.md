# Urban Open Data Cube (UODC)

The Urban Open Data Cube (UODC) is a custom implementation of the [Open Data Cube](https://github.com/opendatacube) framework. This project is designed to integrate geospatial data, such as orthophotos and city plans, and enhance data accessibility through a dedicated Web Portal and API.

## Prerequisites

Before you begin, ensure you have the following requirements met:

- Docker and Docker Compose must be installed and configured on your system.
- The Docker environment requires access to the directory or server where the source imagery to be indexed is located.

## Data Indexing

### Product and Dataset Definitions

To index data into the Urban Open Data Cube, you first need to define the *products* and create the corresponding *dataset* metadata files.

This project provides a set of python scripts to facilitate the preprocessing of raw imagery and semi-automate the indexing process. You can find the documentation for these scripts in the project repository:
- **UODC Data Handling Documentation**: [https://github.com/DiegoHMM/cuborizonte/tree/main/ows/handle_data_functions](https://github.com/DiegoHMM/cuborizonte/tree/main/ows/handle_data_functions/)

Alternatively, for a more detailed and manual approach to creating product and dataset files, you can follow the official Open Data Cube documentation:
- **Official ODC Data Preparation Guide**: [https://opendatacube.readthedocs.io/en/latest/ops/prepare-data.html](https://opendatacube.readthedocs.io/en/latest/ops/prepare-data.html)

## Accessing Data with Python

Once the UODC is configured, data can be loaded for analysis using tools like Geographic Information Systems (GIS) or programmatically with Python.

An example Jupyter Notebook is available, demonstrating a complete data science pipeline. It shows how to connect to the datacube, load data, and use it in a land classification project.
- **Example Data Science Project**: [Land Classification Notebook](https://github.com/DiegoHMM/land_classification)
