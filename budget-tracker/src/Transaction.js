import React, { Component } from 'react';
import './Transaction.css';

class Transaction extends Component{
	constructor(props){
		super(props);
		this.darkBlue = "#468";
		this.lightBlue = "#8AC";
	}

	render(){
		return (
			<li className="Transaction" style={{backgroundColor: (this.props.parity) ? this.darkBlue : this.lightBlue}}>
				<div className="Transaction-title" > {this.props.txn.title} </div>
				<div className="Transaction-cost" > {this.props.txn.cost} </div>

			</li>

			);
	}
}

export default Transaction;