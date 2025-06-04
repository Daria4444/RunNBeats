package com.project.RunNBeats.controller;

import com.project.RunNBeats.dto.CreatePostDTO;
import com.project.RunNBeats.model.Post;
import com.project.RunNBeats.service.PostService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody CreatePostDTO dto) {
        Post post = postService.createPost(dto);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/feed/{runnerId}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable int runnerId) {
        List<Post> feed = postService.getFeedForRunner(runnerId);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/runner/{runnerId}")
    public ResponseEntity<List<Post>> getPostsByRunner(@PathVariable int runnerId) {
        List<Post> posts = postService.getPostsByRunner(runnerId);
        return ResponseEntity.ok(posts);
    }

}

