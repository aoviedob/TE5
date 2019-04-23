import React, { Component } from 'react';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      selectedItem: {},
    };
  }

  handleOnChange = (item) => {
    if (item === this.props.defaultItem) return;

    this.setState({ selectedItem: item });
    const { onOptionSelected } = this.props;
    onOptionSelected && onOptionSelected(item);
  }

  handleOnSearch = event => {
    this.setState({ searchValue: event.target.value });
  };

  render() {
    const { items = [], defaultItem } = this.props;
    const { searchValue, selectedItem } = this.state;

    return <div className="dropdown">
            <a className="dropdown-button btn btn-light white grey-text btn-block" type="button" data-toggle="dropdown" href="#">{selectedItem.name || defaultItem.name}</a>
              <div className="dropdown-menu full-width  btn-block">
                <input type="text" class="form-control" placeholder="Search" onChange={this.handleOnSearch} value={searchValue}/>
                <a className="dropdown-item" key={`${defaultItem.name}`} onClick={() => this.handleOnChange(defaultItem)}>{defaultItem.name}</a>
                {items.map((item, index) =>
                  <a className="dropdown-item" key={`${item.name}-${index}`} onClick={() => this.handleOnChange(item)}>{item.name}</a>
                )}
              </div>
            </div>;
  };

}
