package com.example.Nexora.Model;

import lombok.Data;

import java.util.List;

@Data
public class StudentAnalysisRequestDTO {

    private String resumeText;
    private String jobDescription;

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


}
