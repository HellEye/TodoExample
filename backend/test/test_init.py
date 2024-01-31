from dotenv import load_dotenv, get_key
from fastapi.testclient import TestClient
from db import db as db_prod, Database
import pytest
from generated.prisma.client import Prisma, register

import os
from app import app

BASEDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASEDIR, "..", ".env"))

db_url = os.getenv("TEST_DATABASE_URL")

db = Prisma(
    datasource={"url": db_url},
)
db_testing = Database(db)


app.dependency_overrides[db_prod] = db_testing
client = TestClient(app)
