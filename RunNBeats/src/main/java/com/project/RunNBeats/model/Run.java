package com.project.RunNBeats.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
public class Run {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int runId;

    @ManyToOne
    @JoinColumn(name = "runner_id", nullable = false)
    @JsonIgnore
    private Runner runner;

    private Double distance;
    private Double runTime;
    private Double averagePace;
    private String runLocation;

    public Run() {
    }

    public int getRunId() {
        return runId;
    }

    public void setRunId(int runId) {
        this.runId = runId;
    }

    public Runner getRunner() {
        return runner;
    }

    public void setRunner(Runner runner) {
        this.runner = runner;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getRunTime() {
        return runTime;
    }

    public void setRunTime(Double runTime) {
        this.runTime = runTime;
    }

    public Double getAveragePace() {
        return averagePace;
    }

    public void setAveragePace(Double averagePace) {
        this.averagePace = averagePace;
    }

    public String getRunLocation() {
        return runLocation;
    }

    public void setRunLocation(String runLocation) {
        this.runLocation = runLocation;
    }
}
