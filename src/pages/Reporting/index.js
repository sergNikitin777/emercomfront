import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import { Type } from 'react-bootstrap-table2-editor';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime, validation } from '../../utility/functions';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
require('../../assets/styles/customMultiSelect.css');



const data = [{
	id: 1,
	name: 'Отчёт 1', 
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
		name: ''
	}

	state = {
		data: data,
		showModalChange: false,
		modalForm: Object.assign({}, this.emptyModalForm),	
		addRow: -1	
	};

	descValidation = {
		id: [{type: 'empty', text: 'Введите значение в поле "Номер"'}],
		name: [{type: 'empty', text: 'Введите значение в поле "Название"'}]
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
    
	handleModalSeeOpen = (obj, cell, row, rowIndex) => this.setState({ showModalSee: true });    
	  
	handleModalSeeClose = () => this.setState({ showModalSee: false });
	  
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
					<h4>Отчётность</h4>
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
						width="70%"
						filter={ { type: 'TextFilter', placeholder: 'Введите название'} } 
						editable={ { type: 'text' } }
						dataSort>
						Отчёты
					  </TableHeaderColumn>
					  <TableHeaderColumn width="100px" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
					</BootstrapTable>
		
				  </div>
				</div>
			  </div>
			</div>
			
			<Modal show={this.state.showModalChange} onHide={this.handleModalChangeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
				  <Modal.Title>Добавление отчёта</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				  <div className="form-group">
					<label>Номер</label>
					<span className={this.state.modalForm.id === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите номер</span>
					<input type="text" placeholder="Номер" className={this.state.modalForm.id === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.id} onChange={(e) => this.handleModalFormChange(e, 'id')} />
				  </div>
				  <div className="form-group">
					<label>Название</label>
					<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите название</span>
					<input type="text" placeholder="Название" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
				 </div>
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleModalChangeClose}>Отмена</Button>
				<Button onClick={this.handleModalChangeSave}>Сохранить</Button>
			  </Modal.Footer>
			</Modal>	
			
			
			<Modal show={this.state.showModalSee} onHide={this.handleModalSeeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
					<Modal.Title>Просмотр отчёта</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>Отчёт</h4>
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
				  {/*
				  <Tab eventKey={2} title={<span>Участники</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  
						</div>
					  </div>				  
				  </Tab>
				  <Tab eventKey={3} title={<span>История задачи</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  
						</div>
					  </div>
				  </Tab>
				  */}
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






