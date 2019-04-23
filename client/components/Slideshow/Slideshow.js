import React, { Component } from 'react';
import './Slideshow.css';

export default class Slideshow extends Component {

  renderSlideLinks = items => items.map((item, index) => {
  	const className = index === 0 ? 'active' : '';
  	return (<li data-target="#slideshow" data-slide-to={index} className={className}></li>);
  });


  renderImages = items => items.map((item, index) => {
  	const className = index === 0 ? 'carousel-item active' : 'carousel-item';
  	return (<div className={className}>
			  <div className="img"><img className="d-block img-fluid" src={item.src}/></div>
			</div>);
  });

  render() {
  	const { items = []} = this.props;
  	if (!items.length) return <div></div>;
  	
    return <div id="slideshow" className="carousel slide" data-ride="carousel">
		
				<ul className="carousel-indicators">
				  {this.renderSlideLinks(items)}
				</ul>

				<div className="carousel-inner">
				  {this.renderImages(items)}
				</div>

	  			<a className="carousel-control-prev" href="#slideshow" data-slide="prev">
				  <span className="carousel-control-prev-icon"></span>
				</a>
				<a className="carousel-control-next" href="#slideshow" data-slide="next">
				  <span className="carousel-control-next-icon"></span>
				</a>
		
			</div>;
  }

}
