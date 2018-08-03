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
		name: 'Оборудование 1', 
		group: 1,
		address: 'ул Пушкина, 58',
		producer: 'Производитель 1',
		year: 2011,
		selectedRemoveTech: [],
		selectedRemoveAllow: [],	
}];	
	







const statusType = {
  1: '1',
  2: '2',
  3: '3',
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




class Companies extends Component {

	emptyModalForm = {
		name: '',
		group: '',
		address: '',
		producer: '',
		year: '',
		selectedRemoveTech: [],
		selectedRemoveAllow: []
	}


	state = {
		data: data,
		showModalChange: false,
		showModalSee: false, 
		modalForm: Object.assign({}, this.emptyModalForm),	
		addRow: -1,
	};
	
	componentWillMount(){	
	    if(prodSwitch === 1){
			getFetch(fetchAddr + '/devices', 
					 'GET')
			.then(data => {
				console.log('ok devices');
				console.log(data);	
			})
	    }
   
	} 	

	descValidation = {
	    name: [{type: 'empty', text: 'Введите значение в поле "Наименование"'}],
	    group: [{type: 'empty', text: 'Введите значение в поле "ID ЭКТ"'}], 
	    address: [{type: 'empty', text: 'Введите значение в поле "Адрес"'}],
	    producer: [{type: 'empty', text: 'Введите значение в поле "Производитель"'}],
	    year: [{type: 'empty', text: 'Введите значение в поле "Год выпуска"'}, {type: 'year', text: 'Введите корректное значение для поля "Год выпуска"'}],
		selectedRemoveTech: [{type: 'array', text: 'Выберите значение(я) в поле "Необходимое ТО"'}],
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
		
	handleRemoveDeselectTech = (deselectedRemoveTech) => {
		const selectedRemoveTech = this.state.modalForm.selectedRemoveTech.slice();
		deselectedRemoveTech.forEach(option => {
		    selectedRemoveTech.splice(selectedRemoveTech.indexOf(option), 1);
		})
		const obj = this.state.modalForm;
		      obj.selectedRemoveTech = selectedRemoveTech;
		this.setState({modalForm: obj});
	}
	  
	handleRemoveSelectTech = (selectedRemoveTech) => {
		selectedRemoveTech.sort((a, b) => a.id - b.id);
		const obj = this.state.modalForm;
		      obj.selectedRemoveTech = selectedRemoveTech;
		this.setState({modalForm: obj});
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
		  insertText: 'Добавить',
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
					<h4>Оборудование</h4>
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
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите наименование'} } 
						editable={ { type: 'text' } }
						dataSort>
						Наименование
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='group'
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите ID ЭКТ'} } 
						editable={ { type: 'text' } }
						dataSort>
						ID ЭКТ
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='address'
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите адрес'} } 
						editable={ { type: 'text' } }
						dataSort>
						Адрес
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='producer'
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите производителя'} } 
						editable={ { type: 'text' } }
						dataSort>
						Производитель
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='year'
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите год'} } 
						editable={ { type: 'text' } }
						dataSort>
						Год выпуска
					  </TableHeaderColumn>
	{/*					  
					  <TableHeaderColumn
						dataField='techType'
						width="10%" 
						filter={ { type: 'SelectFilter', options: techType, placeholder: 'Выберите ТО' } } 
						dataFormat={ enumFormatter } 
						formatExtraData={ techType }
						editable={ { type: 'select', options: { values: [1, 2, 3] } } }
						dataSort>
						Необходимое ТО
					  </TableHeaderColumn>
					  <TableHeaderColumn
						dataField='allowance'
						width="10%"
						filter={ { type: 'TextFilter', placeholder: 'Введите допуск'} } 
						editable={ { type: 'text' } }
						dataSort>
						Необходимый допуск
					  </TableHeaderColumn>
	*/}
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
					<Modal.Title>Добавление оборудования</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
			  
					  <div className="form-group">
						<label>Наименование</label>
						<span className={this.state.modalForm.name === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите наименование</span>
						<input type="text" placeholder="Наименование" className={this.state.modalForm.name === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.name} onChange={(e) => this.handleModalFormChange(e, 'name')} />
					  </div>
					  
					  <div className="form-group">
						<label>ID ЭКТ</label>
						<span className={this.state.modalForm.group === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите ID ЭКТ</span>
						<input type="text" placeholder="ID ЭКТ" className={this.state.modalForm.group === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.group} onChange={(e) => this.handleModalFormChange(e, 'group')} />
					  </div>	

					  <div className="form-group">
						<label>Адрес</label>
						<span className={this.state.modalForm.address === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите адрес</span>
						<input type="text" placeholder="Адрес" className={this.state.modalForm.address === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.address} onChange={(e) => this.handleModalFormChange(e, 'address')} />
					  </div>	
					  
					  <div className="form-group">
						<label>Производитель</label>
						<span className={this.state.modalForm.producer === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите производителя</span>
						<input type="text" placeholder="Производитель" className={this.state.modalForm.producer === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.producer} onChange={(e) => this.handleModalFormChange(e, 'producer')} />
					  </div>	

					  <div className="form-group">
						<label>Год выпуска</label>
						<span className={this.state.modalForm.year === '' ? 'avSpanPrompt' : 'avSpanPromptHide'}>Введите год</span>
						<input type="text" placeholder="Год выпуска" className={this.state.modalForm.year === '' ? 'form-control editor edit-text avInputInvalid' : 'form-control editor edit-text avInputValid'} value={this.state.modalForm.year} onChange={(e) => this.handleModalFormChange(e, 'year')} />
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
					<Modal.Title>Просмотр оборудования</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>БАО</h4>
			    <Tabs defaultActiveKey={1} id="tab-with-icons">
				  <Tab eventKey={1} title={<span>Детали</span>}>
				    <div className="card">
						<div className="content">
						  <div>
							<p className="avLineLeft">Адрес: </p> <p className="avLineRight">{this.state.modalForm.address}</p>
						  </div>
						  <div className="typo-line">
							<p><span className="category">Производитель</span> {this.state.modalForm.producer}</p>
						  </div>	
						  <div className="typo-line">
							<p><span className="category">Год выпуска</span> {this.state.modalForm.year}</p>
						  </div>
						  <div className="typo-line">
							<p><span className="category">Виды необходимых ТО</span> --перечисление-- </p>
						  </div>
						  <div className="typo-line">
							<p><span className="category">ID ЭКТ</span> {this.state.modalForm.group}</p>
						  </div>	
						</div>		
                    </div>						
				  </Tab>
				  <Tab eventKey={2} title={<span>План обслуживания</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  <table className="table table-hover table-striped">
							<thead>
							  <tr>
								<th>№</th>
								<th>Плановая дата проведения обслуживания</th>
								<th>Вид ТО</th>
							  </tr>
							</thead>
							<tbody>
								<tr>
								  <td>1</td>
								  <td>01.02.2017</td>
								  <td>ТО-1</td>
								</tr>
								<tr>
								  <td>2</td>
								  <td>02.03.2018</td>
								  <td>ТО-2</td>
								</tr>
							</tbody>
						  </table>
						</div>
					  </div>				  
				  </Tab>
				  <Tab eventKey={3} title={<span>История обслуживания</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  <table className="table table-hover table-striped">
							<thead>
							  <tr>
								<th>№</th>
								<th>Вид ТО</th>
								<th>Дата проведения</th>
								<th>Трудозатраты</th>
								<th>Замена элементов</th>
								<th>Результат (комментарий)</th>
								<th>Исполнитель</th>
							  </tr>
							</thead>
							<tbody>
								<tr>
								  <td>1</td>
								  <td>ТО-1</td>
								  <td>01.02.2017</td>
								  <td>5 ч</td>
								  <td>нет</td>
								  <td>завершено успешно</td>
								  <td>Сидоров А.А.</td>
								</tr>
								<tr>
								  <td>2</td>
								  <td>ТО-2</td>
								  <td>02.03.2018</td>
								  <td>10 ч</td>
								  <td>нет</td>
								  <td>ТО-2 выявило некоторые неполадки в оборудовании</td>
								  <td>Сидоров А.А.</td>
								</tr>
							</tbody>
						  </table>
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






