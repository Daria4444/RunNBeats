package com.project.RunNBeats.repository;

import com.project.RunNBeats.enums.AchievementType;
import com.project.RunNBeats.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByType(AchievementType type);
}