import React, { Component } from 'react';

export default class Card extends Component {

  render() {
  	const { image, title, subtitle, description, children, className } = this.props;
    return  <div className={`${className} card card-cascade`}>
			  {image &&
			     <div className="view view-cascade overlay">
				   <img className="card-img-top" src={image}/>
				     <a>
				       <div className="mask rgba-white-slight"></div>
				     </a>
				 </div>
			  }
			  <div className="card-body card-body-cascade text-center">
			    {title && <h4 className="card-title"><strong>{title}</strong></h4>}
			    {subtitle && <h6 className="font-weight-bold indigo-text py-2">{subtitle}</h6>}
			    {description && <p className="card-text">{description}</p>}
				{children}			  
			  </div>

			</div>;
    }

}
