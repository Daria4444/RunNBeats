package com.project.RunNBeats.controller;

import com.project.RunNBeats.model.Achievement;
import com.project.RunNBeats.model.RunnerAchievement;
import com.project.RunNBeats.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/achievements")
public class AchievementController {

    private AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/get/{id}")
    public List<RunnerAchievement> getAchievementsForRunner(@PathVariable int id) {
        System.out.println("Cerere pentru achievements de la runnerId=" + id);
        return achievementService.getAchievementsByRunnerId(id);
    }
}
