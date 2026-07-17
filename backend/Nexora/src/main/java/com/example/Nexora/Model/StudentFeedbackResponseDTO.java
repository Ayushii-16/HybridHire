package com.example.Nexora.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentFeedbackResponseDTO {

    private double atsScore;
    private double semanticScore;
    private List<String> missingKeywords;
    private List<String> vocabularySuggestions;
    private List<String> actionableTips;

}
