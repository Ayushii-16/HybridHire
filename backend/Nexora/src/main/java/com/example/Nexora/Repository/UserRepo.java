package com.example.Nexora.Repository;
import com.example.Nexora.Model.EndUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<EndUser,Integer> {

    EndUser findByEmail(String email);
}
