import { createRoot } from "react-dom/client";
import App from "./App";

// Render your React component instead
const doc = document.getElementById("registration-wizard");
if (doc) {
  const root = createRoot(doc);
  root.render(<App />);
}
