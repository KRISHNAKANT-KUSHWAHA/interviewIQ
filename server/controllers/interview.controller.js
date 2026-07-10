// convert pdf to text and then ai understand that text
// analyse the resume and creataion of interview so require interview model

import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

const parseAiJson = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  }
  return JSON.parse(text);
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }
    const filepath = req.file.path;

    // convert into binary
    const fileBuffer = await fs.promises.readFile(filepath);
    const unit8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: unit8Array }).promise;

    let resumeText = "";

    //Extract text from all pairs
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    // prompt for  ai
    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    //giving prompt to function
    const aiResponse = await askAi(messages);

    const parsed = parseAiJson(aiResponse);

    fs.unlinkSync(filepath); // automatically delete the resume file after analysis

    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

//>>interview model controller 1

export const generateQuestion = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USERID:", req.userId);

    let { role, experience, mode, resumeText, projects, skills } = req.body;
    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience and Mode are required" });
    }

    //using isauth middleware
    const user = await User.findById(req.userId);

    if (!user) {
      console.log("user not found");
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.credits < 10) {
      console.log("not enough credits, minimum 10 required ");
      return res.status(400).json({
        message: "Not enough credits. Minimum 10 required",
      });
    }

    //in this we are not returning anything as not necessary that the user put all don tree
    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    //propmt design
    //user prompt
    const userPrompt = `
    Role:${role}
    Experience: ${experience}
    InterviewMode: ${mode}
    Projects: ${projectText}
    Skills:${skillsText}
    Resume: ${safeResume}
    `;

    if (!userPrompt.trim()) {
      console.log("Prompt content is empty");
      return res.status(400).json({
        message: "Prompt content is empty.",
      });
    }

    // You are a real human interviewer conducting a professsional interview.

    // speak in simple, natural English as if you are directly talking to the candidate.

    // Generate exactly 15 interview questions.

    // Strict Rules:
    // -Each question must contains between 15 and 25 words.
    // -Each question must be a single complete sentence.
    // -DO NOT number them.
    // -DO NOT add explanations.
    // -DO NOT add extra text before or after.
    // -One question per line only.
    // -Keep language simple and conversational.
    // -Questions must feel practical and realistic.

    // Difficulty progression:
    // Question 1 → easy
    // Question 2 → easy
    // Question 3 → easy
    // Question 4 → easy
    // Question 5 → hard
    // Question 6 → medium
    // Question 7 → medium
    // Question 8 → medium
    // Question 9 → medium
    // Question 10 → easy
    // Question 11 → hard
    // Question 12 → hard
    // Question 13 → hard
    // Question 14 → hard
    // Question 15 → medium

    // Make questions based on the candidate's role, experience, projects, skills, and resume details.

    //message to ai
    const messages = [
      {
        role: "system",
        content: `
      You are a real human interviewer conducting a professional software engineering interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 15 interview questions.

The questions must include a balanced mix of:

- Role-based interview questions related to the candidate’s job role.
- Technical questions based on the candidate’s listed skills and technologies.
- Data Structures and Algorithms (DSA) or logical problem-solving questions when relevant to the role.
- Practical questions based on the candidate’s projects and experience.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- DO NOT number the questions.
- DO NOT add explanations.
- DO NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic like a real interview.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → easy  
Question 4 → easy  
Question 5 → hard  
Question 6 → medium  
Question 7 → medium  
Question 8 → medium  
Question 9 → medium  
Question 10 → easy  
Question 11 → hard  
Question 12 → hard  
Question 13 → hard  
Question 14 → hard  
Question 15 → medium  

Additional Rules:
- Ask at least 4 technical questions based on the candidate's skills.
- Ask at least 3 DSA or problem-solving questions if the role is software engineering related.
- Ask at least 3 questions about the candidate’s projects.
- Ask practical questions that test real-world thinking.

Make all questions based on the candidate's role, experience, projects, skills, and resume details.
      `,
      },

      {
        role: "user",
        content: userPrompt,
      },
    ];
    //response of ai

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      console.log("AI returned empty response.");
      return res.status(500).json({
        message: "AI returned empty response.",
      });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 15);

    if (questionsArray.length === 0) {
      console.log("ai failed to generate question");
      return res.status(500).json({
        message: "AI failed to generate questions.",
      });
    }

    user.credits -= 10;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: [
          "easy",
          "easy",
          "easy",
          "easy",
          "hard",
          "medium",
          "medium",
          "medium",
          "medium",
          "easy",
          "hard",
          "hard",
          "hard",
          "hard",
          "medium",
        ][index],
        timeLimit: [
          60, 60, 60, 60, 60, 90, 90, 90, 90, 90, 120, 120, 120, 120, 120,
        ][index],
      })),
    });

    // sent to frontend submission of each answer and updated to model
    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
    //
  } catch (error) {
    // catch (error) {
    //   console.error("GENERATE QUESTION ERROR:", error);
    //   return res
    //     .status(500)
    //     .json({ message: `failed to create interview ${error}` });
    // }

    console.error("GENERATE QUESTION ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

//submitted answer 2nd controller for giving answer

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);
    const question = interview.questions[questionIndex];

    const isTimeExceeded = timeTaken > question.timeLimit;
    const formattedAnswer = answer ? answer.trim() : "";

    // evaluation prompt
    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak or missing, score low or 0.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.
- If the user did not submit an answer (indicated by "[No answer provided]"), write feedback explaining what they should have focused on.

Correct Answer Generation:
- Provide a clear, simple, and complete correct answer to the question that is easy to understand and serves as a model response.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback",
  "correctAnswer": "a proper, simple, and complete correct answer to the question"
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${formattedAnswer || "[No answer provided]"}
`,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = parseAiJson(aiResponse);

    question.answer = formattedAnswer;
    question.correctAnswer = parsed.correctAnswer || "";

    if (!formattedAnswer) {
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "You did not submit an answer. " + (parsed.feedback || "");
    } else if (isTimeExceeded) {
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "Time limit exceeded. " + (parsed.feedback || "");
    } else {
      question.confidence = parsed.confidence || 0;
      question.communication = parsed.communication || 0;
      question.correctness = parsed.correctness || 0;
      question.score = parsed.finalScore || 0;
      question.feedback = parsed.feedback || "";
    }

    await interview.save();

    return res.status(200).json({ feedback: question.feedback });
  } catch (error) {
    console.error("SUBMIT ANSWER ERROR:", error);
    return res
      .status(500)
      .json({ message: `failed to submit answer ${error}` });
  }
};

// 3rd controller score for final report

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(400).json({ message: "failed to find Interview" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const roundedFinalScore = Math.max(0, Math.round(finalScore));
    const roundedConfidence = Math.max(0, Math.round(avgConfidence));
    const roundedCommunication = Math.max(0, Math.round(avgCommunication));
    const roundedCorrectness = Math.max(0, Math.round(avgCorrectness));

    interview.finalScore = roundedFinalScore;
    interview.status = "completed";

    await interview.save(); //save the interview

    //return values for the report
    return res.status(200).json({
      finalScore: roundedFinalScore,
      confidence: roundedConfidence,
      communication: roundedCommunication,
      correctness: roundedCorrectness,

      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        correctAnswer: q.correctAnswer || "",
      })),
    });
  } catch (error) {
    console.log("failed to finish interview");
    return res
      .status(500)
      .json({ message: `failed to finish Interview ${error}` });
  }
};

//interview history
export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }) //using isauth middleware  && all interview
      .sort({ createdAt: -1 }) //newest interview at top
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to find currentUser Interview ${error}` });
  }
};

//single interview  report
export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const roundedConfidence = Math.max(0, Math.round(avgConfidence));
    const roundedCommunication = Math.max(0, Math.round(avgCommunication));
    const roundedCorrectness = Math.max(0, Math.round(avgCorrectness));
    const roundedFinalScore = Math.max(0, Math.round(interview.finalScore || 0));

    return res.json({
      finalScore: roundedFinalScore,
      confidence: roundedConfidence,
      communication: roundedCommunication,
      correctness: roundedCorrectness,
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: `failed to find currentUser Interview report ${error}`,
    });
  }
};

//delete interview record
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    return res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `failed to delete interview ${error}`,
    });
  }
};
