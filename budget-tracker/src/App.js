import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FileInput from 'react-file-input';

class App extends Component {
  constructor(){
    super();
    this.data = [];
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1> Budget Tracker </h1>
          <form>
            <input id="upload" type="file" accept=".csv" onChange={this.parseCSV.bind(this)} />
            <label htmlFor="upload"> Choose Budget</label>

          </form>
        </div>
      </div>
    );
  }

  refreshData(data){
    this.data = data;
    console.log(this.data);
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
      for (var headingNum = 0; headingNum < headings.length; headingNum += 2){
        var heading = headings[headingNum];
        var categoryObj = {
          name: heading,
          transactions: []
        };
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
            cost: c
          }
          data[elNum/2].transactions.push(transaction);
        }
      }
      //call reload page data
      self.refreshData(data);
    }
    reader.readAsText(file);
  }

}

export default App;
