package com.example.Nexora.Service;

import com.example.Nexora.Model.InterviewSession;
import com.example.Nexora.Model.MockInterviewResponseDTO;
import com.example.Nexora.Model.StudentAnalysisRequestDTO;
import com.example.Nexora.Model.StudentAnswerDTO;
import com.example.Nexora.Repository.InterviewRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Security;
import java.util.List;
import java.util.Optional;

@Service
public class MockInterviewService {


    @Autowired
    private InterviewRepository interviewRepository;

    private ChatClient chatClient;

    public MockInterviewService(OllamaChatModel chatModel){
        this.chatClient = ChatClient.builder(chatModel).build();
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

        interviewRepository.save(session);

        return result;

    }

    public String evaluateResult(StudentAnswerDTO request){

        InterviewSession session = interviewRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with ID: " + request.getSessionId()));

        String prompt = String.format(
                "You are an expert Technical Interviewer. Evaluate the candidate's answers based on the interview questions generated.\n\n" +
                        "Questions Asked:\n%s\n\n" +
                        "Candidate Answers:\n%s\n\n" +
                        "Provide an overall score out of 10, key strengths, areas of improvement, and detailed technical feedback for each answer.",
                session.getAiResponse(),
                request.getStudentAnswers()
        );

        String feedback = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        session.setStudentAnswers(request.getStudentAnswers());
        session.setAiFeedback(feedback);
        interviewRepository.save(session);

        return feedback;

    }

    public List<InterviewSession> getInterviewHistory(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return interviewRepository.findByEmail(email);

    }

}
