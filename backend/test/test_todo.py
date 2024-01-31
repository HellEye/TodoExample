from .conftest import client

sample_todos = [
    {"title": "test1"},
    {"title": "test2", "description": "some description"},
    {"title": "test3"},
]


def compare_todos(todo1, todo2):
    if todo1["title"] != todo2["title"]:
        return False
    if "description" in todo1 and "description" in todo2:
        if todo1["description"] != todo2["description"]:
            return False
    return True


def test_initial(log_in):
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 0


def test_create_todos(log_in):
    new_todo = client.post("/todos", json=sample_todos[0])
    assert new_todo.status_code == 200
    assert compare_todos(new_todo.json()["data"], sample_todos[0])
    new_todo_2 = client.post("/todos", json=sample_todos[1])
    assert new_todo_2.status_code == 200
    assert compare_todos(new_todo_2.json()["data"], sample_todos[1])
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 2
    assert compare_todos(todos.json()[0], sample_todos[0])
    assert compare_todos(todos.json()[1], sample_todos[1])


def test_update_todo(log_in):
    new_todo = client.post("/todos", json=sample_todos[0])
    new_todo_id = new_todo.json()["data"]["id"]
    client.put(f"/todos/{new_todo_id}", json={"description": "new description"})
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 1
    assert todos.json()[0]["description"] == "new description"
    assert todos.json()[0]["title"] == sample_todos[0]["title"]
    client.put(f"/todos/{new_todo_id}", json={"title": "new title"})
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 1
    assert todos.json()[0]["description"] == "new description"
    assert todos.json()[0]["title"] == "new title"


def test_delete_todo(log_in):
    new_todo = client.post("/todos", json=sample_todos[0])
    new_todo_id = new_todo.json()["data"]["id"]
    client.delete(f"/todos/{new_todo_id}")
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 0


def test_complete_uncomplete(log_in):
    new_todo = client.post("/todos", json=sample_todos[0])
    new_todo_id = new_todo.json()["data"]["id"]
    client.post(f"/todos/{new_todo_id}/complete")
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 0
    todos = client.get("/todos?showComplete=true")
    assert len(todos.json()) == 1
    assert todos.json()[0]["completed"] is not None
    client.post(f"/todos/{new_todo_id}/uncomplete")
    todos = client.get("/todos")
    assert todos.status_code == 200
    assert len(todos.json()) == 1
    assert todos.json()[0]["completed"] is None
