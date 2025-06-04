package com.project.RunNBeats.repository;

import com.project.RunNBeats.dto.Follow;
import com.project.RunNBeats.model.Runner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowed(Runner follower, Runner followed);
    List<Follow> findByFollower(Runner follower);
    void deleteByFollowerAndFollowed(Runner follower, Runner followed);
}

