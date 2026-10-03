package com.example.Nexora.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "candidate_resumes")
public class CandidateResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 500)
    private String documentId;
    @Column(length = 500)
    private String fileName;
    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String snippet;

    private double atsScore;
    private double semanticScore;

    @ElementCollection
    private java.util.List<String> missingKeywords;

    private String status = "New Match";

    @Column(updatable = false)
    private java.time.LocalDate uploadDate = java.time.LocalDate.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

    public double getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(double atsScore) {
        this.atsScore = atsScore;
    }

    public double getSemanticScore() {
        return semanticScore;
    }

    public void setSemanticScore(double semanticScore) {
        this.semanticScore = semanticScore;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
