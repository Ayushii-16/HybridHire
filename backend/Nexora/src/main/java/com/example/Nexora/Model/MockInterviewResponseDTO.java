package com.example.Nexora.Model;

import lombok.Data;

import java.util.List;

@Data
public class MockInterviewResponseDTO {

    private List<InterviewQuestion> questions;

    @Data
    public static class InterviewQuestion{
        private String question;
        private String hint;
    }

}
