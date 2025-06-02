package com.project.RunNBeats.model;

import com.project.RunNBeats.enums.AchievementLevel;
import com.project.RunNBeats.enums.AchievementType;
import jakarta.persistence.*;

@Entity
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private AchievementType type;

    @Enumerated(EnumType.STRING)
    private AchievementLevel level;

    private Double targetValue;

    // Icon, badge URL etc. pot fi adăugate opțional

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AchievementType getType() {
        return type;
    }

    public void setType(AchievementType type) {
        this.type = type;
    }

    public AchievementLevel getLevel() {
        return level;
    }

    public void setLevel(AchievementLevel level) {
        this.level = level;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }
}

