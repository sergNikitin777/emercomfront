import React, { Component } from 'react';
import { FilteredMultiSelect } from '../../../components/FilteredMultiSelect';

import FRUIT from './fruit.json'


const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn avInline',
  buttonActive: 'btn',
}

  //button: 'btn btn btn-block btn-default avInline',
  //buttonActive: 'btn btn btn-block btn-primary',


class NoFilterSelection extends React.Component {  
  state = {
    selectedOptions: [],
	selectEquipment: [{id: 1, name: "1-1"},{id: 2, name: "1-2"}]
  }
  handleDeselect(index) {
    var selectedOptions = this.state.selectedOptions.slice()
    selectedOptions.splice(index, 1)
    this.setState({selectedOptions})
  }
  handleClearSelection = (e) => {
    this.setState({selectedOptions: []})
  }
  handleSelectionChange = (selectedOptions) => {
    selectedOptions.sort((a, b) => a.id - b.id)
    this.setState({selectedOptions})
  }
  handleSelectEquipment = (e, b) => {
      //console.log(+e.target.value); 
	  const arr = [
	    [],
		[{id: 1, name: "1-1"},{id: 2, name: "1-2"}],
		[{id: 1, name: "2-1"},{id: 2, name: "2-2"}],
		[{id: 1, name: "3-1"},{id: 2, name: "3-2"}],
		[{id: 1, name: "4-1"},{id: 2, name: "4-2"}]
	  ];
	  this.setState({selectEquipment: arr[+e.target.value]}) 
  }
  
  render() {
    var {selectedOptions} = this.state
    return (<div>
	    <div className="form-group">
			<label>Вид оборудования</label>
			<select placeholder="Вид оборудования" className=" form-control editor edit-select" onChange={this.handleSelectEquipment.bind(this)}>  
			  <option value="1">СРУ 1</option>
			  <option value="2">СРУ 2</option>
			  <option value="3">СРУ 3</option>
			  <option value="4">СРУ 4</option>			  
			</select>
		</div>
		<div className="row avPaddingBottom">
		  <div className="col-md-5">
			<FilteredMultiSelect
			  classNames={BOOTSTRAP_CLASSES}
			  onChange={this.handleSelectionChange}
			  options={this.state.selectEquipment}
			  selectedOptions={selectedOptions}
			  textProp="name"
			  valueProp="id"
			  showFilter={false}
			/>
		  </div>
		  <div className="col-md-5">
			{selectedOptions.length === 0 && <p>(ещё ничего не выбрано)</p>}
			{selectedOptions.length > 0 && <ol>
			  {selectedOptions.map((fruit, i) => <li key={fruit.id}>
				{`${fruit.name} `}
				<span style={{cursor: 'pointer'}} onClick={() => this.handleDeselect(i)}>
				  &times;
				</span>
			  </li>)}
			</ol>}
			{selectedOptions.length > 0 && <button style={{marginLeft: 20}} className="btn btn-default" onClick={this.handleClearSelection}>
			  очистить список
			</button>}
		  </div>
		</div>
	  </div>
	)	
  }
}