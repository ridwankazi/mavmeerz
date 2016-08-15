/*
UploadApp App container (smart component) in charge of connecting React to the
store/state and transforming the state in a way that can be used by the
UploadAppButton component.
  -Renders UploadAppButton
*/
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import parse from 'csv-parse'
import Papa from '../../PapaParse-4.1.2'
// import Papa from 'babyparse'
import { uploadCSV, parsingCSV } from '../actions/expensesActions.js'
const Dropzone = require('react-dropzone');

export default class UploadApp extends Component {

  constructor(props){
    super(props)
    this.state = {account: null};
    console.log('=====> state in constructor of uploadApp', this.state);
    this.onDrop = this.onDrop.bind(this);
    this.addAccountToState = this.addAccountToState.bind(this);
  }

  addAccountToState(event) {
    this.setState({account: event.target.value});
  }

  onDrop(files){
    var that = this;
    files.forEach((file) => {
      that.props.parsingCSV()
       parseCSV(file)
       .then(function(result) {
         that.props.uploadCSV(that.state.account, result)
         console.log('file sent through onDrop', result);
       })
       .catch(function(error) {
         console.log(error);
       })

    });
  }

  render () {
    return (
      <div>
        <div>
          <input
            type="text"
            placeholder="Account Name"
            value={this.state.account}
            onChange={this.addAccountToState}
          />
        </div>
        <Dropzone className="dropzone" onDrop={this.onDrop}>
          <div> Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

UploadApp.PropTypes = {
  uploadCSV: PropTypes.func.isRequired
}

function parseCSV(file) {
  return new Promise(function(resolve, reject) {
    Papa.parse(file.preview, {
      header: true,
      download: true,
      complete: function(results) {
        console.log('results from complete', results);
        if (results.data.length !== 0) {
          //---------
          console.log('papa results', results.data)
          //----------
          resolve(results.data);
        } else {
          reject('nothing was parsed!');
        }
      }
    })
  });
}

export default connect(
  (state) => {
    console.log('UploadApp [state] is', state);
    const { expenses, isFetching } = state.expensesReducer
    console.log('mapStateToProps expenses are: ', expenses);
    return {
      expenses: expenses,
      isFetching: isFetching
    }
  },
  {
    uploadCSV: uploadCSV,
    parsingCSV: parsingCSV
  }
)(UploadApp)
