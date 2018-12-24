import React from 'react'
import axios from 'axios'
import AuthService from '../components/AuthService';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const Auth = new AuthService();

class OrderForm extends React.PureComponent {
	
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.getNewForm = this.getNewForm.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);		
		this.state = {
			categories: [],
			products: [],
			current_order: [],
			all_products: []
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
		
		axios.get('http://localhost:3001/api/v1/all_products', {headers}
			    )
			.then(response => {
				this.setState({
					all_products: response.data
				},() => {
    	})
		})
			.catch(error => {
				alert(error);
		})
		
		axios.get('http://localhost:3001/api/v1/categories', {headers})
			.then(response => {
				this.setState({
					categories: response.data
				},() => {
		const categoryValue = this.state.categories[0].id
		this.setState({
			category: categoryValue
			})
		})
			})
			.catch(error => {
				alert(error);
		})
		
		axios.get('http://localhost:3001/api/v1/categories/1/products', {headers})
			.then(response => {
				this.setState({
					products: response.data
				},() => {
		const productValue = this.state.products[0].id
		this.setState({
			product: productValue
			})
				})
			})
			.catch(error => {
				alert(error);
		})
	};

	findProduct(order) {
		var product_id = Number(order.qued_product)
		let found_product = this.state.all_products.find(obj => obj.id === product_id)
		return(
			found_product.name
		)
	};

	getNewForm(e) {
		e.preventDefault();
		e.persist();
		const headers = {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		};

		if (Auth.loggedIn()) {
		  headers['Authorization'] = 'Bearer ' + Auth.getToken()
		};
		this.setState(
			{
				[e.target.name]: e.target.value
			}
		);

		const categoryID = e.target.value
		const url = `http://localhost:3001/api/v1/categories/${categoryID}/products`;
		
		axios.get(url, {headers})
			  .then(response => {
					this.setState({
						products: response.data,
						category: e.target.value
					},() => {
			const productValue = this.state.products[0].id
			this.setState({
				product: productValue
				})
			})
			  })
			  .catch(error => console.log(error)
		);
	};
	
	handleChange(e) {
		e.preventDefault();
		this.setState(
			{
				[e.target.name]: e.target.value
			}
		);
	};
	
	handleOrderSubmit(e) {
		e.preventDefault();
		const headers = {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		};

		if (Auth.loggedIn()) {
		  headers['Authorization'] = 'Bearer ' + Auth.getToken()
		};
		const url = `http://localhost:3001/api/v1/orders`;
		axios.post(
			    url,
			    { order: 
			    	{
		    		items_purchased: this.current_order
	    			}
			    }, 
			    {headers}
			    )
			  .then(response => {
				window.location = '/order-history';
			  })
			  .catch(error => console.log(error)
		);
	};


	handleFormSubmit(e){
	e.preventDefault();
	e.persist();
	this.setState(previousState => ({
		current_order: [...previousState.current_order, {qued_product: this.state.product, quantity: this.state.quantity }]
		}),() => {
	});

  };	

	render() {
		return (
			<div>
				<Form className='order-category-form' onSubmit={this.handleFormSubmit}>
					<FormGroup row>
						<Label for='categorySelect' sm={2}>Category: </Label>
						<Col sm={10}>
						<Input type='select' name='category' id='categorySelect' value={this.value} onChange={this.getNewForm}>
							{this.state.categories.map((category) => {
								return(
									<option value={category.id} key={category.id}>
										{category.name}
									</option>
								)
							})}
						</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for='productSelect' sm={2}>Product: </Label>
						<Col sm={10}>
						<Input type='select' name='product' id='productSelect' value={this.value} onBlur={this.handleChange}>
							{this.state.products.map((product) => {
								return(
									<option value={product.id} key={product.id}>
										{product.name}
									</option>
								)
							})}
						</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for='quantityInput' sm={2}>Quantity: </Label>
						<Col sm={10}>
						<Input type='number' name='quantity' id='quantityInput' onChange={this.handleChange}>
						</Input>
						</Col>
					</FormGroup>
					<FormGroup className='button-center' row>
						<Col sm={{ size: 20, offset: 10 }}>
							<Button>Add to cart</Button>
						</Col>
					</FormGroup>
				</Form>
				<Form>
					<div className='current-order'>
						<h1> Your Current Order ({this.state.current_order.length})</h1>	
						<div className='current-order-container'>
							{this.state.current_order.map((order) => {
								return(
									<React.Fragment>
										<p>Product: {this.findProduct(order)}</p>
										<p>Quantity: {order.quantity}</p>
									</React.Fragment>
								)
							})}
						<FormGroup className='button-center' row>
							<Col sm={{ size: 20, offset: 10 }}>
								<Button onClick={this.handleOrderSubmit} current_order={this.state.current_order}>Purchase</Button>
							</Col>
						</FormGroup>					
						</div>
					</div>
				</Form>
			</div>
		);
	}
};
export default OrderForm