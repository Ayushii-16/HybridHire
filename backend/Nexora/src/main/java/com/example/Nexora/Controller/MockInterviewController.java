package com.example.Nexora.Controller;

import com.example.Nexora.Model.MockInterviewResponseDTO;
import com.example.Nexora.Model.StudentAnalysisRequestDTO;
import com.example.Nexora.Service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

}
