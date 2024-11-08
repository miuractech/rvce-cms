import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MantineProvider>
      <App />
      <Notifications />
    </MantineProvider>
  </BrowserRouter>
);
