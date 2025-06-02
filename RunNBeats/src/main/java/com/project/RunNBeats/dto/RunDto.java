package com.project.RunNBeats.dto;
import java.util.List;

public class RunDto {

    private int runnerId;
    private double distance;               // în metri
    private int duration;                  // în secunde
    private double averageSpeed;           // în m/s
    private double pace;                   // ex: "5:12 /km"
    private List<List<Double>> path;       // List de [lat, lon]
    private String timestamp;              // ISO 8601
    private String mapImage;               // imaginea hărții în base64
    private String mapImageUrl;             // asta e pentru cand intorc alergarile

    // Getters & Setters

    public int getRunnerId() {
        return runnerId;
    }

    public void setRunnerId(int runnerId) {
        this.runnerId = runnerId;
    }

    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(double averageSpeed) { this.averageSpeed = averageSpeed; }

    public double getPace() {
        return pace;
    }

    public void setPace(double pace) {
        this.pace = pace;
    }

    public List<List<Double>> getPath() { return path; }
    public void setPath(List<List<Double>> path) { this.path = path; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getMapImage() { return mapImage; }
    public void setMapImage(String mapImage) { this.mapImage = mapImage; }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public void setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
    }
}

