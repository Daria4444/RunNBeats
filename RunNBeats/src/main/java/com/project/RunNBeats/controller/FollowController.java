package com.project.RunNBeats.controller;

import com.project.RunNBeats.dto.FollowRequest;
import com.project.RunNBeats.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin
@RestController
@RequestMapping("/api/v1/follow")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<String> follow(@RequestParam int followerId, @RequestParam int followedId) {
        followService.follow(followerId, followedId);
        return ResponseEntity.ok("Followed successfully");
    }

    @DeleteMapping
    public ResponseEntity<String> unfollow(@RequestParam int followerId, @RequestParam int followedId) {
        followService.unfollow(followerId, followedId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> isFollowing(
            @RequestParam int followerId,
            @RequestParam int followedId) {
        boolean following = followService.isFollowing(followerId, followedId);
        return ResponseEntity.ok(following);
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Boolean>> toggleFollow(@RequestBody FollowRequest request) {
        boolean following = followService.toggleFollow(request.getFollowerId(), request.getFollowedId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("following", following);
        return ResponseEntity.ok(response);
    }

}

