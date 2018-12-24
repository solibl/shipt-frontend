import React from 'react';
import OrderForm from '../components/OrderForm'
import AuthService from '../components/AuthService';
import {Button} from 'reactstrap';

const Auth = new AuthService();
class Order extends React.PureComponent {
	handleLogout() {
			Auth.logout();
	};

	render() {
			return (
					<div className='App'>
							<div className='App-header'>
									<h1>Your Order</h1>
									<Button className='order-history-button' href='/order-history'>Order History</Button>										
									<Button className='order-search-button' href='/search'>Order Search</Button>										
									<Button onClick={this.handleLogout} href='/'>Logout</Button>
							</div>
							<div>
							<OrderForm />
							</div>
					</div>
			);
	}

}

export default Order;