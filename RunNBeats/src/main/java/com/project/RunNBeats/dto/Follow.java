package com.project.RunNBeats.dto;

import com.project.RunNBeats.model.Runner;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Runner follower;  // Cine urmărește

    @ManyToOne
    private Runner followed;  // Cine este urmărit

    private LocalDateTime followedAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Runner getFollower() {
        return follower;
    }

    public void setFollower(Runner follower) {
        this.follower = follower;
    }

    public Runner getFollowed() {
        return followed;
    }

    public void setFollowed(Runner followed) {
        this.followed = followed;
    }

    public LocalDateTime getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(LocalDateTime followedAt) {
        this.followedAt = followedAt;
    }
}

