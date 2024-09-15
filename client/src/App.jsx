import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import AppRoutes from "./routes";
import store from "./libs/state/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
