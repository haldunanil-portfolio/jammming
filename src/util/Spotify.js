const clientId = '5e01d1c1bafc4e3eab9db547189f7a36';
const redirectUri = 'http://localhost:3000/';

let userAccessToken;
let userAccessTokenExpiresIn;
let userAccessTokenValidThrough;

let Spotify = {

	get accessToken() {
		return userAccessToken;
	},

	get accessTokenIsValid() {
		return Date.now() < userAccessTokenValidThrough;
	},

	get headers() {
		return {
			Authorization: `Bearer ${this.accessToken}`,
			"Content-Type": 'application/json'
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
				window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			}
		}
	},

	search(term) {
		return fetch(
			// include CORS Anywhere to ensure that CORS restrictions are bypassed
			`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '+')}`,
			// pass header for apiKey verification
			{ headers: this.headers }
		).then(response => {
			return response.json();	
		}).then(jsonResponse => {
			let tracks = jsonResponse.tracks.items;
			return tracks.map(track => {
				return {
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}
			});
		});
	},

	getUserId() {
		// get userId
		return fetch(
			// include CORS Anywhere to ensure that CORS restrictions are bypassed
			"https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me",
			// pass header for apiKey verification
			{ headers: this.headers }
		).then(response => {
			return response.json();
		}).then(jsonResponse => {
			return jsonResponse.id;
		});
	},

	createPlaylist(userId, playlistName) {
		// now let's create a new playlist for the user
		return fetch(
			// include CORS Anywhere to ensure that CORS restrictions are bypassed
			`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists`,
			// pass header for apiKey verification
			{ 
				headers: this.headers,
				method: 'POST',
				body: JSON.stringify({name: playlistName})
			}
		).then(response => {
			return response.json();
		}).then(jsonResponse => {
			return jsonResponse.id;
		});
	},

	addTracksToPlaylist(userId, playlistId, trackURIs) {
		// now let's add tracks to playlist
		return fetch(
			// include CORS Anywhere to ensure that CORS restrictions are bypassed
			`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
			// pass header for apiKey verification
			{ 
				headers: this.headers,
				method: 'POST',
				body: JSON.stringify({uris: trackURIs})
			}
		).then(response => {
			return response.json();
		}).then(jsonResponse => {
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
		return this.getUserId().then(uid => {
			userId = uid;
			return this.createPlaylist(userId, playlistName);
		}).then(pid => {
			playlistId = pid;
			return this.addTracksToPlaylist(userId, playlistId, trackURIs);
		});
	}
};

export default Spotify;



