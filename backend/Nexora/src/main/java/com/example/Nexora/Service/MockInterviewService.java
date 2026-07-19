package com.example.Nexora.Service;

import com.example.Nexora.Model.MockInterviewResponseDTO;
import com.example.Nexora.Model.StudentAnalysisRequestDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

@Service
public class MockInterviewService {

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

        return result;

    }

}
