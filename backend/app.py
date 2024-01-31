from fastapi import FastAPI
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware

from errors import InputException

import logging

logging.basicConfig(level=logging.INFO)
load_dotenv(".env", override=False)

app = FastAPI()

# I hate cors
origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/",
]
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

from db import DB, partials


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return JSONResponse(
        {"message": "Validation error", "fields": exc.body}, status_code=422
    )


@app.exception_handler(InputException)
async def input_exception_handler(request, exc: InputException):
    return JSONResponse(
        {"message": "Invalid input", "fields": exc.fields}, status_code=422
    )


@app.get("")
async def root(db: DB) -> list[partials.UserBase]:
    users = db.user.find_many(
        include={"password": False, "todos": False, "tokens": False}
    )
    return users


import routes

app.include_router(routes.auth_router)
app.include_router(routes.users_router)
app.include_router(routes.todo_router)
