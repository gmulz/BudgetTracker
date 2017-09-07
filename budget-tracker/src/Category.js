import React, { Component } from 'react';
import './Category.css';
import Transaction from './Transaction.js'

class Category extends Component{
	constructor(props) {
		super(props);
		this.state = {
					newTxn: "",
					newTxnCost: "",
					showTxn: false,
					editing: false
				};
		
		this.showHideTransactions = this.showHideTransactions.bind(this);
		this.makeEditable = this.makeEditable.bind(this);
		this.categoryNameChange = this.categoryNameChange.bind(this);
		this.handleKeyPressTxn = this.handleKeyPressTxn.bind(this);
		this.handleKeyPressEdit = this.handleKeyPressEdit.bind(this);
		this.txnNameChange = this.txnNameChange.bind(this);
		this.txnCostChange = this.txnCostChange.bind(this);
		this.addTxn = this.addTxn.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);




	}

	render() {
		return (
			<div className="Category">
			
				<div className="Category-header" ref={(node) => {this.node = node}}>
				
					<div className="Category-title"> 
						<input type="checkbox" onChange={this.showHideTransactions} 
							   checked={this.state.showTxn} id={"category-check-" + this.props.idx}/>
						<label htmlFor={"category-check-" + this.props.idx}>
							<span style={{display: (this.state.editing ? "none" : "")}}>{this.props.cat.name}</span>
						</label>
						
						<button className="edit-button" onClick={this.makeEditable}
							style={{display: (this.state.editing ? "none" : "")}}> edit </button>
						
						<div className="Category-edit-area" style={{display: (this.state.editing ? "inline-block" : "none")}}>
							<input type="text" className="form-control"
								defaultValue={this.props.cat.name}
								ref={ (input) => {this.catNameInput = input}}
								onChange={this.categoryNameChange}
								onKeyPress={this.handleKeyPressEdit}
								placeholder="Enter category name"/>

						</div>
						
						<div className="Category-input-area">
							<input type="text" className="form-control"
		                      placeholder="Add expense" 
		                      ref={ (input) => {this.expenseInput = input;} }
		                      onChange={this.txnNameChange} 
		                      onKeyPress={this.handleKeyPressTxn}
		                      value={this.state.newTxn}/>
		                    <input type="text" className="form-control"
		                      placeholder="Add cost" 
		                      onChange={this.txnCostChange} 
		                      onKeyPress={this.handleKeyPressTxn}
		                      value={this.state.newTxnCost}/>
			                <button className="add-button" onClick={this.addTxn}> + </button>
		                </div>
					</div> 
					
					<div className="Category-total">{this.sumTotal()}</div>
				
				</div>

				<ul className="Category-txn-area" style={{display: (this.state.showTxn) ? "contents" : "none"}}>
				{this.renderTransactions()}
				</ul>
			</div>

		);
	}
	handleKeyPressTxn(event){
		if(event.key === 'Enter'){
			this.addTxn();
		}
	}

	handleKeyPressEdit(event){
		if(event.key === 'Enter'){
			this.unMakeEditable();
		}
	}

	categoryNameChange(){
		this.props.cat.name = this.catNameInput.value;
		this.forceUpdate();
	}

	handleOutsideClick(event){
		if(!this.node.contains(event.target)){
			this.unMakeEditable();
		}
	}

	makeEditable(){
		document.addEventListener('click', this.handleOutsideClick.bind(this), false);
		this.setState({editing: true});
	}

	unMakeEditable(){
		document.removeEventListener('click', this.handleOutsideClick.bind(this), false);
		this.setState({editing: false});
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
		this.expenseInput.focus();
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
