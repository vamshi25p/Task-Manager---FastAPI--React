from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Set the todos list to be empty initially
todos = []

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to FastAPI!"}

@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return {"data": todos}

@app.post("/todo", tags=["todos"])
async def create_todos(todo: dict) -> dict:
    if "item" not in todo:
        raise HTTPException(status_code=400, detail="Missing 'item' in request body")
    
    # Assign a new ID to the new todo item (in real apps, this would be auto-generated)
    new_id = str(len(todos) + 1)
    new_todo = {"id": new_id, "item": todo["item"]}
    todos.append(new_todo)

    return {
        "data": {"message": "Todo has been added!"}
    }

@app.put("/todo/{id}", tags=["todos"])
async def update_todo(id: str, body: dict) -> dict:
    print(f"Received update request for Todo with id {id}")
    print(f"Request body: {body}")

    if 'item' not in body:
        return {"error": "Missing 'item' in request body"}

    # Search for the todo with the specified ID
    for todo in todos:
        if todo["id"] == id:  # Compare string IDs
            todo["item"] = body["item"]  # Update the todo item
            return {
                "data": f"Todo with id {id} has been updated!"
            }

    return {
        "error": f"Todo with id {id} not found!"
    }

@app.delete("/todo/{id}", tags=["todos"])
async def delete_todo(id: str) -> dict:
    global todos
    # Check if the 'id' exists in each todo dictionary and remove the matching todo
    new_todos = [todo for todo in todos if todo["id"] != id]
    
    # If the list length changed, it means we removed a todo
    if len(new_todos) != len(todos):
        todos = new_todos
        return {"data": f"Todo with id {id} has been removed."}
    else:
        return {"data": f"Todo with id {id} is not found."}
