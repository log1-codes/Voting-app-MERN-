import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Candidate from "./components/candidates/Candidate";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
// import Profile from "./components/Profile/Profile";
import Profile from "./components/Profile/Profile";
const App = () => {
  return (
   
    <Router>
      <div>
        <ToastContainer />
        <Navbar />
        <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/candidates" element={<Candidate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
