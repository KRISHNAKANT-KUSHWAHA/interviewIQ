import React, { useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { IoSparklesOutline } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false, onClose }) {
  //arrow function for authentication
  const dispatch = useDispatch(); //
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      // console.log(response);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data)); //
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.log("Authentication Error:", error);
      if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        alert("Authentication popup was closed or cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        alert("Authentication popup was blocked by the browser. Please enable popups for this site.");
      } else {
        alert(`Authentication failed: ${error.message || error}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div
      className={`w-full ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"} bg-white shadow-2xl border-gray-200`} //this make changes in ismodel so that authentication page is fixed in outer div
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <RiRobot3Fill size={18} />
          </div>
          <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          continue with
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
            <IoSparklesOutline />
            AI Smart InterView
          </span>
        </h1>
        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        <motion.button
          disabled={authLoading}
          onClick={handleGoogleAuth}
          whileHover={!authLoading ? { opacity: 0.9, scale: 1.03 } : {}}
          whileTap={!authLoading ? { opacity: 1, scale: 0.98 } : {}}
          className={`w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md ${
            authLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle size={20} />
          {authLoading ? "Signing in..." : "Continue with google"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;
