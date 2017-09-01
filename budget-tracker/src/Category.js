import React, { Component } from 'react';
import './Category.css';
import Transaction from './Transaction.js'

class Category extends Component{
	constructor(props) {
		super(props);
		this.state = {
					newTxn: "",
					newTxnCost: "",
					showTxn: false
				};

	}

	render() {
		return (
			<div className="Category">
			
				<div className="Category-header">
				
					<div className="Category-title"> 
						<input type="checkbox" onChange={this.showHideTransactions.bind(this)} 
							   checked={this.state.showTxn}/>
						<h3> {this.props.cat.name} </h3> 
		                <input type="text" className="form-control"
	                      placeholder="Add expense" 
	                      onChange={this.txnNameChange.bind(this)} 
	                      onKeyPress={this.handleKeyPress.bind(this)}
	                      value={this.state.newTxn}/>
	                    <input type="text" className="form-control"
	                      placeholder="Add cost" 
	                      onChange={this.txnCostChange.bind(this)} 
	                      onKeyPress={this.handleKeyPress.bind(this)}
	                      value={this.state.newTxnCost}/>
		                <button className="add-button" onClick={this.addTxn.bind(this)}> + </button>
					</div> 
					
					<div className="Category-total">{this.sumTotal()}</div>
				
				</div>

				<ul className="Category-txn-area" style={{display: (this.state.showTxn) ? "contents" : "none"}}>
				{this.renderTransactions()}
				</ul>
			</div>

		);
	}
	handleKeyPress(event){
		if(event.key === 'Enter'){
			this.addTxn();
		}
	}

	txnCostChange(event){
		// var cost = parseFloat(event.target.value);
		// if(cost){
		this.setState({newTxnCost: event.target.value});
		// }
	}

	txnNameChange(event){
		this.setState({newTxn: event.target.value});
	}

	addTxn(){
		var newTxnName = this.state.newTxn;
		var newTxnCost = parseFloat(this.state.newTxnCost);
		if(newTxnName && newTxnCost){
			var newTxn = {title: newTxnName, cost: newTxnCost}
			var data = this.props.cat.transactions;
			data.unshift(newTxn);
			this.setState({newTxn: "", newTxnCost: "", showTxn: true});
			this.props.onAddTxn();

		}
	}

	renderTransactions(){
		var ret = [];
		// console.log(this.state.transactions);
		for(var i = 0; i < this.props.cat.transactions.length; i++){
			// console.log(this.state.transactions[i]);
			ret.push(<Transaction txn={this.props.cat.transactions[i]} parity={i % 2}/>);
		}
		return ret;
	}

	sumTotal(){
		var total = 0;
		for(var i = 0; i < this.props.cat.transactions.length; i++){
			var transaction = this.props.cat.transactions[i];
			// console.log(transaction);
			total += transaction.cost;
		}
		return total.toFixed(2);
	}

	showHideTransactions(event){
		// console.log(event.target.checked);
		this.setState({showTxn: event.target.checked});
	}


}

export default Category;
