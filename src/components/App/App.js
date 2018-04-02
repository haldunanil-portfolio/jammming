import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [
        {
          id: 1,
          name: 'You Are',
          artist: 'Armin van Buuren',
          album: 'Single',
          uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6'
        },
        {
          id: 2,
          name: 'Blah Blah',
          artist: 'Armin van Buuren',
          album: 'ID',
          uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG3'
        }
      ],
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
    console.log(term);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
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
