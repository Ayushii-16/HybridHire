package com.example.Nexora.Model;

import lombok.Data;

import java.util.List;

@Data
public class MockInterviewResponseDTO {

    private Long sessionId;
    private List<InterviewQuestion> questions;

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    @Data
    public static class InterviewQuestion{
        private String question;
        private String hint;
    }

}
