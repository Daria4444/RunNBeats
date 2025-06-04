package com.project.RunNBeats.repository;

import com.project.RunNBeats.model.Post;
import com.project.RunNBeats.model.Runner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorInOrderByCreatedAtDesc(List<Runner> authors);
    List<Post> findByAuthorOrderByCreatedAtDesc(Runner author);
}

