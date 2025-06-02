package com.project.RunNBeats.dto;

import com.project.RunNBeats.model.Achievement;
import com.project.RunNBeats.model.Run;

import java.util.List;

public class RunAchievementDto {
    private Run run;
    private List<Achievement> newlyUnlockedAchievements;

    public Run getRun() {
        return run;
    }

    public void setRun(Run run) {
        this.run = run;
    }

    public List<Achievement> getNewlyUnlockedAchievements() {
        return newlyUnlockedAchievements;
    }

    public void setNewlyUnlockedAchievements(List<Achievement> newlyUnlockedAchievements) {
        this.newlyUnlockedAchievements = newlyUnlockedAchievements;
    }
}
