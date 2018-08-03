import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import SwitchControl from 'components/Switch';
import { Type } from 'react-bootstrap-table2-editor';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime, validation } from '../../utility/functions';
import { FilteredMultiSelect } from '../../components/FilteredMultiSelect';
import CULTURE_SHIPS from '../Contracts/Selections/ships.json';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
require('../../assets/styles/customMultiSelect.css');




const data = [{
	name: 'Кира Кудряшова', 
	role: 'Дежурный РСЧС',
	companyType: 0,
	post: 'Должность',
	selectedRemoveAllow: [],
}];



const cellEditProp = {
  mode: 'click',
  blurToSave: true
};  

const companyType = {
  0: '',
  1: 'Компания 1',
  2: 'Компания 2',
  3: 'Компания 3',
  4: 'Компания 4',
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




class Users extends Component {

	emptyModalForm = {
		name: '',
		role: '',
		companyType: 0,
		post: '',
		selectedRemoveAllow: [],
	}

	state = {
		data: data,
		showModalChange: false,
		showModalSee: false,
		showModalRights: false,
		modalForm: this.emptyModalForm,	
		addRow: -1,
		defaultSwitchRead: false,
		defaultSwitchWrite: false,
		defaultSwitchAdmin: false,	
	};
	
	descValidation = {
	    name: [{type: 'empty', text: 'Введите значение в поле "ФИО"'}],
	    role: [{type: 'empty', text: 'Введите значение в поле "Роль"'}], 
	    companyType: [{type: 'select', text: 'Выберите значение из поля "Компания"'}],
	    post: [{type: 'empty', text: 'Введите значение в поле "Должность"'}],
		selectedRemoveAllow: [{type: 'array', text: 'Выберите значение(я) в поле "Необходимые допуски"'}],
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
		if(this.state.addRow === -1){
		    data.push(row);
		}
		else{
		    data[this.state.addRow] = row;
		}				
		this.setState({data: data});		
	}
    
	handleModalSeeOpen = (obj, cell, row, rowIndex) => this.setState({ modalForm: cell, showModalSee: true });   
	  
	handleModalSeeClose = () => this.setState({ showModalSee: false });
	
	handleModalRightsOpen = (obj, cell, row, rowIndex) => this.setState({ modalForm: cell, showModalRights: true });   
	  
	handleModalRightsClose = () => this.setState({ showModalRights: false });	
	  
	handleModalChangeOpen = (obj, cell, row, rowIndex) => {
		//this.setState({ modalForm: (cell) ? cell : {} });
		if(!!cell){
			this.setState({ modalForm: cell, addRow: row, showModalChange: true});
		}
		else{
			this.setState({ modalForm: Object.assign({}, this.emptyModalForm), addRow: -1, showModalChange: true});
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
		    <i className="fa fa-user-circle fa-2x avActionI" onClick={() => this.handleModalRightsOpen(cell, row, rowIndex)} />
			<i className="fa fa-eye fa-2x avActionI" onClick={() => this.handleModalSeeOpen(cell, row, rowIndex)} />
			<i className="fa fa-pencil fa-2x avActionI" onClick={() => this.handleModalChangeOpen(cell, row, rowIndex)} />
			<i className="fa fa-trash fa-2x avActionI" />	  
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
					{ props.deleteBtn }
		  </ButtonGroup>
		);
	}    
	
	handlerTestCheck = (e) => console.log('check!', e);
 
	render() {
		const { data } = this.state;
		
		let {
			defaultSwitchRead,
			defaultSwitchWrite,
			defaultSwitchAdmin,
		} = this.state;		
			
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
					  cellEdit={ cellEditProp }
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
						dataField='name'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите ФИО'} } 
						editable={ { type: 'text' } }
						dataSort>
						ФИО
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='role'
						width="15%"
						filter={ { type: 'TextFilter', placeholder: 'Введите роль'} } 
						editable={ { type: 'text' } }
						dataSort>
						Роль
					  </TableHeaderColumn>				  
					  <TableHeaderColumn
						dataField='companyType'
						width="15%" 
						filter={ { type: 'SelectFilter', options: companyType, placeholder: 'Выберите компанию' } } 
						dataFormat={ enumFormatter } 
						formatExtraData={ companyType }
						editable={ { type: 'select', options: { values: [0, 1, 2, 3, 4] } } }
						dataSort>
						Компания
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='post' 
						filter={ { type: 'TextFilter', placeholder: 'Введите компанию'} }
						editable={ { type: 'text' } }
						width="15%"
						dataSort>
						Должность
					  </TableHeaderColumn>
					  <TableHeaderColumn width="120px" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
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
						<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите ФИО</span>
						<input type="text" placeholder="ФИО" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
					  </div>
					  
					  <div className="form-group">
						<label>Роль</label>
						<span className={this.state.modalForm.role === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите роль</span>
						<input type="text" placeholder="Роль" className={this.state.modalForm.role === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.role} onChange={(e) => this.handleModalFormChange(e, 'role')} />
					  </div>	

					  <div className="form-group">
						<label>Компания</label>
						<span className={this.state.modalForm.companyType === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите компанию</span>
						<select placeholder="Компания" className={this.state.modalForm.companyType === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.companyType} onChange={ (e) => this.handleModalFormChange(e, 'companyType') }>
						  <option value="0"></option>
						  <option value="1">Компания 1</option>
						  <option value="2">Компания 2</option>
						  <option value="3">Компания 3</option>
						  <option value="4">Компания 4</option>			  
						</select>
					  </div>					  
		
					  <div className="form-group">
						<label>Должность</label>
						<span className={this.state.modalForm.post === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите должность</span>
						<input type="text" placeholder="Должность" className={this.state.modalForm.post === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.post} onChange={(e) => this.handleModalFormChange(e, 'post')} />
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

			<Modal show={this.state.showModalRights} onHide={this.handleModalRightsClose} bsSize="small" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
					<Modal.Title>Изменение прав пользователя</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
			    <div className="avRightsDiv">
				  <div className="avFullWidth">
					  <div className="avSwitch avFloatLeft">
						<SwitchControl
						  value={defaultSwitchRead}
						  onChange={value => this.setState({defaultSwitchRead: value})} />
					  </div>
					  <p className="avFloatLeft avPaddingLeft20">Чтение</p>
				  </div>
				  <div className="avClear" />
				  
	              <div className="avFullWidth">
					  <div className="avSwitch avFloatLeft">
						<SwitchControl
						  value={defaultSwitchWrite}
						  onChange={value => this.setState({defaultSwitchWrite: value})} />
					  </div>
					  <p className="avFloatLeft avPaddingLeft20">Запись</p>
				  </div>	
				  <div className="avClear" />
				  
	              <div className="avFullWidth">
					  <div className="avSwitch avFloatLeft">
						<SwitchControl
						  value={defaultSwitchAdmin}
						  onChange={value => this.setState({defaultSwitchAdmin: value})} />
					  </div>
					  <p className="avFloatLeft avPaddingLeft20">Администрирование</p>
				  </div>
	            </div>	
				
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleModalRightsClose}>Закрыть</Button>
			  </Modal.Footer>
			</Modal>			

			<NotificationSystem ref={ref => this.notificationSystem = ref} />			
			
		  </div>

		);
	}
}
export default Users






