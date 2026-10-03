package com.example.Nexora.Service;

import com.example.Nexora.Model.EndUser;
import com.example.Nexora.Model.StudentDashboardResponseDTO;
import com.example.Nexora.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);



    @Autowired
    private UserRepo userRepo;

    public EndUser saveUser(EndUser user){
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public EndUser findByEmail(String email) {
        EndUser user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    public EndUser updateProfile(EndUser existingUser, String newName) {
        existingUser.setName(newName);
        return userRepo.save(existingUser);
    }

    public StudentDashboardResponseDTO getStudentDashboard(String email) {

        EndUser user = findByEmail(email);

        StudentDashboardResponseDTO response = new StudentDashboardResponseDTO();

        response.setProfileCompletion(0);
        response.setAtsScore(0);
        response.setGlobalAiMatch(0);

        return response;
    }


}
