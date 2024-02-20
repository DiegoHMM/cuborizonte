# Cuborizonte in a Box

The Cube in a Box is a simple way to run the [Open Data Cube](https://www.opendatacube.org).

## Setup - Docker:

  * If the above fails you can follow the following steps:
    1. `docker-compose up`
    2. When the a message like: `No web browser found: could not locate runnable browser` shows. Open a new shell and run the next commands
    3. `docker-compose exec ows datacube -v system init` It starts DBs
    4.    `docker-compose exec jupyter python /cuborizonte/divide_bands.py /data/raw/ORTOFOTO_2007 /data/processed/ORTOFOTO_2007`
          `docker-compose exec jupyter python /cuborizonte/build_dataset_ortofoto.py /data/processed/ORTOFOTO_2007 /data/raw/ORTOFOTO_2007 bh_ortophoto_2007_2015 2007`
    5. `docker-compose exec jupyter datacube product add https://raw.githubusercontent.com/DiegoHMM/cuborizonte_products/main/bh_ortophoto_2007_2015.yaml` It create product
    6. `docker-compose exec jupyter python /cuborizonte/indexer.py /data/processed/ORTOFOTO_2007` It add datasets

    7. You should now be able to go to <http://localhost>
    8. Enter the password `secretpassword`

    9. docker-compose exec ows datacube-ows-update --schema --role postgres
    10. docker-compose exec ows datacube-ows-update --views

    * Is possible to update one specific layer at time:
    11. docker-compose exec ows datacube-ows-update bh_ortophoto_2007_2015

    Then reestart the bd

    * To create metata:
    12. docker-compose exec ows datacube-ows-cfg extract -m /env/config/ows_refactored/messages.po
    13. docker-compose exec ows datacube-ows-cfg translation -n -D cuborizonte -d /env/config/ows_refactored/translations -m /env/config/ows_refactored/messages.po en pt_BR
    ``` Now make the translation of each .po manually```
    14. docker-compose exec ows datacube-ows-cfg compile -D cuborizonte -d /env/config/ows_refactored/translations en pt_BR
