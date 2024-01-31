from datetime import datetime
from fastapi import APIRouter, Body, status
from fastapi.responses import HTMLResponse
from auth import AuthUser
from models.todo import Todo, TodoCreateInput, TodoSearch, TodoUpdateInput
from db import DB

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("")
def get_user_todos(user: AuthUser, db: DB, showComplete: bool = False) -> list[Todo]:
    where = {"userId": user.id}
    if not showComplete:
        where["completed"] = None
    # In the python implementation of prisma, order only works for one field at a time
    # Ideally this would be [{"completed": "desc"}, {"createdAt": "desc"}]
    todos = db.todo.find_many(
        where=where, order=[{"completed": "desc"}, {"createdAt": "desc"}]
    )
    return todos


@router.get("/{todo_id}")
def get_todo(todo_id: int, user: AuthUser, db: DB) -> Todo:
    todo = db.todo.find_unique(
        where={"id": todo_id, "userId": user.id}, include={"user": False}
    )
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_404_NOT_FOUND)
    return dict(todo)


@router.post("")
def create_todo(user: AuthUser, db: DB, todo: TodoCreateInput):
    todo = db.todo.create(
        data={
            "title": todo.title,
            "description": todo.description,
            "user": {"connect": {"id": user.id}},
        }
    )
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_406_NOT_ACCEPTABLE)
    return {"message": "Todo created successfully", "data": todo}


@router.put("/{todo_id}")
def update_todo(todo_id: int, user: AuthUser, db: DB, todo: TodoUpdateInput):
    todoData = dict()
    if todo.title is not None:
        todoData["title"] = todo.title
    if todo.description is not None:
        todoData["description"] = todo.description
    todo = db.todo.update(data=todoData, where={"id": todo_id, "userId": user.id})
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_404_NOT_FOUND)
    return {"message": "Todo updated successfully", "data": todo}


@router.delete("/{todo_id}")
def delete_todo(todo_id: int, user: AuthUser, db: DB):
    todo = db.todo.delete(where={"id": todo_id, "userId": user.id})
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_404_NOT_FOUND)
    return {"message": "Todo deleted successfully", "data": todo}


@router.post("/{todo_id}/complete")
def complete_todo(todo_id: int, user: AuthUser, db: DB):
    todo = db.todo.update(
        data={"completed": datetime.now()}, where={"id": todo_id, "userId": user.id}
    )
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_404_NOT_FOUND)
    return {"message": "Todo completed successfully", "data": todo}


@router.post("/{todo_id}/uncomplete")
def uncomplete_todo(todo_id: int, user: AuthUser, db: DB):
    todo = db.todo.update(
        data={"completed": None}, where={"id": todo_id, "userId": user.id}
    )
    if todo is None:
        return HTMLResponse(status_code=status.HTTP_404_NOT_FOUND)
    return {"message": "Todo incomplete successfully", "data": todo}
