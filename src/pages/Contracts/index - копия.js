import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { MaintenanceAPI } from '../../vendors/maintenance-web-api-1.0.0';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Type } from 'react-bootstrap-table2-editor';
import { Steps, Step } from '../../components/Multisteps';
import { FilteredMultiSelect } from '../../components/FilteredMultiSelect';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime } from '../../utility/functions';
import { cellEditProp } from '../../utility/settings';
import { appellValidator, dateStartValidator, dateEndValidator, customerValidator } from '../../utility/validators';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../../assets/styles/customMultiSelect.css';




import CULTURE_SHIPS from './Selections/ships.json'
import FRUIT from './Selections/fruit.json'


/*
const rows = [];
*/

const rows = [{
	id: 1,
	name: 'Кира Кудряшова', 
	status: 1,
	dateStart: '2017/04/17',
	dateEnd: '2018/05/19',
	customer: 'test'
}]; 






///////////////////////////////////////
// Settings and functions for Contracts
///////////////////////////////////////

const qualityType = {
  0: 'Выполняется',
  1: 'Завершён'
};	


const selectRowProp = {
  mode: 'checkbox',
  clickToSelect: true , 
  bgColor: (row, isSelect) => {
	  if(isSelect){
		  const { id } = row;
		  
          if (id < 2) return 'blue';
          else if (id < 4) return 'red';
          else return 'yellow';	
	  }
  }
};

const filterCustomer = cell => cell.name;

const activeFormatter = (cell, row) => (cell === '1') ? 'Есть' : 'Нет';
//const activeFormatter = (cell, row) => <ActiveFormatter active={ cell } />



const onBeforeSaveCell = (row, cellName, cellValue) => {
	debugger;
    console.log('ok');
    return true;
	
}  

const onCellEdit = (row, a, b) => {
	const changeRow = row;
	      changeRow[a] = b;
		  
		//changeRow.creationDate = formatDateToTime(row.dateStart);
		//changeRow.closeDate = formatDateToTime(row.dateEnd);
		changeRow.creationDate = '2018-07-16T05:01:05.737Z';
		changeRow.closeDate = '2018-07-17T05:01:05.737Z';
		changeRow.status = +row.status;
		changeRow.customer = 'noname';
		changeRow.id = +row.id;
		
		delete changeRow.dateEnd;
        delete changeRow.dateStart;
		
		console.log(changeRow);	
	
	axios.put('/emercom/admin/contract/update', changeRow)
	  .then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	}); 		  
		  
	return b;
}

const onAddRow = (row) => {
	debugger;
	console.log(row);
	
	return true;
}

const onDeleteRow = (rows) => {
	//обязательно изменить на массовое удаление! 
	if(rows.length > 1){
	  rows.forEach( (item) => {
		  axios.delete('/emercom/admin/contract/'+item, {id: item})
		  .then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
		  }); 
	  } );
	}
	else{
	  axios.delete('/emercom/admin/contract/'+rows[0], {id: rows[0]})
	  .then(function (response) {
		console.log(response);
	  })
	  .catch(function (error) {
		console.log(error);
	  }); 	
	}
	console.log(rows);
}

const onAfterInsertRow = (row) => {
	let copy = row;
		//copy.creationDate = formatDateToTime(row.dateStart);
		//copy.closeDate = formatDateToTime(row.dateEnd);
		copy.creationDate = '2018-07-16T05:01:05.737Z';
		copy.closeDate = '2018-07-17T05:01:05.737Z';
		copy.status = +row.status;
		copy.customer = 'noname';
		//copy.id = +row.id;
		
		delete copy.id;
		delete copy.dateEnd;
        delete copy.dateStart;
		
		console.log(copy);
		
	  axios.post('/emercom/admin/contract/add', copy)
	  .then(function (response) {
		console.log(response);
	  })
	  .catch(function (error) {
		console.log(error);
	  }); 
} 




///////////////////////////////////////
// Selections in modal window
///////////////////////////////////////

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
    const {selectedOptions} = this.state;
    return <div className="row avPaddingBottom">
      <div className="col-md-6">
	    <label>Сотрудники</label>
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
	    <label>&nbsp;</label>
        <FilteredMultiSelect
          buttonText=">>"
          classNames={{
            filter: 'form-control',
            select: 'form-control',
            button: 'btn',
            buttonActive: 'btn'
          }}
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
    const {selectedOptions} = this.state;
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
		  <div className="col-md-6">
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
		  <div className="col-md-6">
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


///////////////////////////////////////
// Maintenance table class
///////////////////////////////////////

class MaintenanceTable extends React.Component {
  render() {
	const rowsEquipment = [{
			id: 1,
			name: 'СРУ БАО-600', 
			address: 'г. Пермь, ул. Ленина, 78',
			eto: 1,
			data: '2017/04/17',
			to1: 0,
			date1: '2018/05/19',
			to2: 1,
			date2: '2018/05/19',
		}];		
		
	const optionsEquipment = {
		  sizePerPage: 60,
		  prePage: 'Назад',
		  nextPage: 'Вперёд',
		  firstPage: 'Первая',
		  lastPage: 'Последняя',
		  hideSizePerPage: false,
		  sizePerPageList: [ 60, 120 ],
		  insertText: 'Вставить',
		  deleteText: 'Удалить',
		  saveText: 'Сохранить',
		  closeText: 'Закрыть',
		  onCellEdit: onCellEdit,
		}; 		
		
  return (
					<div className="row avPaddingBottom avMarginSide">
						<BootstrapTable
						  data={rowsEquipment}
						  bordered={true}
						  striped
						  options={optionsEquipment} 
						  tableHeaderClass='custom-select-header-class' 
						  tableBodyClass='custom-select-body-class' 
						  cellEdit={ cellEditProp }>
						  <TableHeaderColumn
							dataField='id'
							width="30px"
							editable={ true }  
							isKey
							dataSort>
							ГК
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='name'
							editable={ { type: 'text', validator: appellValidator } }
							width="200px"
							dataSort>
							Оборудование
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='address'
							editable={ { type: 'text', validator: appellValidator } } 
							width="200px"
							dataSort>
							Адрес
						  </TableHeaderColumn>		
						  <TableHeaderColumn
							dataField='eto'
							editable={ { type: 'checkbox', options: { values: '1:0' } } } 
							dataFormat={ activeFormatter }
							width="35px"
							dataSort>
							ЕТО
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='data'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } }
							width="70px"
							dataSort>
							Дата
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='to1'
							editable={ { type: 'checkbox', options: { values: '1:0' } } } 
							dataFormat={ activeFormatter }
							width="35px"
							dataSort>
							ТО1
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='date1'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } }
							width="70px"
							dataSort>
							Дата
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='to2'
							editable={ { type: 'checkbox', options: { values: '1:0' } } } 
							dataFormat={ activeFormatter }
							width="35px"
							dataSort>
							ТО2
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='date2'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } } 
							width="70px"
							dataSort>
							Дата
						  </TableHeaderColumn>				  
						</BootstrapTable>		
					</div>
    );
  }
}


///////////////////////////////////////
// ActiveFormatter
///////////////////////////////////////

class ActiveFormatter extends React.Component {
  render() {
    return (
      <input type="checkbox" checked={ this.props.active }/>
    );
  }
}


///////////////////////////////////////
// Body of custom modal window
///////////////////////////////////////
class CustomModalBody extends Component {
	
    getFieldValue() {
	    return {
			id: 10,
			name: this.elFormName.value, 
			status: 1,
			dateStart: this.elFormName.value,
			dateEnd: this.elFormDateStart.value,
			customer: 'test'
	    }  
    }	
	
	render(){
		const rowsEquipment = [{
			id: 1,
			name: 'СРУ БАО-600', 
			address: 'г. Пермь, ул. Ленина, 78',
			eto: 1,
			data: '2017/04/17',
			to1: 0,
			date1: '2018/05/19',
			to2: 1,
			date2: '2018/05/19',
		}];		
		

		const nextButton = (<span>след. шаг</span>);
		const optionsEquipment = {
		  sizePerPage: 60,
		  prePage: 'Назад',
		  nextPage: 'Вперёд',
		  firstPage: 'Первая',
		  lastPage: 'Последняя',
		  hideSizePerPage: false,
		  sizePerPageList: [ 60, 120 ],
		  insertText: 'Вставить',
		  deleteText: 'Удалить',
		  saveText: 'Сохранить',
		  closeText: 'Закрыть',
		  onCellEdit: onCellEdit,
		}; 
	
		return(
		  <div className="modal-body">
			  <Steps currentStep={1} prevButton="назад" nextButton={nextButton} mountOnlySiblings={true}>
				<Step value="Детали">
			
				  <div className="form-group">
					<label>Название</label>
					<input type="text" placeholder="Название" className=" form-control editor edit-text" ref={el => this.elFormName = el} />
				  </div>
				  <div className="form-group">
					<label>Описание</label>
					<textarea placeholder="Описание" className=" form-control editor edit-text"></textarea>
				  </div>		
				  <div className="form-group">
					<label>Заказчик</label>
					<select placeholder="Заказчик" className=" form-control editor edit-select">
					  <option value="1">Заказчик 1</option>
					  <option value="2">Заказчик 2</option>
					  <option value="3">Заказчик 3</option>
					  <option value="4">Заказчик 4</option>			  
					</select>
				  </div>
				  <div className="form-group">
					<label>Исполнитель</label>
					<select placeholder="Исполнитель" className=" form-control editor edit-select">
					  <option value="1">Исполнитель 1</option>
					  <option value="2">Исполнитель 2</option>
					  <option value="3">Исполнитель 3</option>
					  <option value="4">Исполнитель 4</option>			  
					</select>
				  </div>		  
				  <div className="form-group">
					<label>Дата начала</label>
					<input type="date" placeholder="Начало" className=" form-control editor edit-date" ref={el => this.elFormDateStart = el} />
				  </div>
				  <div className="form-group">
					<label>Дата завершения</label>
					<input type="date" placeholder="Завершение" className=" form-control editor edit-date" ref={el => this.elFormDateEnd = el} />
				  </div>
				  <div className="form-group">
					<label>Сумма контракта</label>
					<input type="text" placeholder="Сумма контракта" className=" form-control editor edit-text" />
				  </div>

				</Step>
				<Step value="Сотрудники">
				  <AddRemoveSelection/>
				</Step>
				<Step value="Оборудование">
				  <NoFilterSelection/>
				</Step>
				<Step value="План проведения ТО">
					<div className="row avPaddingBottom avMarginSide">
						<BootstrapTable
						  data={rowsEquipment}
						  bordered={true}
						  striped
						  options={optionsEquipment} 
						  tableHeaderClass='custom-select-header-class' 
						  tableBodyClass='custom-select-body-class' 
						  cellEdit={ cellEditProp }>
						  <TableHeaderColumn
							dataField='id'
							width="70px"
							editable={ true }  
							isKey
							dataSort>
							ГК
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='name'
							editable={ { type: 'text', validator: appellValidator } }
							width="200px"
							dataSort>
							Оборудование
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='address'
							editable={ { type: 'text', validator: appellValidator } } 
							width="200px"
							dataSort>
							Адрес
						  </TableHeaderColumn>		
						  <TableHeaderColumn
							dataField='eto'
							dataFormat={ activeFormatter }
							width="30px"
							dataSort>
							ЕТО
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='data'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } }
							width="100px"
							dataSort>
							Дата
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='to1'
							dataFormat={ activeFormatter }
							width="30px"
							dataSort>
							ТО1
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='date1'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } }
							width="100px"
							dataSort>
							Дата
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='to2'
							dataFormat={ activeFormatter }
							width="30px"
							dataSort>
							ТО2
						  </TableHeaderColumn>
						  <TableHeaderColumn
							dataField='date2'
							dataFormat={ dateFormatter } 
							editable={ { type: 'date', validator: dateStartValidator  } } 
							width="100px"
							dataSort>
							Дата
						  </TableHeaderColumn>				  
						</BootstrapTable>		
					</div>
				</Step>
				<Step value="Завершение">
				  Поздравляем.
				</Step>
			  </Steps>
		  </div>
		)
	}
}


///////////////////////////////////////
// Main class. Contracts.
///////////////////////////////////////

class Contracts extends Component {
	
  state = {
    data: rows,
	showModalSee: false,
	showModalChange: false,
  };
  
  componentDidMount(){
	  /**/
	  let mObj;
	  let rData;
	  axios.get('/emercom/admin/contracts', {})
	  .then( (response) => {
			for (let i = 0; i < response.data.length; i++){
				rData = response.data[i];
				mObj = {};
				mObj.id = rData.id;
				mObj.name = rData.name;
				mObj.status = +rData.status;
				mObj.dateStart = formatDateFromServer(rData.creationDate);
				mObj.dateEnd = formatDateFromServer(rData.closeDate);
				//mObj.customer = rData.customer;
				mObj.customer = 'noname';
				rows.push(mObj);
				//copy = Object.assign({}, mObj);	
			}
			
			this.setState({
			  data: rows
			});			
	  })
	  .catch(function (error) {
		console.log(error);
	  }); 
  }
  
  removeItem = itemId => {
    this.setState({
      data: rows.filter(item => item.id !== itemId)
    });
  }
  
  handleSaveBtnClick = () => {
    const { columns, onSave } = this.props;
    const newRow = {};

    columns.forEach((column, i) => {
	  console.log(column.field + ' -> ' + this.refs[column.field].value);
      if(this.refs[column.field] !== undefined && this.refs[column.field].value !== undefined) {
        newRow[column.field] = this.refs[column.field].value;
      }
    }, this);
    
    onSave(newRow);
  }  
  
  
  //чекбоксы для выбора
  customMultiSelect = (props) => {
    const { type, checked, disabled, onChange, rowIndex } = props;

    if (rowIndex === 'Header') {
      return (
        <div className='checkbox-personalized'>
          <Checkbox {...props}/>
          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check' id="avCheckboxHeader"></div>
          </label>
        </div>);
    } else {
      return (
        <div className='checkbox-personalized'>
          <input
            type={ type }
            name={ 'checkbox' + rowIndex }
            id={ 'checkbox' + rowIndex }
            checked={ checked }
            disabled={ disabled }
            onChange={ e=> onChange(e, rowIndex) }
            ref={ input => {
              if (input) {
                input.indeterminate = props.indeterminate;
              }
            } }/>
          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check'></div>
          </label>
        </div>);
    }
  }  
  
  handleModalSeeOpen = (obj, cell, row, rowIndex) => this.setState({ showModalSee: true });    
  
  handleModalSeeClose = () => this.setState({ showModalSee: false });
  
  handleModalChangeOpen = (obj, cell, row, rowIndex) => this.setState({ showModalChange: true });    
  
  handleModalChangeClose = () => this.setState({ showModalChange: false });  

  createCustomModalHeader(onClose, onSave){
    const headerStyle = {
      fontWeight: 'bold',
      fontSize: 'large',
      textAlign: 'center',
      backgroundColor: '#eeeeee'
    };
    return (
      <div className='modal-header' style={ headerStyle }>
        <h3>Добавление контракта</h3>
      </div>
    );
  }
  
  createCustomModalFooter = (onClose, onSave) => {
    const footerStyle = {
      backgroundColor: '#ffffff'
    };
    return (
		  <div className="modal-footer" style={footerStyle}>
			<button type="button" className="btn btn-wd btn-danger" onClick={ onClose  }>
			  <span className="btn-label">
			    <i className="fa fa-times"></i>
			  </span> Отмена
		    </button>		
			<button type="button" className="btn btn-wd btn-success" onClick={ onSave }>
			  <span className="btn-label">
				<i className="fa fa-check"></i>
			  </span> Добавить
			</button>	
		  </div>
    );
  }  
  
  createCustomModalBody = (columns, validateState, ignoreEditable, onSave) => {
    return (
	  <CustomModalBody onSave={onSave} />
    )
  }
  
  cellButton = (cell, row, enumObject, rowIndex) => {
      return <div>
	    <input type="button" value="Изменить" onClick={() => this.handleModalChangeOpen(cell, row, rowIndex)} className="btn btn-xs btn-fill" />
	    <input type="button" value="Просмотр" onClick={() => this.handleModalSeeOpen(cell, row, rowIndex)} className="btn btn-xs btn-fill" /> 
	  </div>
  } 
 
  render() {
    const { data } = this.state;
	
    const {
      onModalClose,
      onSave,
      columns,
      validateState,
      ignoreEditable
    } = this.props;
	
	const nextButton = (<span>след. шаг</span>);
	
	// Чекбоксы для выбора
    const selectRowProp = {
      mode: 'checkbox',
      customComponent: this.customMultiSelect
    };	
	
    const options = {
      sizePerPage: 20,
      prePage: 'Назад',
      nextPage: 'Вперёд',
      firstPage: 'Первая',
      lastPage: 'Последняя',
      hideSizePerPage: false,
      sizePerPageList: [ 20, 40, 60 ],
	  exportCSVText: 'CSV',
	  insertText: 'Вставить',
	  deleteText: 'Удалить',
	  saveText: 'Сохранить',
	  closeText: 'Закрыть',
	  insertModalHeader: this.createCustomModalHeader, 
	  insertModalFooter: this.createCustomModalFooter,
	  beforeSaveCell: onBeforeSaveCell,
	  onDeleteRow: onDeleteRow,
	  onAddRow: this.onAddRow,
	  afterInsertRow: onAfterInsertRow,
	  onCellEdit: onCellEdit,
	  insertModalBody: this.createCustomModalBody
    };  

    if(this.state.data === undefined || this.state.data.length === 0) {
	    return(
		  <div className="container-fluid">
			<div className="row">
			  <div className="col-md-12">
				<div className="card">
				  <div className="header">
					<h4>Контракты</h4>
				  </div>
				  <div className="content">
					 Нет данных. 
				  </div>
				</div>
			  </div>
			</div>
		  </div>	  
		)
	}	
    else return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4>Контракты</h4>
              </div>
              <div className="content">
                <BootstrapTable
                  data={this.state.data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options} 
				  selectRow={ selectRowProp } 
				  tableHeaderClass='custom-select-header-class' 
				  tableBodyClass='custom-select-body-class' 
				  insertRow
                  deleteRow
				  cellEdit={ cellEditProp }
                  exportCSV>
                  <TableHeaderColumn
                    dataField='id'
                    width="70px"
					filter={ { type: 'TextFilter', placeholder: '№'} }
					editable={ true }  
					isKey
                    dataSort>
                    №
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='name'
                    width="14%"
                    filter={ { type: 'TextFilter', placeholder: 'Введите название'} } 
					editable={ { type: 'text', validator: appellValidator } }
                    dataSort>
                    Название
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='status'
                    width="14%" 
					filter={ { type: 'SelectFilter', options: qualityType, placeholder: 'Выберите статус' } } 
					dataFormat={ enumFormatter } 
					formatExtraData={ qualityType }
					editable={ { type: 'select', options: { values: [0, 1] } } }
                    dataSort>
                    Статус
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='dateStart'
                    width="14%" 
					filter={ { type: 'DateFilter', defaultValue: { date: new Date(1900, 1, 1), comparator: '>=' } } }
					dataFormat={ dateFormatter } 
					editable={ { type: 'date', validator: dateStartValidator  } }
                    dataSort>
                    Начало
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='dateEnd' 
					filter={ { type: 'DateFilter', defaultValue: { date: new Date(1900, 1, 1), comparator: '>=' } } }
					dataFormat={ dateFormatter } 
					editable={ { type: 'date', validator: dateEndValidator } }
                    width="14%"
					dataSort>
                    Завершение
                  </TableHeaderColumn>
				  {/* dataFormat={ filterCustomer }  */}
                  <TableHeaderColumn
                    dataField='customer' 
					filter={ { type: 'TextFilter', placeholder: 'Введите заказчика'} }
					editable={ { type: 'text', validator: customerValidator } }
                    width="20%"
					dataSort>
                    Заказчик
                  </TableHeaderColumn>
				  <TableHeaderColumn width="14%" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
                </BootstrapTable>
	
              </div>
            </div>
          </div>
        </div>
		
		
		
		<Modal show={this.state.showModalSee} onHide={this.handleModalSeeClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
		  <Modal.Header closeButton>
				<Modal.Title>Title</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
				
		  </Modal.Body>
		  <Modal.Footer>
			<Button onClick={this.handleModalSeeClose}>Закрыть</Button>
		  </Modal.Footer>
		</Modal>			

		
		
		<Modal show={this.state.showModalChange} onHide={this.handleModalChangeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
		  <Modal.Header closeButton>
				<Modal.Title>Изменение контракта</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
			  <Steps currentStep={1} prevButton="назад" nextButton={nextButton} mountOnlySiblings={true}>
				<Step value="Детали">
			
				  <div className="form-group">
					<label>Название</label>
					<input type="text" placeholder="Название" className=" form-control editor edit-text" ref={el => this.elFormName = el} />
				  </div>
				  <div className="form-group">
					<label>Описание</label>
					<textarea placeholder="Описание" className=" form-control editor edit-text"></textarea>
				  </div>		
				  <div className="form-group">
					<label>Заказчик</label>
					<select placeholder="Заказчик" className=" form-control editor edit-select">
					  <option value="1">Заказчик 1</option>
					  <option value="2">Заказчик 2</option>
					  <option value="3">Заказчик 3</option>
					  <option value="4">Заказчик 4</option>			  
					</select>
				  </div>
				  <div className="form-group">
					<label>Исполнитель</label>
					<select placeholder="Исполнитель" className=" form-control editor edit-select">
					  <option value="1">Исполнитель 1</option>
					  <option value="2">Исполнитель 2</option>
					  <option value="3">Исполнитель 3</option>
					  <option value="4">Исполнитель 4</option>			  
					</select>
				  </div>		  
				  <div className="form-group">
					<label>Дата начала</label>
					<input type="date" placeholder="Начало" className=" form-control editor edit-date" ref={el => this.elFormDateStart = el} />
				  </div>
				  <div className="form-group">
					<label>Дата завершения</label>
					<input type="date" placeholder="Завершение" className=" form-control editor edit-date" ref={el => this.elFormDateEnd = el} />
				  </div>
				  <div className="form-group">
					<label>Сумма контракта</label>
					<input type="text" placeholder="Сумма контракта" className=" form-control editor edit-text" />
				  </div>

				</Step>
				<Step value="Сотрудники">
				  <AddRemoveSelection/>
				</Step>
				<Step value="Оборудование">
				  <NoFilterSelection/>
				</Step>
				<Step value="План проведения ТО">
					<MaintenanceTable />
				</Step>
				<Step value="Завершение">
				  Поздравляем.
				</Step>
			  </Steps>
		  </Modal.Body>
		  <Modal.Footer>
			<Button onClick={this.handleModalChangeClose}>Закрыть</Button>
		  </Modal.Footer>
		</Modal>		
		
      </div>
    );
	
  }
}
export default Contracts






