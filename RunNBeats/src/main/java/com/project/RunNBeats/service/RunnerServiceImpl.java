package com.project.RunNBeats.service;

import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Playlist;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.RunNBeats.repository.RunnerRepository;

import java.util.ArrayList;
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
    public Runner getRunnerById(int runnerId) {
        return runnerRepository.findById(runnerId)
                .orElseThrow(() -> new RuntimeException("Runner not found with id: " + runnerId));

    }
    public Runner addRunner(Runner runner) {
        if (runner.getPlaylists() != null) {
            for (Playlist playlist : runner.getPlaylists()) {
                playlist.setRunner(runner);
            }
        }

        if (runner.getRuns() != null) {
            for (Run run : runner.getRuns()) {
                run.setRunner(runner);
            }
        }
        return runnerRepository.save(runner);
    }

    public void updateRunner(int runnerId, Runner runner) {
        Runner existingRunner = runnerRepository.findById(runnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Runner not found with id: " + runnerId));

        existingRunner.setFirstName(runner.getFirstName());
        existingRunner.setLastName(runner.getLastName());
        existingRunner.setEmail(runner.getEmail());
        existingRunner.setUsername(runner.getUsername());
        existingRunner.setPassword(runner.getPassword());
        existingRunner.setPhoneNumber(runner.getPhoneNumber());
        existingRunner.setTotalDistance(runner.getTotalDistance());
        runner.setPlaylists(new ArrayList<>());

        runnerRepository.save(existingRunner);
    }

    public void deleteRunner(int runnerId) {
        if (!runnerRepository.existsById(runnerId)) {
            throw new ResourceNotFoundException("Runner not found with id: " + runnerId);
        }
        runnerRepository.deleteById(runnerId);
    }

}
