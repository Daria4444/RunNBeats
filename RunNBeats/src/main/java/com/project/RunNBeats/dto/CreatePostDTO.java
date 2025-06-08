package com.project.RunNBeats.dto;

public class CreatePostDTO {
    private int runnerId;
    private String description;
    private String imageUrl; // poate fi null
    private Integer runId;         // poate fi null

    public CreatePostDTO() {
    }

    public int getRunnerId() {
        return runnerId;
    }

    public void setRunnerId(int runnerId) {
        this.runnerId = runnerId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageBase64) {
        this.imageUrl = imageBase64;
    }

    public Integer getRunId() {
        return runId;
    }

    public void setRunId(Integer runId) {
        this.runId = runId;
    }
}

