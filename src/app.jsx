import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulasi from "./pages/Simulasi";
import Voting from "./pages/Voting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulasi" element={<Simulasi />} />
        <Route path="/voting" element={<Voting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
