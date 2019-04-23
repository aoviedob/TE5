import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@observer
export default class Dropdown extends Component {

  handleOnChange = event => {
    const { onOptionSelected } = this.props;
    const value = event.target.value === '0' ? null: event.target.value;
    onOptionSelected && onOptionSelected(value);
  }

  render() {
    console.log(111);
    const { items = [], defaultItem } = this.props;
    const cls = items.length > 0 ? 'selectpicker dropdown-container' : 'dropdown-container';
    return <select className={cls} onChange={this.handleOnChange} data-live-search="true">
                 <option key={defaultItem.name} value={0}> {defaultItem.name} </option>
              {items.map((item, index)=> <option value={item.id} key={`${item.name}-${index}`}> {item.name} </option>)}
            </select>;
  };

}
