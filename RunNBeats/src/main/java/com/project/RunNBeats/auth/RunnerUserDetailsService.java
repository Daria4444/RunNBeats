package com.project.RunNBeats.auth;

import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class RunnerUserDetailsService implements UserDetailsService {

    @Autowired
    private RunnerRepository runnerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Runner runner = runnerRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        System.out.println("Loaded user: " + runner.getUsername() + ", role: " + runner.getRole());

        return new org.springframework.security.core.userdetails.User(
                runner.getUsername(),
                runner.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(runner.getRole()))
        );
    }
}
