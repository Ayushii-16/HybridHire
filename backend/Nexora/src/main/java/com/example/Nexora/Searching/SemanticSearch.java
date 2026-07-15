package com.example.Nexora.Searching;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SemanticSearch {

   @Autowired
    VectorStore vectorStore;


    public void saveResumes(List<Document> documents) {
         vectorStore.add(documents);

    }

    public List<Document> similaritySearch(String query){
        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(5)
                        .similarityThreshold(0.75)
                        .build());
    }

}
