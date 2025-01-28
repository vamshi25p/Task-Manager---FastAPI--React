import { createContext, useState, useEffect } from "react";

// Create a context for Todos
export const TodosContext = createContext();

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/todo");
      const data = await response.json();
      setTodos(data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]); // Immediately update state with new todo
  };

  // Remove a todo
  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)); // Directly remove the todo from the state
  };

  // Update a todo
  const updateTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? { ...todo, item: updatedTodo.item } : todo
      )
    ); // Directly update the todo in state
  };

  // Fetch todos initially when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{ todos, fetchTodos, addTodo, removeTodo, updateTodo, loading }}
    >
      {children}
    </TodosContext.Provider>
  );
};
