package com.example.Nexora.Repository;

import com.example.Nexora.Model.CandidateResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateResumeRepository extends JpaRepository<CandidateResume,Long> {
}
