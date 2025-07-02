package com.project.RunNBeats.auth;

public class AuthResponse {
    private String jwt;
    private Integer runnerId;

    public AuthResponse(String jwt, Integer runnerId) {
        this.jwt = jwt;
        this.runnerId = runnerId;
    }

    public String getJwt() {
        return jwt;
    }

    public Integer getRunnerId() {
        return runnerId;
    }
}
