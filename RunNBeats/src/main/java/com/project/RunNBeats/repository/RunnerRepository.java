package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Runner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RunnerRepository extends JpaRepository<Runner, Integer>{
    Optional<Runner> findByUsername(String username);
}
