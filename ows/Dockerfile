FROM opendatacube/ows:1.8.0-rc1

# Alternar para o usuário root para instalar pacotes
USER root

# Atualiza o sistema e instala python3-pip e virtualenv
RUN apt-get update && apt-get install -y python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

# Cria um ambiente virtual
RUN python3 -m venv /env

# Ajusta PATH para usar o pip do ambiente virtual
ENV PATH="/env/bin:$PATH"

# Copia o requirements.txt para dentro do container
COPY requirements.txt /tmp/requirements.txt

# Instala os pacotes listados no requirements.txt dentro do ambiente virtual
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Retornar ao usuário original (se necessário)
# USER <nome_do_usuario_original>

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o restante da aplicação
COPY . /app
