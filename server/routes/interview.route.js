import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  analyzeResume,
  deleteInterview,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterviews,
  submitAnswer,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// routes of different controller
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestion);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish", isAuth, finishInterview);

interviewRouter.get("/get-interview", isAuth, getMyInterviews);
interviewRouter.get("/report/:id", isAuth, getInterviewReport); //id sent from frontend
interviewRouter.delete("/delete/:id", isAuth, deleteInterview);

export default interviewRouter;


