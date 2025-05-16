package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Run;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RunRepository extends JpaRepository<Run, Integer>{
}
