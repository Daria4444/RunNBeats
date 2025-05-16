package com.project.RunNBeats.service;

import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Playlist;
import com.project.RunNBeats.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistServiceImpl {
    private final PlaylistRepository playlistRepository;

    @Autowired
    public PlaylistServiceImpl(PlaylistRepository playlistRepository){
        this.playlistRepository = playlistRepository;
    }

    public List<Playlist> getPlaylists() {
        return this.playlistRepository.findAll();
    }

    public Playlist getPlaylistById(int playlistId) {
        return this.playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));
    }

    public Playlist addPlaylist(Playlist playlist) {
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
