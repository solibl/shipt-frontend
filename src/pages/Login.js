import React from 'react';
import AuthService from '../components/AuthService.js';

class Login extends React.PureComponent {
	
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.Auth = new AuthService();
	};

	componentWillMount() {
	    if(this.Auth.loggedIn())
	        this.props.history.replace('/orders');
	};

	handleChange(e){
		this.setState(
			{
				[e.target.name]: e.target.value
			}
		)
	};

	handleFormSubmit(e){
        e.preventDefault();
        this.Auth.login(this.state.email, this.state.password)
            .then(response =>{
               this.props.history.replace('/orders');
            })
            .catch(error =>{
                alert(error);
            })
    };

	render() {
		return (
			<div>
				<div className="login-container">
					<div className="login-card">
						<form onSubmit={this.handleFormSubmit}>
							<input
								className="form-item"
								placeholder="Email:"
								name="email"
								type="email"
								onChange={this.handleChange}
							/>
							<input
								className="form-item"
								placeholder="Password:"
								name="password"
								type="password"
								onChange={this.handleChange}
							/>
							<input
								className="form-submit"
								value="Submit"
								type="submit"
							/>
						</form>
					</div>
				</div>
			</div>
		)
	};

}

export default Login;