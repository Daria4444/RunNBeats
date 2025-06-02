package com.project.RunNBeats.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "runner_achievements", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"runner_id", "achievement_id"})
        // sa nu avem duplicate, acelasi achievements atribuit aceluiasi runner
})
public class RunnerAchievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "runner_id")
    private Runner runner;

    @ManyToOne(optional = false)
    @JoinColumn(name = "achievement_id")
    private Achievement achievement;

    private LocalDateTime unlockedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Runner getRunner() {
        return runner;
    }

    public void setRunner(Runner runner) {
        this.runner = runner;
    }

    public Achievement getAchievement() {
        return achievement;
    }

    public void setAchievement(Achievement achievement) {
        this.achievement = achievement;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}

