import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChatProvider from "./context/ChatProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);
