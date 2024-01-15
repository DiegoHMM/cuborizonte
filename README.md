# Cuborizonte in a Box

The Cube in a Box is a simple way to run the [Open Data Cube](https://www.opendatacube.org).

## Setup - Docker:

  * If the above fails you can follow the following steps:
    1. `docker-compose up`
    2. When the a message like: `No web browser found: could not locate runnable browser` shows. Open a new shell and run the next commands
    3. `docker-compose exec ows datacube -v system init` It starts DBs
    4.    `docker-compose exec jupyter python /cuborizonte/divide_bands.py /data/bh_aerial_2002 /data/bh_aerial_2002_processed`
          `docker-compose exec jupyter python /cuborizonte/build_dataset_2002.py /data/bh_aerial_2002_processed /data/bh_aerial_2002 bh_aerial_image_1999`
    5. `docker-compose exec jupyter datacube product add https://raw.githubusercontent.com/DiegoHMM/cuborizonte_products/main/product_bh_aerial_image_1999.yaml` It create product
    6. `docker-compose exec jupyter python /cuborizonte/indexer.py /data/bh_aerial_2002_processed` It add datasets

5. You should now be able to go to <http://localhost>
6. Enter the password `secretpassword`

docker-compose exec ows datacube-ows-update --schema --role postgres
docker-compose exec ows datacube-ows-update --views
docker-compose exec ows datacube-ows-update bh_aerial_image_1999