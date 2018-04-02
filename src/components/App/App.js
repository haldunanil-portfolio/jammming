import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [
        {
          id: 3,
          name: '22',
          artist: 'Taylor Swift',
          album: '1989',
          uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG1'
        },
        {
          id: 2,
          name: 'Blah Blah',
          artist: 'Armin van Buuren',
          album: 'ID',
          uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6'
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let filteredArray = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id === track.id;
    });

    // only add a track into the playlist if it's not already there
    if (filteredArray.length === 0) {
      let newPlaylist = this.state.playlistTracks.concat(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id !== track.id;
    });

    // set the state to include all other tracks besides 
    // the one that is being removed
    this.setState({playlistTracks: newPlaylist})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    // generate an array of `uri` values called `trackURIs` from the `playlistTracks` property
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
  }

  search(term) {
    // first, get Spotify access token to make search is authenticated
    Spotify.getAccessToken();

    // next, search for the entered term
    let searchResultsPromise = Spotify.search(term);
    
    // finally, wait until the promise is resolved and then update state
    searchResultsPromise.then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        {console.log(Spotify.accessToken)}
        {console.log(Spotify.accessTokenIsValid)}
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
