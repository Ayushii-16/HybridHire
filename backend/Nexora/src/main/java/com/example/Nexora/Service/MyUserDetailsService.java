package com.example.Nexora.Service;

import com.example.Nexora.Model.EndUser;
import com.example.Nexora.Repository.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.Nexora.UserPrinciple;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        EndUser user = userRepo.findByEmail(email);
        if(user == null)
            throw new UsernameNotFoundException("Error 404");
        return new UserPrinciple(user);
    }
}
