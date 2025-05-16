package com.project.RunNBeats.controller;

import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.service.RunServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/run")
public class RunController {
    private RunServiceImpl runServiceImpl;

    @Autowired
    public RunController(RunServiceImpl runServiceImpl) {
        this.runServiceImpl = runServiceImpl;
    }

    @GetMapping(path = "/get")
    public List<Run> getRuns () {
        return runServiceImpl.getRuns();
    }

    @GetMapping(path = "/get/run/{runId}")
    public Run getRunById(@PathVariable int runId) {
        return runServiceImpl.getRunById(runId);
    }

    @PostMapping(path = "/add")
    public String addRun(@RequestBody Run run) {
        runServiceImpl.addRun(run);
        return "Run added";
    }

    @PutMapping(path = "/put/{runId}")
    public String updateRun(@PathVariable int runId, @RequestBody Run run) {
        runServiceImpl.updateRun(runId, run);
        return "Run updated";
    }

    @DeleteMapping(path = "/delete/{runId}")
    public String deleteRun(@PathVariable int runId) {
        runServiceImpl.deleteRun(runId);
        return "Run deleted";
    }
}
