package com.example.Nexora.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "candidate_resumes")
public class CandidateResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String documentId;   // vector_store me jo id save hui
    private String fileName;
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String snippet;

    private double atsScore;
    private double semanticScore;

    @ElementCollection
    private java.util.List<String> missingKeywords;

    private String status = "New Match";

}
