package com.example.Nexora.Model;

import lombok.Data;

@Data
public class StudentAnswerDTO {

    private Long sessionId;
    private  String studentAnswers;

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getStudentAnswers() {
        return studentAnswers;
    }

    public void setStudentAnswers(String studentAnswers) {
        this.studentAnswers = studentAnswers;
    }
}
