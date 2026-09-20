import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BasicCalculator from "./pages/BasicCalculator";
import AdvancedOperations from "./pages/AdvancedOperations";
import ExpressionCalculator from "./pages/ExpressionCalculator";
import History from "./pages/History";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/calculator"
          element={<BasicCalculator />}
        />

        <Route
          path="/advanced"
          element={<AdvancedOperations />}
        />

        <Route
          path="/expression"
          element={<ExpressionCalculator />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="*"
          element={<Home />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;