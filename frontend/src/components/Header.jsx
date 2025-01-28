import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Logo from "../assets/todo-logo.svg";

function Header() {
  return (
    <AppBar position="sticky" color="primary" sx={{ boxShadow: 4 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {/* Logo */}
          <img
            src={Logo} // Replace with your logo URL
            alt="ToDo App Logo"
            style={{ width: "30px", height: "30px", marginRight: "10px" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            Todo Application
          </Typography>
        </Box>
        <Button
          color="inherit"
          sx={{ marginLeft: 2, backgroundColor: "#1DA1F2", color: "white" }}
        >
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
