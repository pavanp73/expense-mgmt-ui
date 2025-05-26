import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import Dashboard from "./pages/Dashboard";
import MonthlyReport from "./pages/MonthlyReport";
import Transactions from "./pages/Transactions";

const App: React.FC = () => {
  return (
    <Router>
      <TopNavbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/report" element={<MonthlyReport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;