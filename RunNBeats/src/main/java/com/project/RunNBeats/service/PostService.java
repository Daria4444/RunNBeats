package com.project.RunNBeats.service;

import com.project.RunNBeats.dto.CreatePostDTO;
import com.project.RunNBeats.dto.Follow;
import com.project.RunNBeats.model.Post;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.FollowRepository;
import com.project.RunNBeats.repository.PostRepository;
import com.project.RunNBeats.repository.RunRepository;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final RunnerRepository runnerRepository;
    private final RunRepository runRepository;
    private final FollowRepository followRepository;

    public PostService(PostRepository postRepository,
                       RunnerRepository runnerRepository,
                       RunRepository runRepository,
                       FollowRepository followRepository) {
        this.postRepository = postRepository;
        this.runnerRepository = runnerRepository;
        this.runRepository = runRepository;
        this.followRepository = followRepository;
    }

    public Post createPost(CreatePostDTO dto) {
        System.out.println("AICI " + dto.getRunnerId());
        Runner author = runnerRepository.findById(dto.getRunnerId())
                .orElseThrow(() -> new RuntimeException("Runner not found"));

        Post post = new Post();
        post.setAuthor(author);
        post.setDescription(dto.getDescription());
        post.setCreatedAt(LocalDateTime.now());

        // Imagine (poți înlocui cu salvare pe disc și generare URL)
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            post.setImageUrl(dto.getImageUrl()); // salvăm URL, nu base64
        }

        // Alergare atașată (opțional)
        if (dto.getRunId() != null) {
            Run run = runRepository.findById(dto.getRunId())
                    .orElseThrow(() -> new RuntimeException("Run not found"));
            post.setRun(run);
        }

        System.out.println("ALERGAREA POSTULUI " + post.getRun().toString());

        return postRepository.save(post);
    }

    public List<Post> getFeedForRunner(int runnerId) {
        Runner runner = runnerRepository.findById(runnerId)
                .orElseThrow(() -> new RuntimeException("Runner not found"));

        List<Follow> follows = followRepository.findByFollower(runner);
        List<Runner> followed = new ArrayList<>(follows.stream()
                .map(Follow::getFollowed)
                .toList());

        followed.add(runner); // ca sa apara si propriile postari

        return postRepository.findByAuthorInOrderByCreatedAtDesc(followed);
    }

    public List<Post> getPostsByRunner(int runnerId) {
        Runner runner = runnerRepository.findById(runnerId)
                .orElseThrow(() -> new RuntimeException("Runner not found"));
        return postRepository.findByAuthorOrderByCreatedAtDesc(runner);
    }
}

