import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <div className="container">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
