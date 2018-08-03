import React, { Component } from 'react';
import { FilteredMultiSelect } from '../../../components/FilteredMultiSelect';

import CULTURE_SHIPS from './ships.json';


const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn avInline',
  buttonActive: 'btn',
}


class AddRemoveSelection extends React.Component {
  state = {
    selectedOptions: []
  }
  handleDeselect = (deselectedOptions) => {
    var selectedOptions = this.state.selectedOptions.slice()
    deselectedOptions.forEach(option => {
      selectedOptions.splice(selectedOptions.indexOf(option), 1)
    })
    this.setState({selectedOptions})
  }
  handleSelect = (selectedOptions) => {
    selectedOptions.sort((a, b) => a.id - b.id)
    this.setState({selectedOptions})
  }
  render() {
    var {selectedOptions} = this.state
    return <div className="row avPaddingBottom">
      <div className="col-md-6">
        <FilteredMultiSelect
          buttonText="<<"
          classNames={{
            filter: 'form-control',
            select: 'form-control',
            button: 'btn',
            buttonActive: 'btn'
          }}
          onChange={this.handleDeselect}
          options={selectedOptions}
          textProp="name"
          valueProp="id"
        />
      </div>
	  {/*
	  <div className="col-md-2">
		  <button type="button"
			className={this._getClassName('button', hasSelectedOptions && 'buttonActive')}
			disabled={!hasSelectedOptions}
			onClick={this._addSelectedToSelection}>
			{this.props.buttonText}
		  </button>
	  </div>	 
	  */}
      <div className="col-md-6">
        <FilteredMultiSelect
          buttonText=">>"
          classNames={BOOTSTRAP_CLASSES}
          onChange={this.handleSelect}
          options={CULTURE_SHIPS}
          selectedOptions={selectedOptions}
          textProp="name"
          valueProp="id"
        />
      </div>	  
    </div>
  }
}

export default AddRemoveSelection;
