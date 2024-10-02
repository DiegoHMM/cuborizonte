# Usa uma imagem base do Python leve
FROM python:3.9-slim

# Atualiza o repositório de pacotes e instala as dependências necessárias
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de requisitos para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências listadas no requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Verifica se uvicorn está instalado e onde está localizado
RUN which uvicorn
RUN echo $PATH

# Copia o restante do código do backend para o diretório de trabalho no container
COPY . .

# Expõe a porta em que o backend vai rodar
EXPOSE 8004

# Comando para iniciar o servidor Uvicorn com o aplicativo FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8004", "--reload"]
