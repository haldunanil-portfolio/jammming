import React, { Component } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Player from "../Player/Player";
import SpotifyWebAPI from "../../util/Spotify";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      player: {
        open: false,
        position: "bottom",
        noOverlay: true
      },
      currentTrack: {
        name: "",
        artist: "",
        album: "",
        albumArt: "",
        uri: "",
        length: null,
        progressMs: null,
        fromPlaylist: null
      },
      isPlaying: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.addCurrentTrack = this.addCurrentTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.togglePlayer = this.togglePlayer.bind(this);
    this.openPlayer = this.openPlayer.bind(this);
    this.closePlayer = this.closePlayer.bind(this);
    this.onPlayerClose = this.onPlayerClose.bind(this);
    this.startPlayback = this.startPlayback.bind(this);
    this.changeCurrentTrack = this.changeCurrentTrack.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.getTrackIndex = this.getTrackIndex.bind(this);
    this.handlePreviousTrack = this.handlePreviousTrack.bind(this);
    this.handleNextTrack = this.handleNextTrack.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleSeekCall = this.handleSeekCall.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(callback => {
      if (this.state.isPlaying) {
        return SpotifyWebAPI.currentPlayback().then(response => {
          return response.json();
        }).then(jsonResponse => {
          return jsonResponse.progress_ms;
        }).then(progressMs => {
          let currentTrackUpdated = this.state.currentTrack;
          currentTrackUpdated.progressMs = progressMs;
          this.setState({currentTrack: currentTrackUpdated});
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addTrack(track) {
    let filteredArray = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id === track.id;
    });

    // only add a track into the playlist if it's not already there
    if (filteredArray.length === 0) {
      let newPlaylist = this.state.playlistTracks.concat(track);
      this.setState({ playlistTracks: newPlaylist });
    }
  }

  addCurrentTrack() {
    this.addTrack(this.state.currentTrack);
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id !== track.id;
    });

    // set the state to include all other tracks besides
    // the one that is being removed
    this.setState({ playlistTracks: newPlaylist });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    // save playlist name to variable
    const currentPlaylistName = this.state.playlistName;

    // generate an array of `uri` values called `trackURIs` from the `playlistTracks` property
    const trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });

    // save playlist
    SpotifyWebAPI.savePlaylist(currentPlaylistName, trackURIs);

    // reset the state of playlist name to 'New Playlist', empty search results
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: []
    });
  }

  search(term) {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // next, search for the entered term
    let searchResultsPromise = SpotifyWebAPI.search(term);

    // finally, wait until the promise is resolved and then update state
    searchResultsPromise.then(searchResults => {
      this.setState({ searchResults: searchResults });
    });
  }

  togglePlayer(open) {
    let newPlayer = this.state.player;
    newPlayer.open = open;
    this.setState({ player: newPlayer });
    return this.state.player.open;
  }

  openPlayer() {
    return this.togglePlayer(true);
  }

  closePlayer() {
    this.handlePause();
    return this.togglePlayer(false);
  }

  onPlayerClose() {
    this.handlePause();
    return this.togglePlayer(false);
  }

  changeCurrentTrack(name, artist, album, albumArt, uri, length, fromPlaylist) {
    // update state to reflect selected track
    this.setState({
      currentTrack: {
        name: name,
        artist: artist,
        album: album,
        albumArt: albumArt,
        uri: uri,
        length: length,
        progressMs: 0,
        fromPlaylist: fromPlaylist
      }
    });
    return this.state.currentTrack;
  }

  startPlayback(trackUri, fromPlaylist) {
    // currentTrack must be selected and not null and playerOpen must be true
    if (!trackUri || !this.state.player.open) {
      console.log('You have to pick a track and/or player must be open!');
      return;
    }

    // get the right list of tracks
    let activeList;
    if (fromPlaylist) {
      activeList = this.state.playlistTracks;
    } else {
      activeList = this.state.searchResults;
    }

    // map to a list of URIs
    const uris = activeList.map(track => {
      return track.uri;
    });

    // call SpotifyWebAPI.startPlayback with the generated list of URIs as the parameter
    SpotifyWebAPI.startPlayback(uris, trackUri);

    // update state
    this.setState({isPlaying: true});
  }

  handlePlay() {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // next, start playing
    SpotifyWebAPI.play();

    // next, update state
    this.setState({isPlaying: true});
  }

  handlePause() {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // next pause
    SpotifyWebAPI.pause();

    // next, update state
    this.setState({isPlaying: false});
  }

  getTrackIndex() {
    let activeList;
    if (this.state.currentTrack.fromPlaylist) {
      activeList = this.state.playlistTracks;
    } else {
      activeList = this.state.searchResults;
    }

    return activeList.findIndex(track => {
      return track.uri === this.state.currentTrack.uri;
    });
  }

  handlePreviousTrack() {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // next go to previous track
    SpotifyWebAPI.previousTrack();

    // get index of current track
    const index = this.getTrackIndex();

    // get the new track
    let newTrack;
    if (this.state.currentTrack.fromPlaylist) {
      newTrack = this.state.playlistTracks[index-1];
    } else {
      newTrack = this.state.searchResults[index-1];
    }

    // update currentTrack's state
    this.changeCurrentTrack(
      newTrack.name,
      newTrack.artist,
      newTrack.album,
      newTrack.albumArt,
      newTrack.uri,
      newTrack.length,
      this.state.currentTrack.fromPlaylist
    );

  }

  handleNextTrack() {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // next go to next track
    SpotifyWebAPI.nextTrack();

    // get index of current track
    const index = this.getTrackIndex();

    // get the new track
    let newTrack;
    if (this.state.currentTrack.fromPlaylist) {
      newTrack = this.state.playlistTracks[index+1];
    } else {
      newTrack = this.state.searchResults[index+1];
    }

    // update currentTrack's state
    this.changeCurrentTrack(
      newTrack.name,
      newTrack.artist,
      newTrack.album,
      newTrack.albumArt,
      newTrack.uri,
      newTrack.length,
      this.state.currentTrack.fromPlaylist
    );
  }

  handleSeek(progressMs) {
    // first, get SpotifyWebAPI access token to make search is authenticated
    SpotifyWebAPI.getAccessToken();

    // update state
    let currentTrackUpdated = this.state.currentTrack;
    currentTrackUpdated.progressMs = progressMs * 1000;
    this.setState({currentTrack: currentTrackUpdated});
  }

  handleSeekCall() {
    // next actually seek to the right place
    SpotifyWebAPI.seek(this.state.currentTrack.progressMs);

    // now start playing
    this.handlePlay();

  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              onClick={{
                onClick: this.openPlayer,
                changeCurrentTrack: this.changeCurrentTrack,
                startPlayback: this.startPlayback
              }}
              currentTrack={this.state.currentTrack}
              fromPlaylist={false}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onClick={{
                onClick: this.openPlayer,
                changeCurrentTrack: this.changeCurrentTrack,
                startPlayback: this.startPlayback
              }}
              currentTrack={this.state.currentTrack}
              fromPlaylist={true}
            />
          </div>
          <Player
            options={this.state.player}
            close={this.closePlayer}
            onPlayerClose={this.onPlayerClose}
            currentTrack={this.state.currentTrack}
            isPlaying={this.state.isPlaying}
            handlers={{
              addTrack: this.addCurrentTrack,
              play: this.handlePlay,
              pause: this.handlePause,
              nextTrack: this.handleNextTrack,
              previousTrack: this.handlePreviousTrack,
              seek: this.handleSeek,
              handleSeekCall: this.handleSeekCall
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
