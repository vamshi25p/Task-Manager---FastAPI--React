import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TodosContext } from "../context/TodosContext"; // Assuming you're using a context

// Add Todo
function AddTodo() {
  const [item, setItem] = useState("");
  const { fetchTodos } = useContext(TodosContext);

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!item.trim()) {
      alert("Please enter a todo item.");
      return;
    }

    const newTodo = { item };

    const response = await fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      fetchTodos();
      setItem("");
    } else {
      console.error("Failed to add todo");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} sx={{ marginBottom: "20px" }}>
        <TextField
          label="Add a todo item"
          variant="outlined"
          value={item}
          onChange={handleInput}
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            ":hover": {
              transform: "scale(1.1)",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            },
            backgroundColor: "#1DA1F2",
          }}
        >
          Add
        </Button>
      </Stack>
    </form>
  );
}

// Helper Component to display individual Todos
function TodoHelper({ item, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(item);
  const { removeTodo, updateTodo } = useContext(TodosContext); // Get removeTodo and updateTodo from context

  // Handle Delete Todo
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      removeTodo(id); // Directly remove the todo from the state
    } else {
      console.error("Failed to delete todo");
    }
  };

  // Handle Update Todo
  const handleUpdate = async () => {
    if (!editItem.trim()) {
      alert("Please enter a valid todo item.");
      return;
    }

    const response = await fetch(`http://localhost:8000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: editItem }),
    });

    if (response.ok) {
      // Directly update the todo in the state
      updateTodo({ id, item: editItem });
      setIsOpen(false); // Close the dialog after the update
    } else {
      console.error("Failed to update todo");
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 4,
        borderRadius: "12px",
        transition: "transform 0.2s ease-in-out",
        ":hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        },
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {item}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: "space-between", padding: "8px 16px" }}
      >
        <Button
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
          onClick={() => setIsOpen(true)}
        >
          Edit
        </Button>
        <Button
          color="secondary"
          size="small"
          sx={{ fontWeight: "bold" }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>

      {/* Edit Todo Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Todo Item"
            variant="outlined"
            fullWidth
            value={editItem}
            onChange={(e) => setEditItem(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

const Todos = () => {
  const { todos, loading } = useContext(TodosContext); // Access todos and loading from context

  return (
    <Box
      sx={{
        padding: "30px",
        minHeight: "100vh",
        background: "#f0f0f0",
        borderRadius: "15px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}
      >
        My Todo List
      </Typography>
      <AddTodo />
      {loading ? (
        <CircularProgress
          sx={{
            display: "block",
            margin: "auto",
            marginTop: "20px",
            color: "#1DA1F2",
          }}
        />
      ) : (
        <Stack spacing={2}>
          {todos.map((todo) => (
            <Slide direction="up" in={true} timeout={500} key={todo.id}>
              <div>
                <TodoHelper key={todo.id} item={todo.item} id={todo.id} />
              </div>
            </Slide>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Todos;
