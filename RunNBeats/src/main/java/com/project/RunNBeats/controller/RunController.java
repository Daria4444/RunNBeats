package com.project.RunNBeats.controller;

import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.service.RunServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/run")
@CrossOrigin
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

    @GetMapping("/runner/{runnerId}")
    public Page<Run> getRunsByRunner(@PathVariable int runnerId,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("runId").descending());
        return runServiceImpl.findByRunner_RunnerId(runnerId, pageable);
    }
}
