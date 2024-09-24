FROM opendatacube/ows:latest

# Atualiza o sistema e instala python3-pip e virtualenv
RUN apt-get update && apt-get install -y python3-pip python3-venv

# Cria um ambiente virtual
RUN python3 -m venv /env

# Ativa o ambiente virtual e instala os requisitos
# Ajusta PATH para usar o pip do ambiente virtual
ENV PATH="/env/bin:$PATH"

# Copia o requirements.txt para dentro do container
COPY requirements.txt /tmp/requirements.txt

# Instala os pacotes listados no requirements.txt dentro do ambiente virtual
RUN pip install --no-cache-dir -r /tmp/requirements.txt
