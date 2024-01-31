from datetime import datetime
from typing import Optional

from pydantic import Field, BaseModel
from generated.prisma.bases import BaseTodo


class TodoCreateInput(BaseModel):
    title: str = Field(..., description="Title of the todo")
    description: str | None = Field(
        None, nullable=True, description="Description of the todo"
    )


class TodoUpdateInput(BaseModel):
    title: str | None = Field(None, nullable=True, description="Title of the todo")
    description: str | None = Field(
        None, nullable=True, description="Description of the todo"
    )


class Todo(BaseModel):
    id: int = Field(..., description="Id of the todo")
    title: str = Field(..., description="Title of the todo")
    description: str | None = Field(None, nullable=True)
    userId: int = Field(..., description="Id of the user who created the todo")
    createdAt: datetime = Field(..., description="Date the todo was created")
    updatedAt: datetime = Field(..., description="Date the todo was last updated")
    completed: datetime | None = Field(
        None, nullable=True, description="Date the todo was completed"
    )


class TodoSearch(BaseModel):
    showIncomplete: bool | None = Field(
        False, nullable=True, description="Whether to show incomplete todos"
    )
