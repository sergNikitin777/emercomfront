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
	fio: 'Кира Кудряшова', 
	company: 3,
	position: 'Должность',
	selectedRemoveAllow: [],
}];	
const company = (prodSwitch === 1) ? { 0: '' } : {
	0: '',
	1: 'Компания 1',
	2: 'Компания 2',
	3: 'Компания 3',
	4: 'Компания 4',
	5: 'Компания 5',
};



const companyFormatter = (cell,row,formatExtraData,rowIdx) => formatExtraData[3];

const cellEditProp = {
  mode: 'click',
  blurToSave: true
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
		fio: '',
		company: 0,
		position: '',
		selectedRemoveAllow: [],
	}

	state = {
		data: data,
		showModalChange: false,
		modalForm: Object.assign({}, this.emptyModalForm),	
		addRow: -1,
		companies: []
	};
	
	componentWillMount(){	
	    if(prodSwitch === 1){
			const arr = [];
			getFetch(fetchAddr + '/employees', 
					 'GET')
			.then(data => {
				data.forEach( item => {
					arr.push({
						id: item.id,
						fio: item.fio,
						position: item.position,
						company: +item.company,
						selectedRemoveAllow: [],
					});
				} );
				console.log('ok employees');
				console.log(data);
			
				this.setState({data: arr});
			})
			
			getFetch(fetchAddr + '/companies', 
					 'GET')
			.then(data => {
				console.log('ok companies');
				console.log(data);		
				this.setState({companies: data});
				
				data.forEach( item => console.log(item) );
				data.forEach( item => company[item.id] = item.name );
				console.log(company);		
				
				
			})			
	    }
	} 	

	descValidation = {
		id: [{type: 'none', text: ''}],
	    fio: [{type: 'empty', text: 'Введите значение в поле "ФИО"'}],
	    company: [{type: 'select', text: 'Выберите значение из поля "Компания"'}],
	    position: [{type: 'empty', text: 'Введите значение в поле "Должность"'}],
		selectedRemoveAllow: [{type: 'array', text: 'Выберите значение(я) в поле "Необходимые допуски"'}],
	}
	//id: [{type: 'empty', text: 'Введите значение в поле "Номер"'}],
	//role: [{type: 'empty', text: 'Введите значение в поле "Роль"'}], 

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

		if(this.state.addRow !== -1){
			data[this.state.addRow] = row; 
		
			//edit position
			let obj = {
				        id: row.id,
						fio: ''+row.fio,
						position: ''+row.position,
						company: {
						  id: +row.company	
						}
			};
		
			getFetch(fetchAddr + '/employee/update', 
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
						fio: ''+row.fio,
						position: ''+row.position,
						company: {
						  id: +row.company	
						}
			};
	
			getFetch(fetchAddr + '/employee/add', 
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
	
	handleModalSeeOpen = (obj, cell, row, rowIndex) => this.setState({ modalForm: cell, showModalSee: true });   
	  
	handleModalSeeClose = () => this.setState({ showModalSee: false });
	  
	handleModalChangeOpen = (obj = {}, cell = {}, row = 0, rowIndex = 0) => {
		//this.setState({ modalForm: (cell) ? cell : {} });
		console.log(obj, cell, row, rowIndex);
		console.log('Object.keys(cell).length');
		console.log(Object.keys(cell).length);
		
		if(Object.keys(cell).length == 0){
			// add - only obj	
			console.log('emptyModalForm');
			console.log(this.emptyModalForm);
            this.setState({ modalForm: Object.assign({}, this.emptyModalForm), addRow: -1, showModalChange: true});
		}
		else{
			//edit - not obj, only cell and row
            let o = {				
				id: cell.id,
				fio: cell.fio,
				company: 0,
				position: cell.position,
				selectedRemoveAllow: [],				
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
			this.addRow(this.state.modalForm);
			this.setState({ showModalChange: false });
		} 
	} 	
	
	handlerDelete = (obj, cell, row, rowIndex) => { 
		getFetch(fetchAddr + '/employee/delete/' + cell.id, 
				 'GET'
		)
		.then(data => {
			console.log(data);
			let arr = this.state.data; 
			//delete arr[]
			this.setState({data: arr});
			//data[this.state.addRow] = row; 
		})
		.catch(error => console.error(error));
	}
	
	handleRemoveDeselectAllow = (deselectedRemoveAllow) => {
		const selectedRemoveAllow = this.state.modalForm.selectedRemoveAllow.slice();
		deselectedRemoveAllow.forEach(option => {
		    selectedRemoveAllow.splice(selectedRemoveAllow.indexOf(option), 1);
		})
		const obj = this.state.modalForm;
		      obj.selectedRemoveAllow = selectedRemoveAllow;
		this.setState({modalForm: obj});		
		//this.setState({selectedRemoveAllow});
	}
	  
	handleRemoveSelectAllow = (selectedRemoveAllow) => {
		selectedRemoveAllow.sort((a, b) => a.id - b.id);
		const obj = this.state.modalForm;
		      obj.selectedRemoveAllow = selectedRemoveAllow;
		this.setState({modalForm: obj});		
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
	/*{ props.deleteBtn }*/
 
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
		  btnGroup: this.createCustomButtonGroup
		}; 	
	
	/*
	  beforeSaveCell: onBeforeSaveCell,
	  onDeleteRow: onDeleteRow,
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
					<h4>Сотрудники</h4>
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
					  exportCSV>
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
						dataField='fio'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите ФИО'} } 
						dataSort>
						ФИО
					  </TableHeaderColumn>
	{/*					  
					  <TableHeaderColumn
						dataField='role'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите роль'} } 
						editable={ { type: 'text' } }
						dataSort>
						Роль
					  </TableHeaderColumn>	
					  
								  
	*/}					  
					  <TableHeaderColumn
						dataField='company'
						width="15%" 
						filter={ { type: 'SelectFilter', options: company, placeholder: 'Выберите компанию' } } 
						dataFormat={ companyFormatter } 
						formatExtraData={ company }
						dataSort>
						Компания
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='position' 
						filter={ { type: 'TextFilter', placeholder: 'Введите должность'} }
						width="15%"
						dataSort>
						Должность
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
					<Modal.Title>Добавление сотрудника</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
			  
					  <div className="form-group">
						<label>ФИО</label>
						<span className={this.state.modalForm.fio === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите ФИО</span>
						<input type="text" placeholder="ФИО" className={this.state.modalForm.fio === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.fio} onChange={(e) => this.handleModalFormChange(e, 'fio')} />
					  </div>
	{/*					  
					  <div className="form-group">
						<label>Роль</label>
						<span className={this.state.modalForm.role === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите роль</span>
						<input type="text" placeholder="Роль" className={this.state.modalForm.role === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.role} onChange={(e) => this.handleModalFormChange(e, 'role')} />
					  </div>	
					  	
	*/}
					  <div className="form-group">
						<label>Компания</label>
						<span className={this.state.modalForm.company === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите компанию</span>
						<select placeholder="Компания" className={this.state.modalForm.company === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.company} onChange={ (e) => this.handleModalFormChange(e, 'company') }>
						  <option value="0"></option>
						  {this.state.companies.map(item => <option value={item.id}>{item.name}</option>)}	
						</select>
					  </div>					  
		
					  <div className="form-group">
						<label>Должность</label>
						<span className={this.state.modalForm.position === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите должность</span>
						<input type="text" placeholder="Должность" className={this.state.modalForm.position === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.position} onChange={(e) => this.handleModalFormChange(e, 'position')} />
					  </div>
					  
					  <div className="form-group">
							  <div className="col-md-6 avNoSidePaddings avMarginBottom15">
							    <label>Необходимые допуски</label>
							    <span className={this.state.modalForm.selectedRemoveAllow.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>&nbsp;</span>
								<FilteredMultiSelect
								  placeholder="Введите допуск"
								  buttonText="<<"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveAllow.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveDeselectAllow}
								  options={this.state.modalForm.selectedRemoveAllow}
								  textProp="name"
								  valueProp="id"
								/>
							  </div>
							  <div className="col-md-6 avNoSidePaddings avMarginBottom15">
								<label>&nbsp;</label>
								<span className={this.state.modalForm.selectedRemoveAllow.length === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите допуск</span>
								<FilteredMultiSelect
								  placeholder="Введите допуск"
								  buttonText=">>"
								  classNames={{
									filter: 'form-control',
									select: (this.state.modalForm.selectedRemoveAllow.length === 0) ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid',
									button: 'btn',
									buttonActive: 'btn'
								  }}
								  onChange={this.handleRemoveSelectAllow}
								  options={CULTURE_SHIPS}
								  selectedOptions={this.state.modalForm.selectedRemoveAllow}
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
					<Modal.Title>Просмотр сотрудника</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>Сотрудник</h4>
			    <Tabs defaultActiveKey={1} id="tab-with-icons">
				  <Tab eventKey={1} title={<span>Детали</span>}>
				    <div className="card">
					<div className="content">
					{/*
					  <div className="typo-line">
						<p><span className="category">Адрес</span> {this.state.modalForm.address}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">Производитель</span> {this.state.modalForm.producer}</p>
					  </div>	
					  <div className="typo-line">
						<p><span className="category">Год выпуска</span> {this.state.modalForm.year}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">Виды <br />необходимых ТО</span> {this.state.modalForm.techType}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">ID ЭКТ</span> {this.state.modalForm.group}</p>
					  </div>
	*/}					  
					</div>		
                    </div>						
				  </Tab>
				  <Tab eventKey={2} title={<span>Проведённые работы</span>}>
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






