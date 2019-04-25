import React, { Component } from 'react';
import { Table } from '../Table/Table';
import { Row } from '../Table/Row';
import { Column } from '../Table/Row';
import Modal from '../Modal/Modal';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import FieldTypes from '../../helpers/enums/field-types';

export default class Management extends Component {

  constructor(props) {
    super(props);

    const plugins = {
      dvr: dvr(validatorjs)
    };

    const fields = this.getFieldsSettings(props.model);

    const ctx = this;
    const hooks = {
      async onSuccess(form) {
      	props.onAdd && (await props.onAdd(form.values()));
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }

  getFieldsSettings = model => Object.keys(model).map(fieldName => {
  	 const field = model[fieldName];
  	 return {
  	   name: fieldName,
       rules: field.rules,
       placeholder: field.placeholder
     };
  });

  FieldTypeMapping = {
  	[FieldTypes.Text]: ({ form, fieldName, value }) => <input {...form.$(fieldName).bind()} value={value}  type="text" className="form-control" />,
  	[FieldTypes.Dropdown]: ({ form, fieldName, value }) => <Dropdown {...form.$(fieldName).bind()} value={value} />,
  	[FieldTypes.Checkbox]: ({ form, fieldName, value }) => <input {...form.$(fieldName).bind()} value={value} type="checkbox" className="form-control" />,
  	[FieldTypes.Password]: ({ form, fieldName, value }) => <input {...form.$(fieldName).bind()} value={value} className="form-control" type="password" />,
  };

  renderFields = model => Object.keys(model).map(fieldName => {
  	const field = model[fieldName];
  	const { type, value } = field;
  	const renderFieldComponent = this.FieldTypeMapping[type];
  	if(!renderFieldComponent) return '';
  	
  	const errors = this.form.errors();
  	const error = errors[fieldName];

  	return <div className="form-group">
             {renderFieldComponent({ form: this.form, fieldName, value })}
             {error && <label className="label label-danger"> error </label>}
           </div>;
  });

  renderColumns = row => { 
  	const columns = Object.keys(row).map((key, index) => {
  	  const column = row[key];
  	  return <Column> column.name <Column>;
    });
    columns.push();
  };

  renderRows = rows => rows.map((row, index) => <Row key={`${row.id}-{index}`}>{this.renderColumns(row)}</Row>);

  render() {
  	const { rows, model, submitLabel } = this.props;
    return (<div>
		      <Table>
		        {this.renderRows(rows)}
		      </Table>
              <Modal id={infoModalId} modalType="modal bottom-sheet bottom-sheet-large">
 				<form role="form">
                  this.renderFields(model);
           		  <input type="submit" onClick={() => this.form.onSubmit} value={submitLabel} />
 				</form>
              </Modal>
           </div>);
  }

}
