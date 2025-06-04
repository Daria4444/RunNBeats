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
import java.util.ArrayList;
import java.util.List;

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

    public List<Achievement> evaluateAchievements(Runner runner, Run run) {
        List<Achievement> unlocked = new ArrayList<>();

        updateData(runner, run);

        unlocked.addAll(checkSingleRunDistance(runner, run));
        unlocked.addAll(checkTotalDistance(runner));
        unlocked.addAll(checkAveragePace(runner, run));

        return unlocked;
    }

    private List<Achievement> checkSingleRunDistance(Runner runner, Run run) {
        List<Achievement> unlocked = new ArrayList<>();
        var achievements = achievementRepository.findByType(AchievementType.SINGLE_RUN_DISTANCE);
        for (var a : achievements) {
            if (run.getDistance() >= a.getTargetValue()) {
                if (unlockIfNotYet(runner, a)) {
                    unlocked.add(a);
                }
            }
        }
        return unlocked;
    }


    private List<Achievement> checkTotalDistance(Runner runner) {
        List<Achievement> unlocked = new ArrayList<>();
        var achievements = achievementRepository.findByType(AchievementType.TOTAL_DISTANCE);
        for (var a : achievements) {
            if (runner.getTotalDistance() >= a.getTargetValue()) {
                if (unlockIfNotYet(runner, a)) {
                    unlocked.add(a);
                }
            }
        }
        return unlocked;
    }


    private List<Achievement> checkAveragePace(Runner runner, Run run) {
        List<Achievement> unlocked = new ArrayList<>();
        var achievements = achievementRepository.findByType(AchievementType.AVERAGE_PACE);
        for (var a : achievements) {
            if (run.getPace() > a.getTargetValue()) {
                if (unlockIfNotYet(runner, a)) {
                    unlocked.add(a);
                }
            }
        }
        return unlocked;
    }


    private boolean unlockIfNotYet(Runner runner, Achievement achievement) {
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

            return true;
        }
        return false;
    }


    private void updateData(Runner runner, Run run) {
        double updatedDistance = runner.getTotalDistance() + run.getDistance();
        runner.setTotalDistance(updatedDistance);
        runnerRepository.save(runner);
    }
}

