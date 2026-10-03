package com.example.Nexora.Controller;

import com.example.Nexora.Model.StudentDashboardResponseDTO;
import com.example.Nexora.Service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class StudentDashboard {

    @Autowired
    private UserService userService;

    @GetMapping("/student/dashboard")
    public ResponseEntity<StudentDashboardResponseDTO> getDashboard(
            Authentication authentication) {
        String email = authentication.getName();

        StudentDashboardResponseDTO response =
                userService.getStudentDashboard(email);
        return ResponseEntity.ok(response);
    }

}
