package com.example.Nexora.Model;

import lombok.Data;

import java.util.List;

@Data
public class StudentDashboardResponseDTO {


    private int profileCompletion;

    private int atsScore;

    private int globalAiMatch;

    private List<SkillGapDTO> skills;

    public int getProfileCompletion() {
        return profileCompletion;
    }

    public void setProfileCompletion(int profileCompletion) {
        this.profileCompletion = profileCompletion;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }

    public int getGlobalAiMatch() {
        return globalAiMatch;
    }

    public void setGlobalAiMatch(int globalAiMatch) {
        this.globalAiMatch = globalAiMatch;
    }

    public List<SkillGapDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillGapDTO> skills) {
        this.skills = skills;
    }
}
