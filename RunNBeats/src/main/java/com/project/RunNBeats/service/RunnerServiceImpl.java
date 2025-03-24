package com.project.RunNBeats.service;

import com.project.RunNBeats.model.Runner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.RunNBeats.repository.RunnerRepository;

import java.util.List;

@Service
public class RunnerServiceImpl {
    private final RunnerRepository runnerRepository;
    @Autowired
    public RunnerServiceImpl(RunnerRepository runnerRepository) {
        this.runnerRepository = runnerRepository;
    }
    public List<Runner> getRunners() {
        return runnerRepository.findAll();
    }
    public Runner addRunner(Runner runner) {
        return runnerRepository.save(runner);
    }
}
