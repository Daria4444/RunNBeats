package com.project.RunNBeats.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.RunNBeats.enums.PlaylistType;
import jakarta.persistence.*;

@Entity
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int playlistId;
    @ManyToOne
    @JoinColumn(name = "runner_id", nullable = false)
    @JsonIgnore
    private Runner runner;
    private String link;
    private String playlistName;
    private PlaylistType  playlistType;

    public int getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(int playlistId) {
        this.playlistId = playlistId;
    }

    public Runner getRunner() {
        return runner;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setRunner(Runner runner) {
        this.runner = runner;
    }

    public String getPlaylistName() {
        return playlistName;
    }

    public void setPlaylistName(String playlistName) {
        this.playlistName = playlistName;
    }

    public PlaylistType getPlaylistType() {
        return playlistType;
    }

    public void setPlaylistType(PlaylistType playlistType) {
        this.playlistType = playlistType;
    }
}
