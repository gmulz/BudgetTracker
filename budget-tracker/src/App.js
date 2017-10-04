import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Category from './Category.js'
import FileInput from 'react-file-input';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data : [],
                sum : 0,
                newCategory: "",
              };
    this.categorySet = new Set();
    this.months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"]

  }

  render() {
    var meh = (
      <div className="App">
        <div className="App-header">
          <h1> Budget Tracker </h1>
          <form>

            <input id="save" type="button" className="App-header-btn" onClick={this.sendDataToServer.bind(this)} />
            <label htmlFor="save"> Save </label>

            <input id="upload" className="App-header-btn" type="file" accept=".csv" onChange={this.parseCSV.bind(this)} />
            <label htmlFor="upload"> Choose Budget</label>


          </form>
        </div>
        <div className="App-body">
          <label id="super-total">Super Total: {this.sumData()}</label>
          
          <div className="category-title">
            <h2> Categories </h2> 
              <input type="text" className="form-control"
                      placeholder="Add category" 
                      onChange={this.catNameChange.bind(this)} 
                      onKeyPress={this.handleKeyPress.bind(this)}
                      value={this.state.newCategory}/>
              <button className="add-button" onClick={this.addCategory.bind(this)}> + </button>
          </div>

          <div className="category-area"> 
            {this.renderData()}
          </div>
        </div>

      </div>
    );
    return meh;
  }

  addTxn(){
    this.setState({data: this.state.data});
  }

  deleteTxn(){
    this.setState({data: this.state.data});
  }


  handleKeyPress(event){
    if(event.key === 'Enter'){
      this.addCategory();
    }
  }

  downloadCSV(){
    var csvContent = "data:text/csv;charset=utf-8,";
    var longestTxnLength = 0;
    console.log("downloadin");

    //first loop is add all the category headers and find largest txn array
    for(var i = 0; i < this.state.data.length; i++){
      var catName = this.state.data[i].name;
      var catLength = this.state.data[i].transactions.length;
      csvContent += catName + ",Cost" + ((i == this.state.data.length - 1) ? "" : ",");
      if(catLength > longestTxnLength){
        longestTxnLength = catLength;
      }

    }
    csvContent += "\n";
    //probably always going to be food

    //next loop over the length of the largest txn array over all categories,
    //adding transactions if they exist
    for(var i = 0; i < longestTxnLength; i++){
      for(var j = 0; j < this.state.data.length; j++){
        var txn = this.state.data[j].transactions[i];
        if(txn){
          csvContent += txn.title + "," + txn.cost + ((j == this.state.data.length - 1) ? "" : ",");
        }
        else{
          csvContent += ",,";
        }
      }
      csvContent += "\n";
    }
    var encodedURI = encodeURI(csvContent);
    window.open(encodedURI);
  }

  catNameChange(event){
    this.setState({newCategory: event.target.value});
  }



  addCategory() {
    var newCatName = this.state.newCategory;
    if(newCatName && !this.categorySet.has(newCatName)){
      var newCategory = {name: newCatName, transactions: []};
      this.categorySet.add(newCatName);
      var data = this.state.data;
      data.unshift(newCategory);
      this.setState({data: data, newCategory: ""});
      // console.log(this.state.data);
      // this.forceUpdate();
    }
  }

  deleteCategory(idx){
    var data = this.state.data;
    var cat = data.splice(idx, 1)[0];
    this.categorySet.delete(cat.name);
    this.setState({data: data});
  }

  moveCategoryUp(idx){
    var data = this.state.data;
    var cat = data.splice(idx, 1)[0];
    data.splice(idx - 1, 0, cat);
    this.setState({data: data});
  }

  moveCategoryDown(idx){
    var data = this.state.data;
    var cat = data.splice(idx, 1)[0];
    data.splice(idx + 1, 0, cat);
    this.setState({data: data});
  }

  renderData(){
    var ret = this.state.data.map((category, index) => 
      <Category cat={category} 
                onAddTxn={this.addTxn.bind(this)} 
                key={category.name} 
                idx={index}
                deleteMe={this.deleteCategory.bind(this)}
                onDeleteTxn={this.deleteTxn.bind(this)} 
                moveUp={this.moveCategoryUp.bind(this)}
                moveDown={this.moveCategoryDown.bind(this)}/>
      );


    this.categories = ret;
    return ret;
  }

  onDataLoaded(data){
    this.setState({data : data})
    // console.log(this.state.data);
    // this.updateDataValues();
  }


  sumData(){
    var sum = 0;
    for(var i = 0; i < this.state.data.length; i++){
      var category = this.state.data[i];
      var transactions = category.transactions;
      for(var j = 0; j < transactions.length; j++){
        sum += transactions[j].cost;
      }
    }
    return sum
  }

  parseCSV(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    var self = this;
    reader.onload = function(progressEvent){
      var text = this.result;
      var lines = text.split('\n');
      //Parse first line
      var header = lines[0];
      var headings = header.split(',');
      var data = [];
      this.categorySet = new Set();
      for (var headingNum = 0; headingNum < headings.length; headingNum += 2){
        var heading = headings[headingNum];
        var categoryObj = {
          name: heading,
          transactions: []
        };
        this.categorySet.add(categoryObj.name);
        data.push(categoryObj);
      }
      //Parse rest
      for (var lineNum = 1; lineNum < lines.length; lineNum++){
        var line = lines[lineNum];
        var elements = line.split(',');
        for(var elNum = 0; elNum < elements.length; elNum += 2){
          var d = elements[elNum];
          if(!d){
            continue;
          }
          var c = elements[elNum + 1];
          var transaction = {
            title: d,
            cost: parseFloat(c)
          }
          data[elNum/2].transactions.push(transaction);
        }
      }
      //call reload page data
      self.onDataLoaded(data);
    }
    reader.readAsText(file);
  }

  sendDataToServer(){
    var now = new Date();
    var filename = this.months[now.getMonth()] + now.getFullYear();
    axios.post('http://localhost:5000/model',{
      filename: filename,
      data: this.state.data
    }).then(function (response){
      console.log(response);
    });
  }

}

export default App;
