package com.example.Nexora.Service;

import com.example.Nexora.Model.*;
import com.example.Nexora.Repository.InterviewRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Security;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MockInterviewService {


    @Autowired
    private InterviewRepository interviewRepository;

    private ChatClient chatClient;

    public MockInterviewService(ChatClient.Builder chatModel){
        this.chatClient = chatModel.build();
    }

    public MockInterviewResponseDTO generateQuestions(StudentAnalysisRequestDTO request){

        String prompt = String.format(
                "You are an expert Technical Recruiter and Senior Interviewer. Your task is to create a customized mock interview for a candidate. " +
                        "Analyze the provided Job Description and the candidate's Resume. " +
                        "Based on the required skills in the Job Description and the candidate's experience, generate exactly 5 targeted interview questions. " +
                        "The questions should test the candidate on specific skills needed for the role, especially areas they need to defend or explain based on their resume. " +
                        "For each question, provide a brief 'hint' that outlines the key technical concepts or expected answer points the candidate should mention. " +
                        "Do not include any extra introductory or concluding text.\n\n" +
                        "Job Description:\n%s\n\n" +
                        "Resume:\n%s",
                request.getJobDescription(),
                request.getResumeText()
        );

      MockInterviewResponseDTO   result = chatClient.prompt()
                .user(prompt)
                .call()
                .entity(MockInterviewResponseDTO.class);


        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        InterviewSession session = new InterviewSession();
        session.setEmail(email);
        session.setResumeText(request.getResumeText());
        session.setJobDescription(request.getJobDescription());
        session.setAiResponse(result.toString());

        InterviewSession savedSession = interviewRepository.save(session);
        result.setSessionId(savedSession.getId());

        return result;

    }

    public String evaluateResult(StudentAnswerDTO request){

        InterviewSession session = interviewRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException(
                        "Session not found with ID: " + request.getSessionId()));

        String prompt = String.format(
                "You are an expert Technical Interviewer. Evaluate the candidate's answers based on the interview questions generated.\n\n" +
                        "Questions Asked:\n%s\n\n" +
                        "Candidate Answers:\n%s\n\n" +
                        "Evaluate the candidate and provide scores out of 10 for:\n" +
                        "technicalScore, codingScore, communicationScore, hrScore, and overallScore.\n\n" +

                        "For EACH interview question, provide:\n" +
                        "1. Question number\n" +
                        "2. Evaluation of the candidate's answer\n" +
                        "3. What was correct\n" +
                        "4. What was missing or incorrect\n" +
                        "5. Specific suggestion for improvement\n" +
                        "6. A better/professional answer that the candidate could give.\n\n" +

                        "After evaluating each question, provide:\n" +
                        "Overall strengths\n" +
                        "Overall areas of improvement\n" +
                        "Specific preparation suggestions for the candidate.\n\n" +

                        "Do not skip any question. Even if an answer is missing, clearly mention that the answer was not provided and give the expected answer and preparation suggestion.\n\n" +

                        "Return the response in the exact structured format required by InterviewEvaluationDTO.",
                session.getAiResponse(),
                request.getStudentAnswers()
        );

        InterviewEvaluationDTO evaluation = chatClient.prompt(prompt)
                .call()
                .entity(InterviewEvaluationDTO.class);

        session.setStudentAnswers(request.getStudentAnswers());

        session.setTechnicalScore(evaluation.getTechnicalScore());
        session.setCodingScore(evaluation.getCodingScore());
        session.setCommunicationScore(evaluation.getCommunicationScore());
        session.setHrScore(evaluation.getHrScore());
        session.setOverallScore(evaluation.getOverallScore());

        session.setAiFeedback(evaluation.getFeedback());

        interviewRepository.save(session);

        return evaluation.getFeedback();
    }

    public List<InterviewSession> getInterviewHistory(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return interviewRepository.findByEmail(email);

    }

    public Map<String, Object> getDashboardData() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        List<InterviewSession> sessions = interviewRepository.findByEmail(email);

        Map<String, Object> dashboard = new HashMap<>();

        if (sessions.isEmpty()) {
            dashboard.put("readinessScore", 0);
            dashboard.put("technicalInterview", 0);
            dashboard.put("codingPractice", 0);
            dashboard.put("communicationSkills", 0);
            dashboard.put("hrInterview", 0);
            return dashboard;
        }

        double technical = sessions.stream()
                .filter(s -> s.getTechnicalScore() != null)
                .mapToDouble(InterviewSession::getTechnicalScore)
                .average()
                .orElse(0);

        double coding = sessions.stream()
                .filter(s -> s.getCodingScore() != null)
                .mapToDouble(InterviewSession::getCodingScore)
                .average()
                .orElse(0);

        double communication = sessions.stream()
                .filter(s -> s.getCommunicationScore() != null)
                .mapToDouble(InterviewSession::getCommunicationScore)
                .average()
                .orElse(0);

        double hr = sessions.stream()
                .filter(s -> s.getHrScore() != null)
                .mapToDouble(InterviewSession::getHrScore)
                .average()
                .orElse(0);

        double overall = sessions.stream()
                .filter(s -> s.getOverallScore() != null)
                .mapToDouble(InterviewSession::getOverallScore)
                .average()
                .orElse(0);

        dashboard.put("readinessScore", overall * 10);
        dashboard.put("technicalInterview", technical * 10);
        dashboard.put("codingPractice", coding * 10);
        dashboard.put("communicationSkills", communication * 10);
        dashboard.put("hrInterview", hr * 10);

        return dashboard;
    }

    public String evaluatePracticeAnswer(PracticeAnswerDTO request) {

        String prompt = String.format(
                "You are an expert technical interviewer. " +
                        "Evaluate the candidate's answer to the given interview question.\n\n" +

                        "Question:\n%s\n\n" +
                        "Candidate Answer:\n%s\n\n" +

                        "Check whether the answer is technically correct.\n" +
                        "Return the response in this format:\n\n" +

                        "STATUS: Correct / Partially Correct / Incorrect\n" +
                        "EVALUATION: Brief evaluation of the answer.\n" +
                        "WHAT IS CORRECT: Mention the correct points.\n" +
                        "WHAT IS MISSING OR WRONG: Mention missing or incorrect points.\n" +
                        "BETTER ANSWER: Give a clear professional answer.\n" +
                        "SUGGESTION: Give one specific improvement suggestion.",

                request.getQuestion(),
                request.getAnswer()
        );

        return chatClient.prompt(prompt)
                .call()
                .content();
    }

}
