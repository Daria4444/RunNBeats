package com.project.RunNBeats.auth;

import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private RunnerRepository runnerRepository;


    @PostMapping("/login")
    public ResponseEntity<?> createAuthToken(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // 🔍 Caută runner-ul după username
        Optional<Runner> optionalRunner = runnerRepository.findByUsername(authRequest.getUsername());

        if (optionalRunner.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Runner not found");
        }

        Runner runner = optionalRunner.get();
        Integer runnerId = runner.getRunnerId(); // sau getRunnerId(), dacă așa e numit

        return ResponseEntity.ok(new AuthResponse(jwt, runnerId));
    }


}

