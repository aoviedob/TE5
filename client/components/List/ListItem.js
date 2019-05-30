import React, { Component }  from 'react';

export default class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };    
  }

  handleOnClick = () => {
  	this.setState({selected: !this.state.selected });
  	const { onClick } = this.props;
  	onClick && onClick();
  }

  render() { 
  	const { id, item, children, ...rest } = this.props;
  	const { selected } = this.state;

	  return <div className="card" {...rest} onClick={this.handleOnClick}>
	    <div className="card-header">
	      <h5 className="mb-0">
	        <button className="btn w-100" data-toggle="collapse" data-target={`#item-${id}`} aria-expanded="true" aria-controls="collapseOne">
	           {item}
	        </button>
	      </h5>
	    </div>

	    {selected && <div id={`#item-${id}`} className="collapse show" data-parent="#accordion">
	      <div className="card-body">
	          {children}
	      </div>
	    </div>}
	  </div>;
  }
};

