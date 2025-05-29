package com.project.RunNBeats.controller;

import com.project.RunNBeats.dto.PlaylistRequest;
import com.project.RunNBeats.model.Playlist;
import com.project.RunNBeats.service.PlaylistServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/playlist")
public class PlaylistController {

    private final PlaylistServiceImpl playlistServiceImpl;

    @Autowired
    public PlaylistController(PlaylistServiceImpl playlistServiceImpl) {
        this.playlistServiceImpl = playlistServiceImpl;
    }

    @GetMapping(path = "/get")
    public List<Playlist> getPlaylists() {
        return playlistServiceImpl.getPlaylists();
    }

    @GetMapping(path = "/get/{runnerId}/playlists")
    public List<Playlist> getPlaylistsByRunnerId(@PathVariable int runnerId) {
        return playlistServiceImpl.getPlaylistsByRunnerId(runnerId);
    }

    @GetMapping(path = "/get/{playlistId}")
    public Playlist getPlaylistById(@PathVariable int playlistId) {
        return playlistServiceImpl.getPlaylistById(playlistId);
    }

    @PostMapping(path = "/add")
    public String addPlaylist(@RequestBody PlaylistRequest playlistRequest) {
        playlistServiceImpl.addPlaylist(playlistRequest);
        return "Playlist added";
    }

    @PutMapping(path = "/put/{playlistId}")
    public String updatePlaylist(@PathVariable int playlistId, @RequestBody Playlist playlist) {
        playlistServiceImpl.updatePlaylist(playlistId, playlist);
        return "Playlist updated";
    }

    @DeleteMapping(path = "/delete/{playlistId}")
    public String deletePlaylist(@PathVariable int playlistId) {
        playlistServiceImpl.deletePlaylist(playlistId);
        return "Playlist deleted";
    }
}
