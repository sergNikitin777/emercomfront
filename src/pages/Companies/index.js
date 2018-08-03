import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import { Type } from 'react-bootstrap-table2-editor';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime, validation, getFetch } from '../../utility/functions';
import { FilteredMultiSelect } from '../../components/FilteredMultiSelect';
import CULTURE_SHIPS from '../Contracts/Selections/ships.json';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
require('../../assets/styles/customMultiSelect.css');


const prodSwitch = 1;

const fetchAddr = (prodSwitch === 1) ? '/emercom/admin' : '/admin';
const data = (prodSwitch === 1) ? [] : [{
		id: 1,
		name: 'Компания 1', 
		address: 'ул Пушкина, 58',
		director: '', 
		phone: '',
		email: '',
		selectedRemoveEmp: [],
	}];	





const cellEditProp = {
  mode: 'click',
  blurToSave: true
};  

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








class Companies extends Component {
	
	emptyModalForm = {
		id: '',
		name: '',
		address: '',
		director: '',
		phone: '',
		email: '',
		selectedRemoveEmp: []
	}
	
	state = {
		data: data,
		showModalChange: false,
		modalForm: Object.assign({}, this.emptyModalForm),	
		addRow: -1
	};
	
	componentWillMount(){	
	    if(prodSwitch === 1){
			getFetch(fetchAddr + '/companies', 
					 'GET')
			.then(data => {
				console.log('ok companies');
				console.log(data);
				/*
				let copy = Object.assign({}, this.state.data);
				copy.forEach( item => {
					item.id = 
				} );
				copy
				*/		
				this.setState({data: data});
			})
	    }
   
	} 

	descValidation = {
		id: [{type: 'none', text: ''}],
		name: [{type: 'empty', text: 'Введите значение в поле "Название"'}],
		address: [{type: 'empty', text: 'Введите значение в поле "Адрес"'}],
		director: [{type: 'empty', text: 'Введите значение в поле "Директор"'}], 
		phone: [{type: 'empty', text: 'Введите значение в поле "Телефон"'}],
		email: [{type: 'empty', text: 'Введите значение в поле "E-mail"'}],
		selectedRemoveEmp: [{type: 'array', text: 'Выберите значение(я) в поле "Сотрудники"'}],
	}
	//id: [{type: 'empty', text: 'Введите значение в поле "Номер"'}],

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
  
    /*
	handleSaveBtnClick = () => {
		const { columns, onSave } = this.props;
		const newRow = {};

		columns.forEach((column, i) => {
		  if(this.refs[column.field] !== undefined && this.refs[column.field].value !== undefined) {
			  newRow[column.field] = this.refs[column.field].value;
		  }
		}, this);
		
		onSave(newRow);
	}  
	*/
  
	handleModalFormChange = (e, type) => {
		let obj = this.state.modalForm;
			obj[type] = e.target.value;
		this.setState({'modalForm': obj});
	} 

	checkForm = () => {
		let obj = this.state.modalForm;
		let message, t = '', flag = true;
		for(let i in obj){
			message = '';
			this.descValidation[i].forEach( item => {
				if(item.type === 'none')  
					return;
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
  
	addRow = (row) => {
		const data = this.state.data;
		console.log(row);
		console.log('addRow function');
		console.log(this.state);
		if(this.state.addRow !== -1){
			data[this.state.addRow] = row; 
		
			//edit position
			let obj = {
				        id: row.id,
						name: ''+row.name,
						address: ''+row.address,
						director: ''+row.director,
						phone: ''+row.phone,
						email: ''+row.email					
			};
			//,phone: ''+row.phone
			console.log('data update obj is ');
			console.log(obj);
				
			getFetch(fetchAddr + '/company/update', 
					 'PUT',
					 obj
			)
		   .then(data => {
				console.log(data);
				data[this.state.addRow] = row; 
		   })
		   .catch(error => console.error(error));
		}
		else{
			// new position	
			let obj = {
						name: ''+row.name,
						address: ''+row.address,
						director: ''+row.director,
						phone: ''+row.phone,
						email: ''+row.email						
			};
			console.log('data add obj is ');
			console.log(obj);
			getFetch(fetchAddr + '/company/add', 
					 'POST',
					 obj
			)
		   .then(data => {
				console.log(data);
				data.push(row);	   
		   })
		   .catch(error => console.error(error));			
		   
			data.push(row);	 
		}
						
		this.setState({data: data});		
	}
    
	handleModalSeeOpen = (obj, cell, row, rowIndex) => this.setState({ showModalSee: true });    
	  
	handleModalSeeClose = () => this.setState({ showModalSee: false });
	  
	handleModalChangeOpen = (obj = {}, cell = {}, row = 0, rowIndex = 0) => {
		//this.setState({ modalForm: (cell) ? cell : {} });
		
		if(Object.keys(cell).length == 0){
			// add - only obj	
            this.setState({ modalForm: Object.assign({}, this.emptyModalForm), addRow: -1, showModalChange: true});
		}
		else{
			//edit - not obj, only cell and row
            let o = {
				id: cell.id,
				name: cell.name,
				address: cell.address,
				director: cell.director,
				phone: cell.phone,
				email: cell.email,
				selectedRemoveEmp: [],
			}		
					
			this.setState({ modalForm: o, addRow: row, showModalChange: true});
		}    
	}
  
	handleModalChangeClose = () => {
		this.notificationSystem.clearNotifications();
		this.setState({ showModalChange: false });  
	}
	 
	handleModalChangeSave = () => {
		this.notificationSystem.clearNotifications();
		if(this.checkForm()){
			debugger;
			this.addRow(this.state.modalForm);
			this.setState({ showModalChange: false });
		} 
	}  
	
	/*
	handlerDelete = (obj, cell, row, rowIndex) => { 
	    console.log(obj, cell, row, rowIndex);
		console.log(+cell.id);
		getFetch(fetchAddr + '/company/' + cell.id, 
				 'DELETE'
		)
		.then(data => {
			console.log(data);
			//data[this.state.addRow] = row; 
		})
		.catch(error => console.error(error));
	}
	*/
	
	handlerDelete = (obj, cell, row) => { 
		getFetch(fetchAddr + '/company/delete/' + cell.id, 
				 'DELETE'
		)
		.then(data => {
			console.log(row);
			let arr = this.state.data; 
			console.log(arr);
			delete arr[row];
			console.log(arr);
			//this.setState({data: arr});
			this.handleResetTable();
		})
		.catch(error => console.error(error));
	}	
	
	handleRemoveDeselectEmp = (deselectedRemoveEmp) => {
		const selectedRemoveEmp = this.state.modalForm.selectedRemoveEmp.slice();
		deselectedRemoveEmp.forEach(option => {
		    selectedRemoveEmp.splice(selectedRemoveEmp.indexOf(option), 1);
		})
		const obj = this.state.modalForm;
		      obj.selectedRemoveEmp = selectedRemoveEmp;
		this.setState({modalForm: obj});		
		//this.setState({selectedRemoveEmp});
	}
	  
	handleRemoveSelectEmp = (selectedRemoveEmp) => {
		selectedRemoveEmp.sort((a, b) => a.id - b.id);
		const obj = this.state.modalForm;
		      obj.selectedRemoveEmp = selectedRemoveEmp;
		this.setState({modalForm: obj});		
	}  
	
	handleResetTable = () => {
		console.log('this.refs.maintable');
		console.log(this.refs.maintable);
		this.refs.maintable.reset();
	}
  
	customMultiSelect(props) {
		const { type, checked, disabled, onChange, rowIndex } = props;

		if (rowIndex === 'Header') {
			return (
				<div className='checkbox-personalized'>
				  <Checkbox {...props}/>
				  <label htmlFor={ 'checkbox' + rowIndex }>
					<div className='check' id="avCheckboxHeader"></div>
				  </label>
				</div>);
		} 
		else {
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
					  if(input){
						  input.indeterminate = props.indeterminate;
					  }
					} }/>
				  <label htmlFor={ 'checkbox' + rowIndex }>
					<div className='check'></div>
				  </label>
				</div>);
		}
	}  
  
	cellButton = (cell, row, enumObject, rowIndex) => {
		return <div>
			<i className="fa fa-eye fa-2x avActionI" onClick={() => this.handleModalSeeOpen(cell, row, rowIndex)} />
			<i className="fa fa-pencil fa-2x avActionI" onClick={() => this.handleModalChangeOpen(cell, row, rowIndex)} />
			<i className="fa fa-trash fa-2x avActionI" onClick={() => this.handlerDelete(cell, row, rowIndex)} />	  
		</div>
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
		  btnGroup: this.createCustomButtonGroup,
		}; 	
	
	/*
	  beforeSaveCell: onBeforeSaveCell,
	  
	  onAddRow: this.onAddRow,
	  afterInsertRow: onAfterInsertRow,
	  onCellEdit: onCellEdit,	
	*/

		return (
		  <div className="container-fluid">
			<div className="row">
			  <div className="col-md-12">
				<div className="card">
				  <div className="header">
					<h4>Компании</h4>
				  </div>
				  <div className="content">
					<BootstrapTable
					  data={data}
					  bordered={false}
					  striped
					  pagination={true}
					  options={options} 
					  selectRow={ selectRowProp } 
					  tableHeaderClass='custom-select-header-class' 
					  tableBodyClass='custom-select-body-class' 
					  insertRow
					  deleteRow
					  exportCSV
					  ref="maintable">
					  <TableHeaderColumn
						dataField='id'
						isKey
						hidden
						width="1px"
						filter={ { type: 'TextFilter', placeholder: '№'} }
						dataSort>
						№
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='name'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите название'} }
						dataSort>
						Название
					  </TableHeaderColumn>
					  <TableHeaderColumn
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите число'} } 
						dataSort>
						Кол-во сотрудников
					  </TableHeaderColumn>
					  <TableHeaderColumn
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите число'} } 
						dataSort>
						Кол-во контрактов
					  </TableHeaderColumn>					  
	{/*					  
					  <TableHeaderColumn
						dataField='address'
						width="12%"
						filter={ { type: 'TextFilter', placeholder: 'Введите адрес'} } 
						editable={ { type: 'text' } }
						dataSort>
						Адрес
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='director'
						width="12%"
						filter={ { type: 'TextFilter', placeholder: 'Введите имя'} } 
						editable={ { type: 'text' } }
						dataSort>
						Директор
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='phone'
						width="12%"
						filter={ { type: 'TextFilter', placeholder: 'Введите номер'} } 
						editable={ { type: 'text' } }
						dataSort>
						Телефон
					  </TableHeaderColumn>
	*/}
					  <TableHeaderColumn
						dataField='email'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите e-mail'} }
						dataSort>
						E-mail
					  </TableHeaderColumn>					  
					  <TableHeaderColumn width="100px" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
					</BootstrapTable>
		
				  </div>
				</div>
			  </div>
			</div>
			
			{/*
						  <div className="form-group">
							<label>Номер</label>
							<span className={this.state.modalForm.id === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите номер</span>
							<input type="text" placeholder="Номер" className={this.state.modalForm.id === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.id} onChange={(e) => this.handleModalFormChange(e, 'id')} />
						  </div>				
			*/}			
			
				<Modal show={this.state.showModalChange} onHide={this.handleModalChangeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
				  <Modal.Header closeButton>
						<Modal.Title>Добавление компании</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>
				  
						  <div className="form-group">
							<label>Название</label>
							<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите название</span>
							<input type="text" placeholder="Название" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
						  </div>
						  
						  <div className="form-group">
							<label>Адрес</label>
							<span className={this.state.modalForm.address === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите адрес</span>
							<input type="text" placeholder="Адрес" className={this.state.modalForm.address === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.address} onChange={(e) => this.handleModalFormChange(e, 'address')} />
						  </div>	
					  
						  <div className="form-group">
							<label>Директор</label>
							<span className={this.state.modalForm.director === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите имя директора</span>
							<input type="text" placeholder="Директор" className={this.state.modalForm.director === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.director} onChange={(e) => this.handleModalFormChange(e, 'director')} />
						  </div>			  
			
						  <div className="form-group">
							<label>Телефон</label>
							<span className={this.state.modalForm.phone === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите номер телефона</span>
							<input type="text" placeholder="Телефон" className={this.state.modalForm.phone === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.phone} onChange={(e) => this.handleModalFormChange(e, 'phone')} />
						  </div>
				  
						  <div className="form-group">
							<label>E-mail</label>
							<span className={this.state.modalForm.email === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите e-mail</span>
							<input type="text" placeholder="E-mail" className={this.state.modalForm.email === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.email} onChange={(e) => this.handleModalFormChange(e, 'email')} />
						  </div>			

					  <div className="form-group">
							  <div className="col-md-6 avNoSidePaddings avMarginBottom15">
							    <label>Сотрудники</label>
							    <span className={this.state.modalForm.selectedRemoveEmp.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>&nbsp;</span>
								<FilteredMultiSelect
								  placeholder="Введите имя"
								  buttonText="<<"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveEmp.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveDeselectEmp}
								  options={this.state.modalForm.selectedRemoveEmp}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>
							  <div className="col-md-6 avNoSidePaddings avMarginBottom15">
								<label>&nbsp;</label>
								<span className={this.state.modalForm.selectedRemoveEmp.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите сотрудников</span>
								<FilteredMultiSelect
								  placeholder="Введите имя"
								  buttonText=">>"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveEmp.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveSelectEmp}
								  options={CULTURE_SHIPS}
								  selectedOptions={this.state.modalForm.selectedRemoveEmp}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>					  
					  </div>		
					  
					  <div className="avClear"></div>						  

				  </Modal.Body>
				  <Modal.Footer>
					<Button onClick={this.handleModalChangeClose}>Отмена</Button>
					<Button onClick={this.handleModalChangeSave}>Сохранить</Button>
				  </Modal.Footer>
				</Modal>	
				
				
			<Modal show={this.state.showModalSee} onHide={this.handleModalSeeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
					<Modal.Title>Просмотр компании { (this.state.modalForm.name) ? ': '+ this.state.modalForm.name : ''}</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>Компания</h4>
			    <Tabs defaultActiveKey={1} id="tab-with-icons">
				  <Tab eventKey={1} title={<span>Детали</span>}>
				    <div className="card">
					<div className="content">				
		
					  <div className="typo-line2">
						<p> <span className="avLineLeft">Адрес</span> <span className="avLineRight">{ (this.state.modalForm.address) ? this.state.modalForm.address : ''}</span> </p>
					  </div>
					  <div className="typo-line2">
						<p> <span className="avLineLeft">Управляющий директор</span> <span className="avLineRight">{ (this.state.modalForm.director) ? this.state.modalForm.director : ''}</span></p>
					  </div>	
					  <div className="typo-line2">
						<p> <span className="avLineLeft">Контактный телефон</span> <span className="avLineRight">{ (this.state.modalForm.phone) ? this.state.modalForm.phone : ''}</span></p>
					  </div>
					  <div className="typo-line2">
						<p> <span className="avLineLeft">E-mail</span> <span className="avLineRight">{ (this.state.modalForm.email) ? this.state.modalForm.email : ''}</span></p>
					  </div>				  
					</div>		
                    </div>						
				  </Tab>
				  <Tab eventKey={2} title={<span>Сотрудники</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  
						</div>
					  </div>				  
				  </Tab>
				  <Tab eventKey={3} title={<span>Контракты</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  
						</div>
					  </div>
				  </Tab>
			    </Tabs>
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleModalSeeClose}>Закрыть</Button>
			  </Modal.Footer>
			</Modal>				

				<NotificationSystem ref={ref => this.notificationSystem = ref} />			
			
		  </div>

		);
	}
}
export default Companies






