import React from "react";
import ReactDOM from "react-dom/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";

// Ensure React is available globally (helps with context in Safari)
if (typeof window !== "undefined") {
  window.React = React;
}

// Initialize app with error boundary
const AppWithProviders = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
};

// Create root and render
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render with error handling
try {
  root.render(<AppWithProviders />);
} catch (error) {
  console.error("Render error:", error);
  // Fallback render without StrictMode if error occurs
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
