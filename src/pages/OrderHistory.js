import React from 'react';
import AuthService from '../components/AuthService';
import {Button, Table} from 'reactstrap';
import axios from 'axios'

const Auth = new AuthService();

class OrderHistory extends React.PureComponent {
	constructor(props) {
		super(props);	
		this.state = {
			all_orders: []
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
		
		axios.get('http://localhost:3001/api/v1/order_history', {headers}
			    )
			.then(response => {
				this.setState({
					all_orders: response.data
				},() => {
					// console.log(this.state.all_orders)
    	})
		})
			.catch(error => {
				alert(error);
		})
		
	};

	render() {
			return (
					<div className='App'>
							<div className='App-header'>
									<h1>Order History</h1>
									<Button className='order-history-button' href='/orders'>New Order</Button>										
									<Button className='order-search-button' href='/search'>Order Search</Button>										
									<Button onClick={this.handleLogout} href='/'>Logout</Button>
							</div>
							<div className='order-history-container'>
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
										{this.state.all_orders.map((orders) => {
											return(
												orders.map((item) => {
													return(
														console.log(item),
														<React.Fragment>
															<tr>
																<td>{item.date_ordered}</td>
																<td>{item.category}</td>
																<td>{item.product}</td>
																<td>{item.purchased}</td>
															</tr>
														</React.Fragment>
													)
												})
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

export default OrderHistory;