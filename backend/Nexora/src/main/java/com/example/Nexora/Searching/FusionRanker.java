package com.example.Nexora.Searching;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class FusionRanker {


    public List<Document> mergeAndRank(List<Document> keywordResults, List<Document> semanticResults) {

        LinkedHashMap<String,Document> mergeList = new LinkedHashMap<>();
        if(keywordResults != null) {
            for (Document list : keywordResults) {
                mergeList.put(list.getId(), list);
            }
        }

        if(semanticResults != null) {
            for (Document list : semanticResults) {
                mergeList.putIfAbsent(list.getId(), list);
            }
        }

        return new ArrayList<>(mergeList.values());

    }
}
