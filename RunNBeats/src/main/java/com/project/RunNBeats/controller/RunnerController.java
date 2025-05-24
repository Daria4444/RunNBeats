package com.project.RunNBeats.controller;

import com.project.RunNBeats.dto.FeedbackRequest;
import com.project.RunNBeats.dto.Login;
import com.project.RunNBeats.dto.RunnerRequest;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.service.EmailService;
import com.project.RunNBeats.service.RunnerServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/runner")
@CrossOrigin
public class RunnerController {
    @Autowired
    private EmailService emailService;


    RunnerServiceImpl runnerServiceImp;

    @Autowired
    public RunnerController(RunnerServiceImpl runnerServiceImp) {
        this.runnerServiceImp = runnerServiceImp;
    }

    @Operation(summary = "Obține toți runnerii")
    @GetMapping(path = "/get")
    public List<Runner> getRunners() {
        return runnerServiceImp.getRunners();
    }

    @Operation(summary = "Obține un runner după ID")
    @GetMapping(path = "/get/{runnerId}")
    public Runner getRunner(
            @Parameter(description = "ID-ul runnerului")
            @PathVariable int runnerId) {
        return runnerServiceImp.getRunnerById(runnerId);
    }

    @Operation(summary = "Adaugă un nou runner")
    @PostMapping(path = "/add")
    public String addRunner(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Obiectul runner")
            @RequestBody RunnerRequest runnerRequest) {
        runnerServiceImp.addRunner(runnerRequest);
        return "Runner added";
    }

    @Operation(summary = "Actualizează un runner existent")
    @PutMapping(path = "/put/{runnerId}")
    public String updateRunner(
            @Parameter(description = "ID-ul runnerului de actualizat")
            @PathVariable int runnerId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datele actualizate pentru runner")
            @RequestBody Runner runner) {
        runnerServiceImp.updateRunner(runnerId, runner);
        return "Runner updated";
    }

    @Operation(summary = "Șterge un runner după ID")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/delete/{runnerId}")
    public String deleteRunner(
            @Parameter(description = "ID-ul runnerului de șters")
            @PathVariable int runnerId) {
        runnerServiceImp.deleteRunner(runnerId);

        emailService.sendNotification(
                "test@example.com",
                "Runner deleted",
                "Runner cu ID-ul " + runnerId + " a fost șters cu succes."
        );
        return "Runner deleted";
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        Optional<Runner> runner = runnerServiceImp.findByUsernameAndPassword(
                login.getUsername(), login.getPassword()
        );

        if (runner.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("runnerId", runner.get().getRunnerId());
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping(path = "/feedback/add")
    public ResponseEntity<String> receiveFeedback(@RequestBody FeedbackRequest feedback) {
        runnerServiceImp.addFeedback(feedback);
        return ResponseEntity.ok("Feedback saved successfully");
    }
}

