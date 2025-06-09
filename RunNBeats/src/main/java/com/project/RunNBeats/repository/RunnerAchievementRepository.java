package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Achievement;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.model.RunnerAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RunnerAchievementRepository extends JpaRepository<RunnerAchievement, Long> {
    boolean existsByRunnerAndAchievement(Runner runner, Achievement achievement);
    List<RunnerAchievement> findByRunner(Runner runner);
    List<RunnerAchievement> findByRunner_RunnerId(int runnerId);
}
