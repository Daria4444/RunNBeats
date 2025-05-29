package com.project.RunNBeats.service;

import com.project.RunNBeats.dto.PlaylistRequest;
import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Playlist;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.PlaylistRepository;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistServiceImpl {
    private final PlaylistRepository playlistRepository;
    private final RunnerRepository runnerRepository;

    @Autowired
    public PlaylistServiceImpl(PlaylistRepository playlistRepository, RunnerRepository runnerRepository){

        this.playlistRepository = playlistRepository;
        this.runnerRepository = runnerRepository;
    }

    public List<Playlist> getPlaylists() {
        return this.playlistRepository.findAll();
    }

    public Playlist getPlaylistById(int playlistId) {
        return this.playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));
    }

    public List<Playlist> getPlaylistsByRunnerId(int runnerId) {
        return playlistRepository.findByRunner_RunnerId(runnerId);
    }

    public Playlist addPlaylist(PlaylistRequest playlistRequest) {

        Runner runner = runnerRepository.findById(playlistRequest.getRunnerId()).orElseThrow(() -> new ResourceNotFoundException("Runner not found"));
        Playlist playlist = new Playlist();
        playlist.setLink(playlistRequest.getLink());
        playlist.setPlaylistType(playlistRequest.getPlaylistType());
        playlist.setRunner(runner);
        return this.playlistRepository.save(playlist);
    }

    public Playlist updatePlaylist(int playlistId, Playlist playlist) {
        Playlist existingPlaylist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        existingPlaylist.setPlaylistName(playlist.getPlaylistName());
        existingPlaylist.setPlaylistType(playlist.getPlaylistType());

        return playlistRepository.save(existingPlaylist);
    }

    public void deletePlaylist(int playlistId) {
        try {
            playlistRepository.deleteById(playlistId);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Playlist cu ID-ul " + playlistId + " nu există.");
        }
    }

}
