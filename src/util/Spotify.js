const clientId = "5e01d1c1bafc4e3eab9db547189f7a36";
const redirectUri = "https://haldunanil-portfolio.github.io/jammming/";

let userAccessToken;
let userAccessTokenExpiresIn;
let userAccessTokenValidThrough;

let SpotifyWebAPI = {
  get accessToken() {
    return userAccessToken;
  },

  get accessTokenIsValid() {
    return Date.now() < userAccessTokenValidThrough;
  },

  get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json"
    };
  },

  getAccessToken() {
    if (this.accessToken && this.accessTokenIsValid) {
      return this.accessToken;
    } else {
      // grab access token and expiration from hash fragment (assuming it exists)
      let accessToken = window.location.href.match(/access_token=([^&]*)/);
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

      if (accessToken && expiresIn) {
        // if both of these are truthy, then ...
        userAccessToken = accessToken[1];
        userAccessTokenExpiresIn = Number(expiresIn[1]);
        userAccessTokenValidThrough = Date.now() + userAccessTokenExpiresIn;
        return this.accessToken;
      } else {
        // otherwise redirect to the spotify autorization page
        const scopes = [
          "playlist-modify-public",
          "streaming",
          "user-read-birthdate",
          "user-read-email",
          "user-read-private",
          "user-read-playback-state",
          "user-read-currently-playing",
          "user-modify-playback-state"
        ];
        window.location.href =
          "https://accounts.spotify.com/authorize?" +
          "client_id=" +
          clientId +
          "&response_type=token" +
          "&scope=" +
          (scopes ? encodeURIComponent(scopes) : "") +
          "&redirect_uri=" +
          encodeURIComponent(redirectUri);
      }
    }
  },

  search(term) {
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term.replace(
        " ",
        "+"
      )}`,
      // pass header for apiKey verification
      { headers: this.headers }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        let tracks = jsonResponse.tracks.items;
        return tracks.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            albumArt: track.album.images[0].url,
            uri: track.uri,
            length: track.duration_ms
          };
        });
      });
  },

  getUserId() {
    // get userId
    return fetch(
      "https://api.spotify.com/v1/me",
      // pass header for apiKey verification
      { headers: this.headers }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.id;
      });
  },

  createPlaylist(userId, playlistName) {
    // now let's create a new playlist for the user
    return fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      // pass header for apiKey verification
      {
        headers: this.headers,
        method: "POST",
        body: JSON.stringify({ name: playlistName })
      }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.id;
      });
  },

  addTracksToPlaylist(userId, playlistId, trackURIs) {
    // now let's add tracks to playlist
    return fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      // pass header for apiKey verification
      {
        headers: this.headers,
        method: "POST",
        body: JSON.stringify({ uris: trackURIs })
      }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.snapshot_id;
      });
  },

  savePlaylist(playlistName, trackURIs) {
    // return none if playlistName or trackURIs not provided
    if (!playlistName || !trackURIs || trackURIs === []) {
      return;
    }

    // make sure we have an access token
    this.getAccessToken();

    // initialize userId var for reuse
    let userId;
    let playlistId;

    // run through required requests
    return this.getUserId()
      .then(uid => {
        userId = uid;
        return this.createPlaylist(userId, playlistName);
      })
      .then(pid => {
        playlistId = pid;
        return this.addTracksToPlaylist(userId, playlistId, trackURIs);
      });
  },

  startPlayback(uris, offsetUri) {
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${window.deviceId}`, {
      method: "PUT",
      body: JSON.stringify({
        uris: uris,
        offset: {
          uri: offsetUri
        }
      }),
      headers: this.headers
    });
  },

  currentPlayback() {
    return fetch(`https://api.spotify.com/v1/me/player`, {
      headers: this.headers
    });
  },

  play() {
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${window.deviceId}`, {
      method: "PUT",
      headers: this.headers
    });
  },

  pause() {
    return fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: "PUT",
      headers: this.headers
    });
  },

  previousTrack() {
    return fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: "POST",
      headers: this.headers
    });
  },

  nextTrack() {
    return fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: "POST",
      headers: this.headers
    });
  },

  seek(positionMs) {
    return fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
      method: "PUT",
      headers: this.headers
    });
  }


};

export default SpotifyWebAPI;
