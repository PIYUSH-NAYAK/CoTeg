// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import Login from "./components/Login";

const ProtectedRoute = ({ element }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/editor/:roomId" element={<ProtectedRoute element={<EditorPage />} />} />
      </Routes>
    </Router>
  );
};

export default App;
