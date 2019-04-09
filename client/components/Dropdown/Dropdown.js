import React, { Component } from 'react';

export default class Dropdown extends Component {

  handleOnSearch = () => {
    const { onSearch } = this.props;
    onSearch && onSearch(this.input.value);
  }

  render() {
    
    return      <select className="selectpicker" data-live-search="true">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>;
  }

}
