//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./layouts/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./layouts/MainLayouts";
import MyCats from "./pages/MyCats";
import MyFriends from "./pages/MyFriends";

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
          path="/my-cats"
          element={
            <MainLayout>
              <MyCats />
            </MainLayout>
          }
        />
        <Route
          path="/my-friends"
          element={
            <MainLayout>
              <MyFriends />
            </MainLayout>
          }
        />
        
               
      </Routes>
    </Router>
  );
}

export default App;
