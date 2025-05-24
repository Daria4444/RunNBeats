package com.project.RunNBeats.service;

import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.RunRepository;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RunServiceImpl {
    private final RunRepository runRepository;

    @Autowired
    public RunServiceImpl(RunRepository runRepository) {
        this.runRepository = runRepository;
    }
    public List<Run> getRuns (){ return runRepository.findAll();}

    public Run getRunById(int runId) {
        return runRepository.findById(runId)
                .orElseThrow(() -> new RuntimeException("Run not found with id: " + runId));

    }

    public Page<Run> findByRunner_RunnerId(int runnerId, Pageable pageable) {
        return runRepository.findByRunner_RunnerId(runnerId, pageable);
    }


    public Run addRun(Run run) {return runRepository.save(run);
    }

    public Run updateRun(int runId, Run run) {
        Run existingRun = runRepository.findById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Run not found with id: " + runId));

        //int runnerId = run.getRunner().getRunnerId();

        //Runner runner = runnerRepository.findById(runnerId)
               // .orElseThrow(() -> new ResourceNotFoundException("Runner not found with id: " + runnerId));

        existingRun.setDistance(run.getDistance());
        existingRun.setRunTime(run.getRunTime());
        existingRun.setAveragePace(run.getAveragePace());
        existingRun.setRunLocation(run.getRunLocation());

        return runRepository.save(existingRun);
    }

    public void deleteRun(int runId) {
        if (!runRepository.existsById(runId)) {
            throw new ResourceNotFoundException("Run not found with id: " + runId);
        }
        runRepository.deleteById(runId);
    }
}
