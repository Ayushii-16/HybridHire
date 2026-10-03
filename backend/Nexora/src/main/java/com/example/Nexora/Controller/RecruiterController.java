package com.example.Nexora.Controller;
import com.example.Nexora.Model.CandidateResume;
import com.example.Nexora.Model.MyForm;
import com.example.Nexora.Model.StudentFeedbackResponseDTO;
import com.example.Nexora.Repository.CandidateResumeRepository;
import com.example.Nexora.Searching.FusionRanker;
import com.example.Nexora.Searching.SemanticSearch;
import org.apache.tika.Tika;
import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {
    @Autowired private SemanticSearch semanticSearch;
    @Autowired private FusionRanker fusionRanker;
    @Autowired private CandidateResumeRepository candidateResumeRepository;

    @PostMapping("/bulk-upload")
    public List<CandidateResume> bulkUpload(MyForm form, @RequestParam String jobDescription) throws Exception {

        Tika tika = new Tika();
        List<CandidateResume> savedCandidates = new ArrayList<>();

        for (MultipartFile file : form.getFile()) {
            String text = tika.parseToString(file.getInputStream());

            Document doc = new Document(text);
            semanticSearch.saveResumes(List.of(doc));

            StudentFeedbackResponseDTO analysis =
                    fusionRanker.analyzeResumeForStudent(text, jobDescription);

            CandidateResume candidate = new CandidateResume();
            candidate.setDocumentId(doc.getId());
            candidate.setFileName(file.getOriginalFilename());
            candidate.setJobDescription(jobDescription);
            candidate.setSnippet(text.length() > 200 ? text.substring(0, 200) + "..." : text);
            candidate.setAtsScore(analysis.getAtsScore());
            candidate.setSemanticScore(analysis.getSemanticScore());
            candidate.setMissingKeywords(analysis.getMissingKeywords());

            candidateResumeRepository.save(candidate);
            savedCandidates.add(candidate);
        }

        return savedCandidates;
    }

    @GetMapping("/candidates")
    public List<CandidateResume> getAllCandidates() {
        return candidateResumeRepository.findAll();
    }

    @PostMapping("/candidates/{id}/status")
    public CandidateResume updateStatus(@PathVariable Long id, @RequestParam String status) {
        CandidateResume candidate = candidateResumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(status);
        return candidateResumeRepository.save(candidate);
    }
}
