import os
from typing import Annotated
from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from fastapi_login import LoginManager
from starlette.responses import RedirectResponse
load_dotenv("../.env")

app = FastAPI()
from db import DB, partials


login_manager = LoginManager(os.getenv('SECRET_KEY'), token_url='/auth/login')

@app.get("/")
async def root(db: DB) -> list[partials.UserBase]:
    users = db.user.find_many(include={"password": False, "todos":False, "tokens":False})
    return users 

import auth
import routes
