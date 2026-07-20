package com.example.Nexora.Controller;

import com.example.Nexora.Model.InterviewSession;
import com.example.Nexora.Model.MockInterviewResponseDTO;
import com.example.Nexora.Model.StudentAnalysisRequestDTO;
import com.example.Nexora.Model.StudentAnswerDTO;
import com.example.Nexora.Service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
