import { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
