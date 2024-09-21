from pydantic import BaseModel

class Coordinates(BaseModel):
    latitude: float
    longitude: float
