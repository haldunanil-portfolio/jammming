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

	getAccessToken() {
		if (this.accessToken && this.accessTokenIsValid) {
			return userAccessToken;
		} else {
			// grab access token and expiration from hash fragment (assuming it exists)
	        let accessToken = window.location.href.match(/access_token=([^&]*)/);
			let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

			if (accessToken && expiresIn) {
				// if both of these are truthy, then ...
				userAccessToken = accessToken[1];
				userAccessTokenExpiresIn = Number(expiresIn[1]);
				userAccessTokenValidThrough = Date.now() + userAccessTokenExpiresIn;
				return userAccessToken;

			} else {
				// otherwise redirect to the spotify autorization page
				window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			}
		}
	}

};

export default Spotify;