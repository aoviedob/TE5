import React, { Component } from 'react';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      selectedItem: props.selectedId ? props.items.find(x => x.id === props.selectedId) : {},
    };    
  }

  componentWillUpdate(nextProps) {
    if( nextProps.selectedId !== this.props.selectedId) {
      this.setState({ selectedItem: nextProps.items.find(x => x.id === nextProps.selectedId) });
    }
  }

  handleOnChange = (item) => {
    this.setState({ selectedItem: item });
    const { onOptionSelected } = this.props;
    onOptionSelected && onOptionSelected(item);
  }

  handleOnSearch = event => {
    this.setState({ searchValue: event.target.value });
  };

  filterItems = (items, searchValue) => items.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));

  render() {
    const { items = [], defaultItem, ...rest } = this.props;
    const { searchValue, selectedItem } = this.state;
    const filteredItems = searchValue ? this.filterItems(items, searchValue) : items;

    return <div className="dropdown" {...rest} value={selectedItem.id}>
            <a className="dropdown-button btn btn-light white grey-text btn-block" type="button" data-toggle="dropdown" href="#">{selectedItem.name || defaultItem.name}</a>
              <div className="dropdown-menu full-width  btn-block">
                <input type="text" className="form-control" placeholder="Search" onChange={this.handleOnSearch} value={searchValue}/>
                {filteredItems.length > 0 && <a className="dropdown-item" key={`${defaultItem.name}`} onClick={() => this.handleOnChange(defaultItem)}>{defaultItem.name}</a>}
                {filteredItems.map((item, index) =>
                  <a className="dropdown-item" key={`${item.name}-${index}`} onClick={() => this.handleOnChange(item)}>{item.name}</a>
                )}
              </div>
            </div>;
  };

}
