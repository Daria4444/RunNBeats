package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    List<Playlist> findByRunner_RunnerId(int runnerId);
}
