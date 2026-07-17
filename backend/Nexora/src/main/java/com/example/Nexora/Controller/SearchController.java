package com.example.Nexora.Controller;

import com.example.Nexora.Model.StudentAnalysisRequestDTO;
import com.example.Nexora.Model.StudentFeedbackResponseDTO;
import com.example.Nexora.Searching.FusionRanker;
import com.example.Nexora.Searching.KeywordSearch;
import com.example.Nexora.Searching.SemanticSearch;
import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SearchController {

    @Autowired
    private KeywordSearch keywordSearch;

    @Autowired
    private SemanticSearch semanticSearch;

    @Autowired
    private FusionRanker fusionRanker;

    @GetMapping("/search")
    public List<Document> search(@RequestParam String query){

        List<Document> keywordResults = keywordSearch.searchByKeyword(query);
        List<Document> semanticResults = semanticSearch.similaritySearch(query);

        return fusionRanker.mergeAndRank(keywordResults,semanticResults);

    }
    @PostMapping("/analyze-resume")
    public ResponseEntity<StudentFeedbackResponseDTO> analyzeResume(@RequestBody StudentAnalysisRequestDTO request){
     StudentFeedbackResponseDTO response =    fusionRanker.analyzeResumeForStudent(request.getResumeText(), request.getJobDescription()) ;
return  ResponseEntity.ok(response);
    }

}
