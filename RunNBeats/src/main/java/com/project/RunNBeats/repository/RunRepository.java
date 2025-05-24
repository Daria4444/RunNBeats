package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Run;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RunRepository extends JpaRepository<Run, Integer> {

    Page<Run> findByRunner_RunnerId(int runnerId, Pageable pageable);

}
