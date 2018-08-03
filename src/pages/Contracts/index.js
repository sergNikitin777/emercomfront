import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import { MaintenanceAPI } from '../../vendors/maintenance-web-api-1.0.0';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import { Type } from 'react-bootstrap-table2-editor';
import { Steps, Step } from '../../components/Multisteps';
import { FilteredMultiSelect } from '../../components/FilteredMultiSelect';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime, validation, getFetch } from '../../utility/functions';
import { cellEditProp } from '../../utility/settings';
import { required } from '../../utility/validations';
import { appellValidator, dateStartValidator, dateEndValidator, customerValidator } from '../../utility/validators';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../../assets/styles/customMultiSelect.css';



	import CULTURE_SHIPS from './Selections/ships.json';
	import FRUIT from './Selections/fruit.json';

const prodSwitch = 1;
const fetchAddr = (prodSwitch === 1) ? '/emercom/admin' : '/admin';
const data = (prodSwitch === 1) ? [] : [{
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

const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn avInline',
  buttonActive: 'btn',
}

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
// Main class. Contracts.
///////////////////////////////////////

class Contracts extends Component {
	
		//selectedRemoveTech: [],
		//selectedRemoveAllow: []	
	
  state = {
    data: data,
	rowsEquipment: [{
			name: 'СРУ БАО-600', 
			address: 'г. Пермь, ул. Ленина, 78',
			eto: 1,
			data: '2017/04/17',
			to1: 0,
			date1: '2018/05/19',
			to2: 1,
			date2: '2018/05/19',
		}], 
	showModalSee: false,
	showModalChange: false,
	selectedRemoveOptions: [],
    selectedNoFilterOptions: [],
	selectEquipment: [{id: 1, name: "1-1"},{id: 2, name: "1-2"}],
	modalForm: {
		name: '',
		desc: '',
		dateStart: '',
		dateEnd: '',
		summ: '',
		customer: '',
		permformer: '',
		selectedRemoveTech: [],
	},
	modalFormEmp: {
		selectedRemoveEmp: []
	},
	modalFormEquip: {
		selectedRemoveEquip: []
	},
	disabledNextButton: false,
	
  };
  

	componentWillMount(){	
	    if(prodSwitch === 1){
			getFetch(fetchAddr + '/contracts', 
					 'GET')
			.then(data => {
				console.log('ok');
				console.log(data);
		
				//this.setState({data: data});
			})
	    }
   
	}   
  
  removeItem = itemId => {
    this.setState({
      data: data.filter(item => item.id !== itemId)
    });
  }
  
  showNotification(position, text, field) {
    this.notificationSystem.addNotification({
      message: text,
      level: 'error',
      position
    });
  }  

  checkForm = () => {
	let obj = this.state.modalForm;
	let message, t = '', flag = true;
	for(let i in obj){
	  message = '';
	  this.descValidation[i].forEach( item => {
		t = validation(item.type, obj[i]);
		if(!t){
			flag = false;
			message = (message === '') ? item.text : message;
			return;
		}
	  })
	  if(message !== ''){
		 this.showNotification('tr', message); 
	  }
	
	}
	return flag;
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
  
    
/////////////////////////  
  handleSimpleTest = () => {
	  console.log(this.state);
  }
/////////////////////////  



	handleRemoveDeselectEmp = (deselectedRemoveEmp) => {
		const selectedRemoveEmp = this.state.modalFormEmp.selectedRemoveEmp.slice();
		deselectedRemoveEmp.forEach(option => {
		    selectedRemoveEmp.splice(selectedRemoveEmp.indexOf(option), 1);
		})
		const obj = this.state.modalFormEmp;
		      obj.selectedRemoveEmp = selectedRemoveEmp;
		this.setState({modalFormEmp: obj});
		this.checkFormSelected('modalFormEmp', 'selectedRemoveEmp');
	}
	  
	handleRemoveSelectEmp = (selectedRemoveEmp) => {
		selectedRemoveEmp.sort((a, b) => a.id - b.id);
		const obj = this.state.modalFormEmp;
		      obj.selectedRemoveEmp = selectedRemoveEmp;
		this.setState({modalFormEmp: obj});
		this.checkFormSelected('modalFormEmp', 'selectedRemoveEmp');
	}   
  
	handleRemoveDeselectEquip = (deselectedRemoveEquip) => {
		const selectedRemoveEquip = this.state.modalFormEquip.selectedRemoveEquip.slice();
		deselectedRemoveEquip.forEach(option => {
		    selectedRemoveEquip.splice(selectedRemoveEquip.indexOf(option), 1);
		})
		const obj = this.state.modalFormEquip;
		      obj.selectedRemoveEquip = selectedRemoveEquip;
		this.setState({modalFormEquip: obj});
		this.checkFormSelected('modalFormEquip', 'selectedRemoveEquip');
	}
	
	handleRemoveSelectEquip = (selectedRemove) => {
		selectedRemove.sort((a, b) => a.id - b.id);
		const obj = this.state.modalFormEquip;
		      obj.selectedRemoveEquip = selectedRemove;
		this.setState({modalFormEquip: obj});		
		this.checkFormSelected('modalFormEquip', 'selectedRemoveEquip');
	}  	

	handleRemoveDeselectTech = (deselectedRemoveTech) => {
		const selectedRemoveTech = this.state.modalForm.selectedRemoveTech.slice();
		deselectedRemoveTech.forEach(option => {
		    selectedRemoveTech.splice(selectedRemoveTech.indexOf(option), 1);
		})
		const obj = this.state.modalForm;
		      obj.selectedRemoveTech = selectedRemoveTech;
		this.setState({modalForm: obj});
		this.checkForm();
	}
	  
	handleRemoveSelectTech = (selectedRemoveTech) => {
		selectedRemoveTech.sort((a, b) => a.id - b.id);
		const obj = this.state.modalForm;
		      obj.selectedRemoveTech = selectedRemoveTech;
		this.setState({modalForm: obj});
		this.checkForm();
	}  	
  
	cellButton = (cell, row, enumObject, rowIndex) => {
		return <div>
			<i className="fa fa-eye fa-2x avActionI" onClick={() => this.handleModalSeeOpen(cell, row, rowIndex)} />
			<i className="fa fa-pencil fa-2x avActionI" onClick={() => this.handleModalChangeOpen(cell, row, rowIndex)} />
			<i className="fa fa-trash fa-2x avActionI" />	  
		</div>
	} 
  
    checkForm = () => {
	  let key;	  
	  let flag = true;
	  let obj = this.state.modalForm;	 
	  for (key in obj){
		  if(Array.isArray(obj[key])){
			  if(obj[key].length === 0){
				  flag = false;
				  break;
			  }
		  }
		  if(obj[key] === ''){
			  flag = false;
			  break;
		  }
	  }
	  this.setState({disabledNextButton: flag});	  
  }
  
  checkFormSelected = (form, name) => {
	  if(this.state[form][name].length === 0)
		  this.setState({disabledNextButton: false});	
	  else
		  this.setState({disabledNextButton: true});	
  }
    
  handleModalFormChange = (e, type) => {
	  let obj = this.state.modalForm;
		  obj[type] = e.target.value;
	  this.setState({'modalForm': obj});
      this.checkForm();
  }
  
  handleNextStep = () => {
	  this.setState({disabledNextButton: false});	
	  console.log('handleNextStep');
  }
  
  createCustomButtonGroup = props => {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
        { props.showSelectedOnlyBtn }
        { props.exportCSVBtn }
        <button type='button'
          className={ `btn btn-primary` } onClick={this.handleModalChangeOpen}>
          Добавить
        </button>
		        { props.deleteBtn }
      </ButtonGroup>
    );
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
	
	const nextButton = (<span onClick={this.handleNextStep}>след. шаг</span>);
	
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
	  beforeSaveCell: onBeforeSaveCell,
	  onDeleteRow: onDeleteRow,
	  onAddRow: this.onAddRow,
	  afterInsertRow: onAfterInsertRow,
	  onCellEdit: onCellEdit,
	  btnGroup: this.createCustomButtonGroup
    };  
	
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
    else{
	  const selectedRemoveOptions = this.state.selectedRemoveOptions;
	  const selectedNoFilterOptions = this.state.selectedNoFilterOptions;
	
      return (
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
					  <TableHeaderColumn width="100px" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
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
				  <Steps currentStep={1} prevButton="назад" nextButton={nextButton} mountOnlySiblings={true} disabledNextButton={this.state.disabledNextButton}>
				  
					<Step value="Детали">
					  <div className="form-group">
						<label>Название</label>
						<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите название</span>
						<input type="text" placeholder="Название" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
					  </div>
					  <div className="form-group">
						<label>Описание</label>
						<span className={this.state.modalForm.desc === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите описание</span>
						<textarea placeholder="Описание" className={this.state.modalForm.desc === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} onChange={(e) => this.handleModalFormChange(e, 'desc')} >{this.state.modalForm.desc}</textarea>
					  </div>		
					  <div className="form-group">
						<label>Заказчик</label>
						<span className={this.state.modalForm.customer === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите заказчика</span>
						<select placeholder="Заказчик" className={this.state.modalForm.customer === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.customer} onChange={ (e) => this.handleModalFormChange(e, 'customer') }>
						  <option value="0"></option>
						  <option value="1">Заказчик 1</option>
						  <option value="2">Заказчик 2</option>
						  <option value="3">Заказчик 3</option>
						  <option value="4">Заказчик 4</option>			  
						</select>
					  </div>
					  <div className="form-group">
						<label>Исполнитель</label>
						<span className={this.state.modalForm.permformer === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите исполнителя</span>
						<select placeholder="Исполнитель" className={this.state.modalForm.permformer === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.permformer} onChange={ (e) => this.handleModalFormChange(e, 'permformer') }>
						  <option value="0"></option>
						  <option value="1">Исполнитель 1</option>
						  <option value="2">Исполнитель 2</option>
						  <option value="3">Исполнитель 3</option>
						  <option value="4">Исполнитель 4</option>			  
						</select>
					  </div>		  
					  <div className="form-group">
						<label>Дата начала</label>
						<span className={this.state.modalForm.dateStart === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите дату начала</span>
						<input type="date" placeholder="Начало" className={this.state.modalForm.dateStart === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.dateStart} onChange={(e) => this.handleModalFormChange(e, 'dateStart')} />
					  </div>
					  <div className="form-group">
						<label>Дата завершения</label>
						<span className={this.state.modalForm.dateEnd === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите дату завершения</span>
						<input type="date" placeholder="Завершение" className={this.state.modalForm.dateEnd === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.dateEnd} onChange={(e) => this.handleModalFormChange(e, 'dateEnd')} />
					  </div>
					  <div className="form-group">
						<label>Сумма контракта</label>
						<span className={this.state.modalForm.summ === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите сумму</span>
						<input type="text" placeholder="Сумма контракта" className={this.state.modalForm.summ === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.summ} onChange={(e) => this.handleModalFormChange(e, 'summ')} />
					  </div>
					  <div className="form-group">
						<div className="col-md-6 avNoSidePaddings avMarginBottom15">
							    <label>Необходимое ТО</label>
								<span className={this.state.modalForm.selectedRemoveTech.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>&nbsp;</span>							
								<FilteredMultiSelect
								  placeholder="Введите ТО"
								  buttonText="<<"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveTech.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveDeselectTech}
								  options={this.state.modalForm.selectedRemoveTech}
								  textProp="name"
								  valueProp="id"
								/>

						</div>
						<div className="col-md-6 avNoSidePaddings avMarginBottom15">
								<label>&nbsp;</label>
								<span className={this.state.modalForm.selectedRemoveTech.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите ТО</span>
								<FilteredMultiSelect
								  placeholder="Введите ТО"
								  buttonText=">>"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveTech.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveSelectTech}
								  options={CULTURE_SHIPS}
								  selectedOptions={this.state.modalForm.selectedRemoveTech}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>					  
					  </div>
					  <div className="avClear"></div>					  
					</Step>
					
					<Step value="Сотрудники">
						<div className="row avPaddingBottom">
							  <div className="col-md-6"> 
							    <label>Сотрудники</label>
								<span className={this.state.modalFormEmp.selectedRemoveEmp.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>&nbsp;</span>							
								<FilteredMultiSelect
								  placeholder="Введите имя сотрудника"
								  buttonText="<<"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalFormEmp.selectedRemoveEmp.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveDeselectEmp}
								  options={this.state.modalFormEmp.selectedRemoveEmp}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>
							  <div className="col-md-6">
								<label>&nbsp;</label>
								<span className={this.state.modalFormEmp.selectedRemoveEmp.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите имя сотрудника</span>
								<FilteredMultiSelect
								  placeholder="Введите имя сотрудника"
								  buttonText=">>"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalFormEmp.selectedRemoveEmp.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveSelectEmp}
								  options={CULTURE_SHIPS}
								  selectedOptions={this.state.modalFormEmp.selectedRemoveEmp}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>
						</div>
					</Step>
					
					<Step value="Оборудование">
						<div className="row avPaddingBottom">
							  <div className="col-md-6">
							    <label>Вид оборудования</label>
								<span className={this.state.modalFormEquip.selectedRemoveEquip.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>&nbsp;</span>							
								<FilteredMultiSelect
								  placeholder="Введите название оборудования"
								  buttonText="<<"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalFormEquip.selectedRemoveEquip.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveDeselectEquip}
								  options={this.state.modalFormEquip.selectedRemoveEquip}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>
							  <div className="col-md-6">
								<label>&nbsp;</label>
								<span className={this.state.modalFormEquip.selectedRemoveEquip.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите оборудование</span>
								<FilteredMultiSelect
								  placeholder="Введите название оборудования"
								  buttonText=">>"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalFormEquip.selectedRemoveEquip.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveSelectEquip}
								  options={CULTURE_SHIPS}
								  selectedOptions={this.state.modalFormEquip.selectedRemoveEquip}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>	  
						</div>					
					</Step>
					
					<Step value="План проведения ТО">
						<div className="row avPaddingBottom avMarginSide">
							<BootstrapTable
							  data={this.state.rowsEquipment}
							  bordered={true}
							  striped
							  options={optionsEquipment} 
							  tableHeaderClass='custom-select-header-class' 
							  tableBodyClass='custom-select-body-class' 
							  cellEdit={ cellEditProp }>
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
					</Step>
					<Step value="Завершение">
					 <button onClick={this.handleSimpleTest}>test</button>
					  Поздравляем.
					</Step>
				  </Steps>
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleModalChangeClose}>Закрыть</Button>
			  </Modal.Footer>
			</Modal>		
			
			<NotificationSystem ref={ref => this.notificationSystem = ref} />	
			
		  </div>
      )
	}
  }
}
export default Contracts





