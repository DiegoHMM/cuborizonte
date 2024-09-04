# backend/app/main.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.datacube_service import load_datacube_data
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

# Configurações do banco de dados a partir das variáveis de ambiente
DB_CONFIG = {
    'NAME': os.getenv('DB_NAME'),
    'USER': os.getenv('DB_USER'),
    'PASSWORD': os.getenv('DB_PASSWORD'),
    'HOST': os.getenv('DB_HOST'),
    'PORT': os.getenv('DB_PORT')
}



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens, ajuste conforme necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataCubeQuery(BaseModel):
    time: str
    x: tuple
    y: tuple
    crs: str
    resolution: tuple

@app.post("/load_datacube")
async def load_datacube(query: DataCubeQuery):
    try:
        # Certifique-se de passar as configurações corretas para o DataCube
        data, crs = load_datacube_data(query.dict())
        return {"data": data.tolist(), "crs": crs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004, reload=True)
