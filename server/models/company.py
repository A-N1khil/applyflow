from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    website: str
    industry: str
