package com.project.RunNBeats.service;

import com.project.RunNBeats.enums.AchievementType;
import com.project.RunNBeats.model.Achievement;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.model.RunnerAchievement;
import com.project.RunNBeats.repository.AchievementRepository;
import com.project.RunNBeats.repository.RunnerAchievementRepository;
import com.project.RunNBeats.repository.RunnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementService.class);
    private final AchievementRepository achievementRepository;
    private final RunnerAchievementRepository userAchievementRepository;
    private final RunnerRepository runnerRepository;

    public AchievementService(
            AchievementRepository achievementRepository,
            RunnerAchievementRepository userAchievementRepository,
            RunnerRepository runnerRepository
    ) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.runnerRepository = runnerRepository;
    }

    public void evaluateAchievements(Runner runner, Run run) {
        updateData(runner, run);
        checkSingleRunDistance(runner, run);
        checkTotalDistance(runner);
        checkAveragePace(runner, run);
    }

    private void checkSingleRunDistance(Runner runner, Run run) {
        var achievements = achievementRepository.findByType(AchievementType.SINGLE_RUN_DISTANCE);
        for (var a : achievements) {
            if (run.getDistance() >= a.getTargetValue()) {
                unlockIfNotYet(runner, a);
            }
        }
    }

    private void checkTotalDistance(Runner runner) {
        var achievements = achievementRepository.findByType(AchievementType.TOTAL_DISTANCE);
        for (var a : achievements) {
            if (runner.getTotalDistance() >= a.getTargetValue()) {
                unlockIfNotYet(runner, a);
            }
        }
    }

    private void checkAveragePace(Runner runner, Run run) {
        var achievements = achievementRepository.findByType(AchievementType.AVERAGE_PACE);
        for (var a : achievements) {
            if (run.getPace() <= a.getTargetValue()) {
                unlockIfNotYet(runner, a);
            }
        }
    }

    private void unlockIfNotYet(Runner runner, Achievement achievement) {
        if (!userAchievementRepository.existsByRunnerAndAchievement(runner, achievement)) {
            RunnerAchievement ua = new RunnerAchievement();
            ua.setRunner(runner);
            ua.setAchievement(achievement);
            ua.setUnlockedAt(LocalDateTime.now());
            userAchievementRepository.save(ua);

            logger.info("🏅 Achievement UNLOCKED: '{}' (Type: {}, Level: {}) for runner ID {}",
                    achievement.getName(),
                    achievement.getType(),
                    achievement.getLevel(),
                    runner.getRunnerId());
        }
    }

    private void updateData(Runner runner, Run run) {
        double updatedDistance = runner.getTotalDistance() + run.getDistance();
        runner.setTotalDistance(updatedDistance);
        runnerRepository.save(runner);
    }
}

