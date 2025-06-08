package com.project.RunNBeats.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Arrays;

@Entity
public class Run {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int runId;

    @ManyToOne
    @JoinColumn(name = "runner_id", nullable = false)
    @JsonIgnore
    private Runner runner;

    private Double distance;          // în metri
    private Integer duration;         // în secunde
    private Double averageSpeed;      // în m/s
    private double pace;              // ex: "5:12 /km"
    private Instant timestamp;        // momentul alergării
    private String path;              // JSON serializat cu coordonatele GPS
    private String mapImageUrl;

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

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Double getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(Double averageSpeed) {
        this.averageSpeed = averageSpeed;
    }

    public double getPace() {
        return pace;
    }

    public void setPace(double pace) {
        this.pace = pace;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public void setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
    }

    @Override
    public String toString() {
        return "Run{" +
                "runId=" + runId +
                ", runner=" + runner +
                ", distance=" + distance +
                ", duration=" + duration +
                ", averageSpeed=" + averageSpeed +
                ", pace=" + pace +
                ", timestamp=" + timestamp +
                ", path='" + path + '\'' +
                ", mapImage=" + mapImageUrl +
                '}';
    }
}
