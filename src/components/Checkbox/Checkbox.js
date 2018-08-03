import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Checkbox extends React.Component {
  componentDidMount() { 
    this.update(this.props.checked); 
  }
  
  componentWillReceiveProps(props) { 
    this.update(props.checked); 
  }
  
  update(checked) {
    ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
  }
  render() {
    return (
      <input className='react-bs-select-all'
        type='checkbox'
        name={ 'checkbox' + this.props.rowIndex }
        id={ 'checkbox' + this.props.rowIndex }
        checked={ this.props.checked }
        onChange={ this.props.onChange } />
    );
  }
}

export default Checkbox
