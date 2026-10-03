package com.example.Nexora.Model;
import lombok.Data;

@Data
public class InterviewEvaluationDTO {

    private Double technicalScore;
    private Double codingScore;
    private Double communicationScore;
    private Double hrScore;
    private Double overallScore;
    private String feedback;

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

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}