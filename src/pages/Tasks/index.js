import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import { Type } from 'react-bootstrap-table2-editor';
import { Checkbox } from '../../components/Checkbox';
import { enumFormatter, dateFormatter, addZero, formatDateFromServer, formatDateToTime, validation, getFetch } from '../../utility/functions';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
require('../../assets/styles/customMultiSelect.css');



const prodSwitch = 1;

const fetchAddr = (prodSwitch === 1) ? '/emercom/admin' : '/admin';
const data = (prodSwitch === 1) ? [] : [{
		name: '', 
		description: 'ТО-1', 
		statusType: 2,
		begindate: '2017-04-17',
		enddate: '2018-05-19',
		equipment: 'СРУ БАО-600',
		customType: 'Иванов И.И.',
		performType: 'Сидоров А.А.',
		list: []
}];	


const statusType = {
  1: 'Провалено',
  2: 'В работе',
  3: 'Завершено',
};

const equipmentType = {
  1: 'Оборудование 1',
  2: 'Оборудование 2',
  3: 'Оборудование 3',
};

const performType = {
  1: 'Исполнитель 1',
  2: 'Исполнитель 2',
  3: 'Исполнитель 3',
};

const customType = {
  1: 'Заказчик 1',
  2: 'Заказчик 2',
  3: 'Заказчик 3',
};

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




/*
* todo list begin
*/
const todoItems = [];
//todoItems.push({index: 1, value: "learn react", done: false});
//todoItems.push({index: 2, value: "Go shopping", done: true});
//todoItems.push({index: 3, value: "buy flowers", done: true});

class TodoList extends React.Component {
  render () {
    const items = this.props.items.map((item, index) => {
      return (
        <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} />
      );
    });
    return (
      <ul className="list-group avUl"> {items} </ul>
    );
  }
}
  
class TodoListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }
  onClickClose() {
    const index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  onClickDone() {
    const index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  render () {
    const todoClass = this.props.item.done ? 'done' : 'undone';
    return(
      <li className="avList-group-item">
        <div className={todoClass}>
          <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
          {this.props.item.value}
          <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
        </div>
      </li>     
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit(event) {
    event.preventDefault();
    const newItemValue = this.refs.itemName.value;
    
    if(newItemValue) {
      this.props.addItem({newItemValue});
      this.refs.form.reset();
    }
  }
  render () {
    return (
      <form ref="form" onSubmit={this.onSubmit}>
	    <label>Чек-лист</label>
        <input type="text" ref="itemName" className="form-control" placeholder="добавьте пункт..."/>
        <button type="submit" className="btn btn-rectangle btn-sm btn-fill">Добавить</button> 
      </form>
    );   
  }
}
    
class TodoApp extends React.Component {
  constructor (props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.state = {todoItems: todoItems};
  }
  addItem(todoItem) {
    todoItems.unshift({
      index: todoItems.length+1, 
      value: todoItem.newItemValue, 
      done: false
    });
    this.setState({todoItems: todoItems});
  }
  removeItem (itemIndex) {
    todoItems.splice(itemIndex, 1);
    this.setState({todoItems: todoItems});
  }
  markTodoDone(itemIndex) {
    const todo = todoItems[itemIndex];
    todoItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
    this.setState({todoItems: todoItems});  
  }
  render() {
    return (	
      <div className="form-group">
	    <TodoForm addItem={this.addItem} />
        <TodoList items={this.props.initItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone}/>
      </div>
    );
  }
}
/*
* todo list end
*/




class Companies extends Component {

	emptyModalForm = {	
		name: '', 
		description: '', 
		statusType: 0,
		begindate: '',
		enddate: '',
		equipmentType: 0,
		customType: 0,
		performType: 0,
	    list: []
	}

	state = {
		data: data,
		showModalChange: false,
		modalForm: Object.assign({}, this.emptyModalForm),	
		addRow: -1	
	};
	
	componentWillMount(){	
	    if(prodSwitch === 1){
			getFetch(fetchAddr + '/tasks', 
					 'GET')
			.then(data => {
				console.log('ok tasks');
				console.log(data);	
			})
	    }
   
	} 	

	descValidation = {
	    name: [{type: 'select', text: 'Выберите значение из поля "Название"'}],
	    description: [{type: 'empty', text: 'Введите значение в поле "Описание"'}], 
	    statusType: [{type: 'select', text: 'Выберите значение из поля "Статус"'}],
	    begindate: [{type: 'empty', text: 'Введите значение в поле "Начало"'}],
	    enddate: [{type: 'empty', text: 'Введите значение в поле "Крайний срок"'}],
	    equipmentType: [{type: 'select', text: 'Выберите значение из поля "Оборудование"'}],
	    customType: [{type: 'select', text: 'Введите значение в поле "Заказчик"'}],
	    performType: [{type: 'select', text: 'Введите значение в поле "Исполнитель"'}],
		list: [{type: 'array', text: 'Добавьте значения в чек-лист'}],
	}
	//id: [{type: 'empty', text: 'Введите значение в поле "Номер"'}],
	//address: [{type: 'empty', text: 'Введите значение в поле "Адрес"'}],

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
	
	handlerAddList = (e) => {
		console.log(this.refs.task);
		e.preventDefault();
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
					<h4>Задачи</h4>
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
						width="8%"
						filter={ { type: 'TextFilter', placeholder: 'Введите название'} } 
						editable={ { type: 'text' } }
						dataSort>
						Название
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='statusType'
						width="8%" 
						filter={ { type: 'SelectFilter', options: statusType, placeholder: 'Выберите статус' } } 
						dataFormat={ enumFormatter } 
						formatExtraData={ statusType }
						editable={ { type: 'select', options: { values: [1, 2, 3] } } }
						dataSort>
						Статус
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='begindate'
						width="8%" 
						filter={ { type: 'DateFilter', defaultValue: { date: new Date(2015, 7, 22), comparator: '>=' } } }
						dataFormat={ dateFormatter } 
						editable={ { type: 'date' } }
						dataSort>
						Начало
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='enddate' 
						filter={ { type: 'DateFilter', defaultValue: { date: new Date(2015, 7, 22), comparator: '>=' } } }
						dataFormat={ dateFormatter } 
						editable={ { type: 'date' } }
						width="8%"
						dataSort>
						Крайний срок
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='equipmentType'
						width="8%" 
						filter={ { type: 'SelectFilter', options: statusType, placeholder: 'Выберите оборудование' } } 
						dataFormat={ enumFormatter } 
						formatExtraData={ statusType }
						editable={ { type: 'select', options: { values: [1, 2, 3] } } }
						dataSort>
						Оборудование
					  </TableHeaderColumn>	
					  <TableHeaderColumn
						dataField='customer' 
						filter={ { type: 'TextFilter', placeholder: 'Введите заказчика'} }
						editable={ { type: 'text' } }
						width="8%"
						dataSort>
						Заказчик
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='performer' 
						filter={ { type: 'TextFilter', placeholder: 'Введите исполнителя'} }
						editable={ { type: 'text' } }
						width="8%"
						dataSort>
						Исполнитель
					  </TableHeaderColumn>
					  <TableHeaderColumn width="100px" dataField='actions' dataFormat={this.cellButton} editable={ false } hiddenOnInsert autoValue></TableHeaderColumn>
					</BootstrapTable>
		
				  </div>
				</div>
			  </div>
			</div>
			
			<Modal show={this.state.showModalChange} onHide={this.handleModalChangeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
					<Modal.Title>Добавление задачи</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
			  
					  <div className="form-group">
						<label>Название</label>
						<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите название</span>
						<input type="text" placeholder="Название" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
					  </div>	
		
					  <div className="form-group">
						<label>Описание</label>
						<span className={this.state.modalForm.description === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите описание</span>
						<input type="text" placeholder="Описание" className={this.state.modalForm.description === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.description} onChange={(e) => this.handleModalFormChange(e, 'description')} />
					  </div>
				
					  <div className="form-group">
						<label>Статус</label>
						<span className={this.state.modalForm.statusType === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите статус</span>
						<select placeholder="Статус" className={this.state.modalForm.statusType === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.statusType} onChange={ (e) => this.handleModalFormChange(e, 'statusType') }>
						  <option value="0"></option>
						  <option value="1">Провалено</option>
						  <option value="2">В работе</option>
						  <option value="3">Завершено</option>			  
						</select>
					  </div>	
					  
					  <div className="form-group">
						<label>Дата заведения задачи</label>
						<span className={this.state.modalForm.begindate === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите дату заведения задачи</span>
						<input type="date" placeholder="Начало" className={this.state.modalForm.begindate === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.begindate} onChange={(e) => this.handleModalFormChange(e, 'begindate')} />
					  </div>
					  
					  <div className="form-group">
						<label>Крайний срок</label>
						<span className={this.state.modalForm.enddate === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите дату крайнего срока</span>
						<input type="date" placeholder="Крайний срок" className={this.state.modalForm.enddate === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.enddate} onChange={(e) => this.handleModalFormChange(e, 'enddate')} />
					  </div>
					  
					  <div className="form-group">
						<label>Оборудование</label>
						<span className={this.state.modalForm.equipmentType === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите оборудование</span>
						<select placeholder="Оборудование" className={this.state.modalForm.equipmentType === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.equipmentType} onChange={ (e) => this.handleModalFormChange(e, 'equipmentType') }>
						  <option value="0"></option>
						  <option value="1">Оборудование 1</option>
						  <option value="2">Оборудование 2</option>
						  <option value="3">Оборудование 3</option>			  
						</select>
					  </div>	

					  <div className="form-group">
						<label>Исполнитель</label>
						<span className={this.state.modalForm.performType === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите исполнителя</span>
						<select placeholder="Исполнитель" className={this.state.modalForm.performType === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.performType} onChange={ (e) => this.handleModalFormChange(e, 'performType') }>
						  <option value="0"></option>
						  <option value="1">Исполнитель 1</option>
						  <option value="2">Исполнитель 2</option>
						  <option value="3">Исполнитель 3</option>			  
						</select>
					  </div>
					  
					  <div className="form-group">
						<label>Заказчик</label>
						<span className={this.state.modalForm.customType === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите заказчика</span>
						<select placeholder="Заказчик" className={this.state.modalForm.customType === 0 ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.customType} onChange={ (e) => this.handleModalFormChange(e, 'customType') }>
						  <option value="0"></option>
						  <option value="1">Заказчик 1</option>
						  <option value="2">Заказчик 2</option>
						  <option value="3">Заказчик 3</option>			  
						</select>
					  </div>
					  {/* 
					  <div className="form-group">
						<label>Чек-лист</label>
						<span className={this.state.modalForm.list === 0 ? 'avSpanPrompt' : 'avSpanPromptHide'}>Выберите </span>
						<input type="text" ref="tasks" placeholder="Название" className={this.state.modalForm.list === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.list} onChange={(e) => this.handleModalFormChange(e, 'list')} />
					</div>	
					*/}	
					  	

<TodoApp initItems={todoItems}/>		
			  
					  
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleModalChangeClose}>Отмена</Button>
				<Button onClick={this.handleModalChangeSave}>Сохранить</Button>
			  </Modal.Footer>
			</Modal>		


			<Modal show={this.state.showModalSee} onHide={this.handleModalSeeClose} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="av-custom-modal">
			  <Modal.Header closeButton>
					<Modal.Title>Просмотр задачи</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>Задача</h4>
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






