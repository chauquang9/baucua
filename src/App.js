import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import PrivateRoutes from "./js/components/privateRoutes";
import Baucua from "./js/pages/private/baucua";
import Statistics from "./js/pages/private/statistics";
import Home from "./js/pages/public/home";
import Login from "./js/pages/public/login";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route exact element={<PrivateRoutes />}>
          <Route path="/baucua" element={<Baucua />} />
          <Route path="/profile" element={<Baucua />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
