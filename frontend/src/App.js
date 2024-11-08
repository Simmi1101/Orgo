import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Admin from "./pages/AdminLandingpage";
import CreateUser from "./pages/CreateUser";
import GetAllUsers from "./pages/GetAllUsers";
import ChatHistory from "./pages/ChatHistory";
import ErrorRoute from "./pages/ErrorRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/get-all-users" element={<GetAllUsers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-panel" element={<Admin />} />
        <Route path="/get-chat-history" element={<ChatHistory />} />
        <Route path="/" element={<Chat />} />
        <Route path="*" element={<ErrorRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
