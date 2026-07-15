package com.example.Nexora.Service;

import com.example.Nexora.Model.EndUser;
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


}
