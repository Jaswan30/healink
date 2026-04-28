import React from "react";
import { Routes, Route } from "react-router-dom";

import Admin from "./Admin";
import AdminOrders from "./components/AdminOrders";

function App() {
  return (
    <Routes>
      {/* ADMIN ROUTES ONLY */}
      <Route path="/" element={<Admin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
    </Routes>
  );
}

export default App;
