package com.example.Nexora.Searching;

import com.example.Nexora.Model.StudentFeedbackResponseDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.document.Document;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class FusionRanker {



    private final ChatClient chatClient;

    public FusionRanker(OllamaChatModel chatModel){
        this.chatClient = ChatClient.create(chatModel);
    }


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


    public StudentFeedbackResponseDTO analyzeResumeForStudent(String resumeText, String jobDescription){

        String systemInstruction = "You are an expert ATS. Analyze the following resume text against the job description.\n\n"
                + "1. Find completely missing tech keywords.\n"
                + "2. Scan for weak vocabulary words (like 'helped', 'made') and suggest strong action alternatives.\n\n"
                + "Resume:\n" + resumeText + "\n\n"
                + "Job Description:\n" + jobDescription + "\n\n"
                + "Return the response in a strict JSON format matching the schema.\n"
                + "Do not include any conversational text, explanations, or markdown formatting like ```json.";

        StudentFeedbackResponseDTO responseDTO = chatClient.prompt()
                .user(systemInstruction)
                .call()
                .entity(StudentFeedbackResponseDTO.class);

        return responseDTO;

    }

}
