#!/bin/bash

#Ortophoto
#./process_raw_data.sh ORTOFOTO_1989 bh_ortophoto 1989
./process_raw_data.sh ORTOFOTO_1994 bh_ortophoto 1994
#./process_raw_data.sh ORTOFOTO_1999 bh_ortophoto 1999
#./process_raw_data.sh ORTOFOTO_2007 bh_ortophoto 2007
#./process_raw_data.sh ORTOFOTO_2015 bh_ortophoto 2015

# Plan
#./process_raw_data.sh PLANTA_1942 bh_planta 1942
#./process_raw_data.sh PLANTA_1972 bh_planta 1972
#./process_raw_data.sh PLANTA_1989 bh_planta 1989

# Masks
#./process_raw_data.sh CLASSES_2015 bh_class_layer 2015 vegetation building background
#./process_raw_data.sh CLASSES_2007 bh_class_layer 2007 vegetation building background
#./process_raw_data.sh CLASSES_1999 bh_class_layer 1999 vegetation building background

#Ortophoto

#./setup_datacube.sh Orthophoto bh_ortophoto ORTOFOTO_1989
./setup_datacube.sh Orthophoto bh_ortophoto ORTOFOTO_1994
#./setup_datacube.sh Orthophoto bh_ortophoto ORTOFOTO_1999
#./setup_datacube.sh Orthophoto bh_ortophoto ORTOFOTO_2007
#./setup_datacube.sh Orthophoto bh_ortophoto ORTOFOTO_2015

#Plan
#./setup_datacube.sh Planta bh_planta PLANTA_1942
#./setup_datacube.sh Planta bh_planta PLANTA_1972
#./setup_datacube.sh Planta bh_planta PLANTA_1989

#Masks
#./setup_datacube.sh Segmentacao bh_class_layer CLASSES_2015
#./setup_datacube.sh Segmentacao bh_class_layer CLASSES_2007
#./setup_datacube.sh Segmentacao bh_class_layer CLASSES_1999

#./setup_areas.sh BAIRRO_POPULAR.geojson BAIRRO_POPULAR
#./setup_areas.sh REGIOES.geojson REGIAO



