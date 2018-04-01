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
          album: 'Single'
        },
        {
          id: 2,
          name: 'Blah Blah',
          artist: 'Armin van Buuren',
          album: 'ID'
        }
      ],
      playlistName: 'New Playlist',
      playlistTracks: [
        {
          id: 3,
          name: '22',
          artist: 'Taylor Swift',
          album: '1989'
        },
        {
          id: 2,
          name: 'Blah Blah',
          artist: 'Armin van Buuren',
          album: 'ID'
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
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

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
