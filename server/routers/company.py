from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/companies", tags=["companies"])


class CompanyCreate(BaseModel):
    name: str
    website: str
    industry: str


companies: dict[int, dict] = {
    1: {
        "id": 1,
        "name": "Northstar Labs",
        "website": "https://northstar.example.com",
        "industry": "Technology",
    },
    2: {
        "id": 2,
        "name": "Greenfield Health",
        "website": "https://greenfield.example.com",
        "industry": "Healthcare",
    },
    3: {
        "id": 3,
        "name": "Summit Finance",
        "website": "https://summit.example.com",
        "industry": "Financial Services",
    },
    4: {
        "id": 4,
        "name": "BrightPath Education",
        "website": "https://brightpath.example.com",
        "industry": "Education",
    },
}


def create_company(company: CompanyCreate) -> dict:
    company_id = max(companies, default=0) + 1
    new_company = {"id": company_id, **company.model_dump()}
    companies[company_id] = new_company
    return new_company


@router.get("/all")
def get_companies():
    return list(companies.values())


@router.post("/post", status_code=status.HTTP_201_CREATED)
def add_company(company: CompanyCreate):
    return create_company(company)


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def add_companies(new_companies: list[CompanyCreate]):
    return [create_company(company) for company in new_companies]


@router.get("/{company_id}")
def get_company(company_id: int):
    company = companies.get(company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
