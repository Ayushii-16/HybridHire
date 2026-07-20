package com.example.Nexora.Repository;

import com.example.Nexora.Model.InterviewSession;
import com.example.Nexora.Model.MockInterviewResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewSession, Long> {

    List<InterviewSession> findByEmail(String email);

}
