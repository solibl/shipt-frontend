import React from 'react';
import AuthService from '../components/AuthService';
import {Col, Button, Form, FormGroup, Label, Input, Table} from 'reactstrap';
import axios from 'axios'

const Auth = new AuthService();

class Search extends React.PureComponent {
	constructor(props) {
		super(props);	
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);	
		this.downloadCSV = this.downloadCSV.bind(this);	
		this.state = {
			all_orders: [],
			end_date: null,
			state_date: null,
			timeframe: 'Daily',
			search_history: []
		}
	};

	componentDidMount() {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};

		if (Auth.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + Auth.getToken()
		};
		
	};

	downloadCSV(e) {
		e.preventDefault();
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};

		if (Auth.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + Auth.getToken()
		};

		const start_date = this.state.start_date
		const end_date = this.state.end_date
		const timeframe = this.state.timeframe
		const url = `http://localhost:3001/api/v1/csv?start_date=${start_date}&end_date=${end_date}&timeframe=${timeframe}`;
		
		axios({
			url: url,
			method: 'GET',
			responseType: 'blob', // important
			header: headers 
			}).then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'orders.csv');
				document.body.appendChild(link);
				link.click();
			});
		};

	handleChange(e) {
		e.preventDefault();
		this.setState(
			{
				[e.target.name]: e.target.value
			}
		);
	};

	handleFormSubmit(e) {
		e.preventDefault();
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};

		if (Auth.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + Auth.getToken()
		};

		const url = `http://localhost:3001/api/v1/order_search`;

		axios.post(
					url,
					{ 
						start_date: this.state.start_date,
						end_date: this.state.end_date,
						timeframe: this.state.timeframe
					}, 
					{headers}
					)
				.then(response => {
				this.setState({
					search_history: response.data
					})
				})
				.catch(error => console.log(error)
		);
	};

	render() {
			return (
					<div className='App'>
							<div className='App-header'>
									<h1>Order Search</h1>
									<Button className='order-history-button' href='/orders'>New Order</Button>										
									<Button className='order-history-button' href='/order-history'>Order History</Button>										
									<Button onClick={this.handleLogout} href='/'>Logout</Button>
							</div>
							<div className='order-search-container'>
								<Form>
									<FormGroup row>
										<Label for='startDate' sm={2}>Start Date: </Label>
										<Col sm={4}>
										<Input type='date' name='start_date' onChange={this.handleChange}>
										</Input>
										</Col>
										<Label for='endDate' sm={2}>End Date: </Label>
										<Col sm={4}>
										<Input type='date' name='end_date' onChange={this.handleChange}>
										</Input>
										</Col>
									</FormGroup>
									<FormGroup row>
										<Label for='timeFrameSelect' sm={2}>TimeFrame: </Label>
										<Col sm={10}>
										<Input type='select' name='timeframe' id='timeFrameSelect' value={this.value} onChange={this.handleChange}>
											<option value='Daily'>Daily</option>
											<option value='Weekly'>Weekly</option>
											<option value='Monthly'>Monthly</option>
										</Input>
										</Col>
									</FormGroup>
									<FormGroup className='button-center' row>
										<Col sm={{ size: 20, offset: 10 }}>
											<Button onClick={this.handleFormSubmit}>Search</Button>
										</Col>
									</FormGroup>
									<FormGroup className='button-center' row>
										<Col sm={{ size: 10, offset: 5 }}>
											<Button onClick={this.downloadCSV}>Download as CSV</Button>
										</Col>
									</FormGroup>
								</Form>
								<div>
									<Table>
										<thead>
											<tr>
												<th>Date</th>
												<th>Category</th>
												<th>Product</th>
												<th>Quantity</th>
											</tr>
										</thead>
										<tbody>
										{this.state.search_history.map((search_item) => {
											return(
												<React.Fragment>
													<tr>
														<td>{search_item.date}</td>
														<td>{search_item.category}</td>
														<td>{search_item.product}</td>
														<td>{search_item.quantity_sold}</td>
													</tr>
												</React.Fragment>
											)
										})}
										</tbody>
									</Table>
								</div>	
							</div>
					</div>
			);
	}

}

export default Search;