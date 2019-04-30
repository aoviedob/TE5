import React, { Component } from 'react';
import { Table } from '../Table/Table';
import { Row } from '../Table/Row';
import { Column } from '../Table/Column';
import Modal from '../Modal/Modal';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import FieldTypes from '../../helpers/enums/field-types';
import Dropdown from '../Dropdown/Dropdown';
import { observer, inject } from 'mobx-react';
import isEqual from 'lodash/isEqual';

@inject('management')
@observer
export default class Management extends Component {

  constructor(props) {
    super(props);
    this.initForm(props);
  }

  componentWillUpdate(nextProps) {
   if(nextProps.management.shouldInitForm) {
      nextProps.management.setShouldInitForm(false);
      this.initForm(nextProps);
   }
  }

  initForm = props => {
    const plugins = {
      dvr: dvr(validatorjs)
    };

    const fields = this.getFieldsSettings(props.model);

    const ctx = this;
    const hooks = {
      async onSuccess(form) {
        if(props.isEdit) {
          return props.onEdit && (await props.onEdit(form.values()));
        }
        return props.onAdd && (await props.onAdd(form.values()));
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  };
  getFieldsSettings = model => Object.keys(model).map(fieldName => {
  	 const field = model[fieldName];
  	 return {
  	   name: fieldName,
       rules: field.rules,
       placeholder: field.placeholder,
       value: field.value,
     };
  });

  FieldTypeMapping = {
    [FieldTypes.Text]: ({ fieldName, value }) => <input {...this.form.$(fieldName).bind()}   type="text" className="form-control"/>,
    [FieldTypes.Number]: ({ fieldName, value }) => <input {...this.form.$(fieldName).bind()}  type="number" className="form-control" />,
  	[FieldTypes.Dropdown]: ({ fieldName, value, onChange, defaultItem, items }) => <Dropdown items={items} {...this.form.$(fieldName).bind()} onOptionSelected={item => onChange(this.form, item, fieldName)} defaultItem={defaultItem} selectedId={value} />,
  	[FieldTypes.Checkbox]: ({ fieldName, value }) => <input {...this.form.$(fieldName).bind()} type="checkbox" className="form-control" />,
  	[FieldTypes.Password]: ({ fieldName, value }) => <input {...this.form.$(fieldName).bind()} className="form-control" type="password" />,
    [FieldTypes.Hidden]: ({ fieldName }) => <input {...this.form.$(fieldName).bind()} type="hidden" />,
  };

  renderFields = model => Object.keys(model).map(fieldName => {
  	const field = model[fieldName];
  	const { type, value = '', onChange, defaultItem, items } = field;
  	const renderFieldComponent = this.FieldTypeMapping[type];
  	if(!renderFieldComponent) return '';
  	
  	const errors = this.form.errors();
  	const error = errors[fieldName];

   	return <div className="form-group">
             {renderFieldComponent({ fieldName, value, onChange, defaultItem, items })}
             {error && <label className="label label-danger"> {error} </label>}
           </div>;
  });

  handleEditClick = async item => {
    const { onEditClicked } = this.props;
    onEditClicked && (await onEditClicked(item));
  };

  handleDeleteClick = async item => {
    const { onDeleteClicked } = this.props;
    onDeleteClicked && (await onDeleteClicked(item));
  };

  renderColumns = row => { 
  	const columns = Object.keys(row).reduce((acc, key, index) => {
  	  const column = row[key];
  	  if (key !== 'id') {
        acc.push(<Column key={`${row.id}-${index}`}>{column}</Column>);
      }
      return acc;
    }, []);

    columns.push(<Column><a style={{cursor: 'pointer' }} onClick={() => this.handleEditClick(row)}><i className="material-icons">edit</i></a></Column>);
    columns.push(<Column><a style={{cursor: 'pointer' }} onClick={() => this.handleDeleteClick(row)}><i className="material-icons">close</i></a></Column>);
    return columns;
  };

  renderRows = rows => rows.map((row, index) => <Row key={`${row.id}-${index}`}>{this.renderColumns(row)}</Row>);

  render() {
  	const { rows, model, submitLabel, headers, title, deleteDescription } = this.props;

    return (<div>
    		      {rows.length > 0 && <Table headers={headers}>
    		        {this.renderRows(rows)}
    		      </Table>}
              <Modal title={title} id="addEditModal" modalType="modal fade modal-dialog modal-dialog-centered modal-lg">
     				    <form role="form" onSubmit={this.form.onSubmit}>
                  {this.renderFields(model)}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" type="submit" onClick={this.form.onSubmit}>{submitLabel}</button>
                  </div>
          	    </form>
              </Modal>


            </div>);
  }

}
