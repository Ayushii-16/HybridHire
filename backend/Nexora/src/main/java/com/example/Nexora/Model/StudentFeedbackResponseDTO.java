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

    public List<String> getVocabularySuggestions() {
        return vocabularySuggestions;
    }

    public void setVocabularySuggestions(List<String> vocabularySuggestions) {
        this.vocabularySuggestions = vocabularySuggestions;
    }

    public List<String> getActionableTips() {
        return actionableTips;
    }

    public void setActionableTips(List<String> actionableTips) {
        this.actionableTips = actionableTips;
    }
}
