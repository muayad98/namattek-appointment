import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import Success from "./pages/Success";
import "antd/dist/reset.css";
import AdminApp from "./admin/AdminApp";
import LoginPage from "./admin/LoginPage";
import { useState } from "react";


export default function App() {
  const [isAuthed, setAuthed] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/admin/*"
          element={isAuthed ? <AdminApp /> : <LoginPage onLogin={()=>setAuthed(true)} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
