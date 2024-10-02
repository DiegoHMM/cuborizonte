#!/bin/bash

#Ortophoto
#./process_raw_data.sh ORTOFOTO_1999 bh_ortophoto_1999 1999
#./process_raw_data.sh ORTOFOTO_2007 bh_ortophoto_2007_2015 2007
#./process_raw_data.sh ORTOFOTO_2015 bh_ortophoto_2007_2015 2015

# Plan
#./process_raw_data.sh PLANTA_1942 bh_planta_1942 1942
#./process_raw_data.sh PLANTA_1972 bh_planta_1972_1989 1972
#./process_raw_data.sh PLANTA_1989 bh_planta_1972_1989 1989

# Masks
#./process_raw_data.sh CLASSES_2015 bh_class_layer_2007_2015 2015 vegetation building background

#Ortophoto
./setup_datacube.sh bh_ortophoto_1999 ORTOFOTO_1999
./setup_datacube.sh bh_ortophoto_2007_2015 ORTOFOTO_2007
./setup_datacube.sh bh_ortophoto_2007_2015 ORTOFOTO_2015

#Plan
#./setup_datacube.sh bh_planta_1942 PLANTA_1942
#./setup_datacube.sh bh_planta_1972_1989 PLANTA_1972
#./setup_datacube.sh bh_planta_1972_1989 PLANTA_1989

#Masks
./setup_datacube.sh bh_class_layer_2007_2015 CLASSES_2015

