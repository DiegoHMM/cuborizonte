from fastapi import FastAPI
from .routers import wcs_routes
 

app = FastAPI()

app.include_router(wcs_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the WCS API!"}
