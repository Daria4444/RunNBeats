package com.project.RunNBeats.controller;

import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.service.RunnerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/runner")
@CrossOrigin
public class RunnerController {
    RunnerServiceImpl runnerServiceImp;
    @Autowired
    public RunnerController(RunnerServiceImpl runnerServiceImp) {
        this.runnerServiceImp = runnerServiceImp;
    }
    @GetMapping(path = "/get")
    public List<Runner> getRunners() {
        return runnerServiceImp.getRunners();
    }

    @PostMapping(path = "/add")
    public String addRunner(@RequestBody Runner runner) {
        runnerServiceImp.addRunner(runner);
        return "Runner added";
    }
}
