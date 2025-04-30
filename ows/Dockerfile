FROM opendatacube/ows:latest

USER root

RUN apt-get update && apt-get install -y \
    python3-pip \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt

# Instala tudo direto no sistema (sem venv)
RUN pip install --break-system-packages --no-cache-dir -r /tmp/requirements.txt
RUN pip install --break-system-packages psycopg2-binary --force-reinstall
RUN pip install --break-system-packages gunicorn
RUN pip install --break-system-packages git+https://github.com/opendatacube/datacube-explorer

WORKDIR /app
COPY . /app
