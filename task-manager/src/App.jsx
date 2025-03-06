//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./layouts/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./layouts/MainLayouts";
import Groups from "./pages/Groups";
import Users from "./pages/Users";
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <Users />
            </MainLayout>
          }
        />
                <Route
          path="/groups"
          element={
            <MainLayout>
              <Groups />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
