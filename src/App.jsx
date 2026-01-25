import "./styles/base.css";
import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/counter.css";
import "./styles/marquee.css";
import "./styles/steps.css";
import "./styles/popup.css";
import "./styles/simulasi.css";
import "./styles/voting.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Simulasi from "./pages/Simulasi";
import Voting from "./pages/Voting";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/simulasi" element={<Simulasi />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/voting"
          element={
            <ProtectedRoute>
              <Voting />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
