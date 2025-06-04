package com.project.RunNBeats.service;

import com.project.RunNBeats.dto.Follow;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.FollowRepository;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final RunnerRepository runnerRepository;

    @Autowired
    public FollowService(FollowRepository followRepository, RunnerRepository runnerRepository) {
        this.followRepository = followRepository;
        this.runnerRepository = runnerRepository;
    }

    public void follow(int followerId, int followedId) {
        if (followerId == followedId) {
            throw new IllegalArgumentException("You can't follow yourself.");
        }

        Runner follower = runnerRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        Runner followed = runnerRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        boolean alreadyFollowing = followRepository.existsByFollowerAndFollowed(follower, followed);
        if (!alreadyFollowing) {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowed(followed);
            followRepository.save(follow);
        }
    }

    public void unfollow(int followerId, int followedId) {
        Runner follower = runnerRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        Runner followed = runnerRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        followRepository.deleteByFollowerAndFollowed(follower, followed);
    }

    public boolean isFollowing(int followerId, int followedId) {
        Runner follower = runnerRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        Runner followed = runnerRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        return followRepository.existsByFollowerAndFollowed(follower, followed);
    }

}

