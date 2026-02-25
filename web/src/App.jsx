import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

