export default class AuthService {
	// Initializing important variables
	constructor(domain) {
		this.domain = domain || 'http://localhost:3001/api/v1' // API server domain
		this.fetch = this.fetch.bind(this) // React binding stuff
		this.login = this.login.bind(this)
	}

	login(email, password) {
		// Get a token from api server using the fetch api
		return this.fetch(`${this.domain}/authenticate`, {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		}).then(response => {
			this.setToken(response.auth_token) // Setting the token in localStorage
			return Promise.resolve(response);
		})
	}

	loggedIn() {
		// Checks if there is a saved token and it's still valid
		const token = this.getToken() // Getting token from localstorage
		return !!token
	}

	setToken(idToken) {
		// Saves user token to localStorage
		localStorage.setItem('Authorization', idToken)
	}

	getToken() {
		// Retrieves the user token from localStorage
		return localStorage.getItem('Authorization')
	}

	logout() {
		// Clear user token and profile data from localStorage
		localStorage.removeItem('Authorization');
	}


	fetch(url, options) {
		// performs api calls sending the required authentication headers
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
		// Setting Authorization header
		// Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
		if (this.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + this.getToken()
		};
		return fetch(url, {
			headers,
			...options
		})
			.then(this._checkStatus)
			.then(response => response.json())
	}

	_checkStatus(response) {
		// raises an error in case response status is not a success
		if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
			return response
		} else {
			var error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}
};