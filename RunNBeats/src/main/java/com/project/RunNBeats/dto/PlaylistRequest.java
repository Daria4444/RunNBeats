package com.project.RunNBeats.dto;

import com.project.RunNBeats.enums.PlaylistType;

public class PlaylistRequest {

    private String link;
    private PlaylistType playlistType;

    private int runnerId;

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public PlaylistType getPlaylistType() {
        return playlistType;
    }

    public void setPlaylistType(PlaylistType playlistType) {
        this.playlistType = playlistType;
    }

    public int getRunnerId() {
        return runnerId;
    }

    public void setRunnerId(int runnerId) {
        this.runnerId = runnerId;
    }
}
