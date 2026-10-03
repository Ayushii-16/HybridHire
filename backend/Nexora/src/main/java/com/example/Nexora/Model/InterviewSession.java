package com.example.Nexora.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    @Column(columnDefinition = "TEXT")
    private String resumeText;
    @Column(columnDefinition = "TEXT")
    private String jobDescription;
    @Column(columnDefinition = "TEXT")
    private String aiResponse;
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TEXT")
    private String studentAnswers;
    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    private Double technicalScore;
    private Double codingScore;
    private Double communicationScore;
    private Double hrScore;
    private Double overallScore;

    public Double getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(Double technicalScore) {
        this.technicalScore = technicalScore;
    }

    public Double getCodingScore() {
        return codingScore;
    }

    public void setCodingScore(Double codingScore) {
        this.codingScore = codingScore;
    }

    public Double getCommunicationScore() {
        return communicationScore;
    }

    public void setCommunicationScore(Double communicationScore) {
        this.communicationScore = communicationScore;
    }

    public Double getHrScore() {
        return hrScore;
    }

    public void setHrScore(Double hrScore) {
        this.hrScore = hrScore;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getStudentAnswers() {
        return studentAnswers;
    }

    public void setStudentAnswers(String studentAnswers) {
        this.studentAnswers = studentAnswers;
    }

    public String getAiFeedback() {
        return aiFeedback;
    }

    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(String aiResponse) {
        this.aiResponse = aiResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
