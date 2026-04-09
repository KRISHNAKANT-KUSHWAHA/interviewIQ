import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import InterviewPage from "./pages/InterviewPage.jsx";
import Pricing from "./pages/Pricing.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";

export const ServerUrl = "http://localhost:8000";

// console.log(ServerUrl);

function App() {
  const dispatch = useDispatch();
  //find curen user
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {
          withCredentials: true, // for cookies
        });
        // console.log(result.data);
        // console.log("Dispatching user:", result.data);

        dispatch(setUserData(result.data));
      } catch (error) {
        // console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <Routes>
      {/* different pages */}
      <Route path="/" element={<Home />}></Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/report/:id" element={<InterviewReport />} />
    </Routes>
  );
}

export default App;
