package com.project.RunNBeats.service;

import com.project.RunNBeats.dto.FeedbackRequest;
import com.project.RunNBeats.dto.RunnerRequest;
import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Feedback;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.RunNBeats.repository.RunnerRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RunnerServiceImpl {
    private final RunnerRepository runnerRepository;
    private final FeedbackRepository feedbackRepository;
    @Autowired
    public RunnerServiceImpl(RunnerRepository runnerRepository, FeedbackRepository feedbackRepository) {
        this.runnerRepository = runnerRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public List<Runner> getRunners() {
        return runnerRepository.findAll();
    }
    public Runner getRunnerById(int runnerId) {
        return runnerRepository.findById(runnerId)
                .orElseThrow(() -> new RuntimeException("Runner not found with id: " + runnerId));

    }
    public Runner addRunner(RunnerRequest runnerRequest) {
        /*if (runner.getPlaylists() != null) {
            for (Playlist playlist : runner.getPlaylists()) {
                playlist.setRunner(runner);
            }
        }

        if (runner.getRuns() != null) {
            for (Run run : runner.getRuns()) {
                run.setRunner(runner);
            }
        }*/

        Runner runner = new Runner();
        runner.setFirstName(runnerRequest.getFirstName());
        runner.setLastName(runnerRequest.getLastName());
        runner.setUsername(runnerRequest.getUsername());
        runner.setPhoneNumber(runnerRequest.getPhoneNumber());
        runner.setEmail(runnerRequest.getEmail());
        runner.setPassword(runnerRequest.getPassword());
        runner.setSignInDate(LocalDate.now());
        runner.setTotalDistance(0.0);
        runner.setRole("ADMIN");
        runner.setRuns(new ArrayList<>());
        runner.setPlaylists(new ArrayList<>());
        // ADAUGA SI ALEGARILE SI PLAYLIST URILE
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

    public boolean login(String username, String password) {
        return runnerRepository.findByUsername(username)
                .map(runner -> runner.getPassword().equals(password))
                .orElse(false);
    }

    public Feedback addFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setSatisfaction(request.getSatisfaction());
        feedback.setUserType(request.getUserType());
        feedback.setAgree(request.isAgree());
        feedback.setComments(request.getComments());

        return feedbackRepository.save(feedback);
    }

    public Optional<Runner> findByUsernameAndPassword(String username, String password) {
        return runnerRepository.findByUsernameAndPassword(username, password);
    }

    public List<Runner> searchByUsername(String query) {
        return runnerRepository.findByUsernameContainingIgnoreCase(query);
    }

}
