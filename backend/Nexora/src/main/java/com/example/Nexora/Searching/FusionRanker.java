package com.example.Nexora.Searching;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class FusionRanker {


    public List<Document> mergeAndRank(List<Document> keywordResults, List<Document> semanticResults) {

     Map<String,Document> mergeList = new HashMap<String, Document>();

     Map<String,Double> finalRank = new HashMap<String, Double>();

       if(keywordResults != null) {
            for (int i = 0; i < keywordResults.size(); i++) {
                Document doc = keywordResults.get(i);
                double score = 1.0 / (60.0 + (i + 1));
                mergeList.put(doc.getId(),doc);
                finalRank.put(doc.getId(),score);
            }
     }

        if(semanticResults != null) {
            for (int i = 0; i < semanticResults.size(); i++) {
                Document doc = semanticResults.get(i);
                double score = 1.0 / (60.0 + (i + 1));
                mergeList.put(doc.getId(),doc);
                finalRank.put(doc.getId(),finalRank.getOrDefault(doc.getId(),0.0) + score);
            }
        }

         List<String> sortedIds = new ArrayList<>(finalRank.keySet());
        sortedIds.sort((id1,id2) -> Double.compare(finalRank.get(id2),finalRank.get(id1)));

        List<Document> rankedDocuments = new ArrayList<>();
        for(String id : sortedIds){
            rankedDocuments.add(mergeList.get(id));
        }

        return rankedDocuments;

    }
}
