import React, { Component } from 'react';

export default class SearchBox extends Component {

  handleOnSearch = () => {
    const { onSearch } = this.props;
    onSearch && onSearch(this.input.value);
  }

  render() {
    
    return  <div className="justify-content-center">
                <div className="col-12 col-md-12 col-lg-12">
                    <form className="card card-sm">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                              <input ref={node => { this.input = node; } } className="form-control form-control-lg form-control-borderless" type="search" placeholder="Search Events"/>
                            </div>
                             <div style={{paddingLeft: 10, paddingRight: 10, cursor: 'pointer' }} className="col-auto">
                             <i onClick={this.handleOnSearch} className="material-icons">search</i>
                            </div>
                        </div>
                    </form>
                </div>
            </div>;
  }

}
