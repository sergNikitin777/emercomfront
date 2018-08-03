import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

class ModalForm extends React.Component {
  constructor(props, context) {
    super(props, context);
	
	console.log(this.props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: ''
    };
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
	    {
		    this.props.columns.map((column, i) => {
				const {
					editable,
					format,
					field,
					name,
					hiddenOnInsert
				} = column;
				
				if (hiddenOnInsert) {
					return null;
				}
			
				return (
				  <div key={i}>
					  <ControlLabel>{name}</ControlLabel>
					  <FormControl type="text" />
					  <FormControl.Feedback />
                  </div>		  
				  );
				})
		}
		  
        </FormGroup>
      </form>
    );
  }
}

export default ModalForm;

/*
import { Field, reduxForm } from 'redux-form';
import renderField from 'components/FormInputs/renderField';

class ModalForm extends React.Component {
  render() {
    return (
		<div className="row">
		  <div className="col-md-12">
			<div className="card">
			  <div className="header"><h4>Добавление контракта</h4></div>
			  <form className="form-horizontal">
				<div className="content">
				  <div className="form-group">
					<label className="col-sm-3 control-label">Required text</label>
					<div className="col-sm-9">
					  <Field
						type="text"
						name="required"
						component={renderField} />
					</div>
				  </div>

				  <div className="form-group">
					<label className="col-sm-3 control-label">Email</label>
					<div className="col-sm-9">
					  <Field
						type="email"
						name="email"
						component={renderField} />
					</div>
				  </div>

				  <div className="form-group">
					<label className="col-sm-3 control-label">Number</label>
					<div className="col-sm-9">
					  <Field
						type="text"
						name="number"
						component={renderField} />
					</div>
				  </div>

				  <div className="form-group">
					<label className="col-sm-3 control-label">URL</label>
					<div className="col-sm-9">
					  <Field
						type="text"
						name="url"
						component={renderField} />
					</div>
				  </div>

				  <div className="form-group">
					<label className="col-sm-3 control-label">Equal to</label>
					<div className="col-sm-4">
					  <Field
						type="text"
						name="equal1"
						component={renderField} />
					</div>
					<div className="col-sm-5">
					  <Field
						type="text"
						name="equal2"
						component={renderField} />
					</div>
				  </div>
				</div>

			  </form>
			</div>
		  </div>
		</div>      
    );
  }
}


export default reduxForm({
  form: 'editForm' 
})(ModalForm)

*/