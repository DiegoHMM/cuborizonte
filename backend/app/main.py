from fastapi import FastAPI
from .routers import wcs_routes, datacube_routes, areas_routes

app = FastAPI()

app.include_router(wcs_routes.router)
app.include_router(datacube_routes.router)
app.include_router(areas_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the WCS API!"}
