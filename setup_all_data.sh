#!/bin/bash
#./process_raw_data.sh ORTOFOTO_1999 bh_ortophoto_1999 1999
#./process_raw_data.sh ORTOFOTO_2007 bh_ortophoto_2007_2015 2007
#./process_raw_data.sh ORTOFOTO_2015 bh_ortophoto_2007_2015 2015

./setup_datacube.sh bh_ortophoto_1999 ORTOFOTO_1999
./setup_datacube.sh bh_ortophoto_2007_2015 ORTOFOTO_2007
./setup_datacube.sh bh_ortophoto_2007_2015 ORTOFOTO_2015