package com.example.Nexora.Controller;

import com.example.Nexora.Searching.FusionRanker;
import com.example.Nexora.Searching.KeywordSearch;
import com.example.Nexora.Searching.SemanticSearch;
import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
