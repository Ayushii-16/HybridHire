package com.example.Nexora.Controller;

import com.example.Nexora.Model.*;
import com.example.Nexora.Service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/interview")
public class MockInterviewController {

    @Autowired
    private MockInterviewService mockInterviewService;

    @PostMapping("/questions")
    public MockInterviewResponseDTO generateQuestions(@RequestBody StudentAnalysisRequestDTO requestDTO){

         return mockInterviewService.generateQuestions(requestDTO);

    }

    @PostMapping("/interview-result")
    public ResponseEntity<String> evaluateResult(@RequestBody StudentAnswerDTO request){

        String feedback = mockInterviewService.evaluateResult(request);

        return ResponseEntity.ok(feedback);

    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSession>> getHistory(){

        List<InterviewSession> history = mockInterviewService.getInterviewHistory();
        return ResponseEntity.ok(history);

    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {

        Map<String, Object> dashboard = mockInterviewService.getDashboardData();

        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/practice-evaluate")
    public ResponseEntity<String> evaluatePracticeAnswer(
            @RequestBody PracticeAnswerDTO request) {

        String result = mockInterviewService.evaluatePracticeAnswer(request);

        return ResponseEntity.ok(result);
    }

}
