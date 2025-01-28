import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./components/Header";
import Todos from "./components/Todos";
import { TodosProvider } from "./context/TodosContext"; // Import the TodosProvider
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1DA1F2", // Twitter blue
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodosProvider>
        {" "}
        {/* Make sure the TodosProvider wraps around your components */}
        <Header />
        <Todos />
      </TodosProvider>
    </ThemeProvider>
  );
}

export default App;
