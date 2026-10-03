package com.example.Nexora.Controller;

import com.example.Nexora.Model.EndUser;
import com.example.Nexora.Service.JwtService;
import com.example.Nexora.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody EndUser user){
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EndUser user)throws Exception{
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));
        if (authentication.isAuthenticated()) {
            String s = jwtService.GenerationToken(user.getEmail()) ;
            return new ResponseEntity<>(s,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody EndUser updated) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        EndUser user = userService.findByEmail(email);
        EndUser saved = userService.updateProfile(user, updated.getName());
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        EndUser user = userService.findByEmail(email);

        Map<String, String> profile = new HashMap<>();
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());

        return ResponseEntity.ok(profile);
    }


}
