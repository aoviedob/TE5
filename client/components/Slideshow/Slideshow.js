import React, { Component } from 'react';
import './Slideshow.css';

export default class Slideshow extends Component {

  render() {

    return <div id="demo" className="carousel slide" data-ride="carousel">


			  <ul className="carousel-indicators">
			    <li data-target="#demo" data-slide-to="0" className="active"></li>
			    <li data-target="#demo" data-slide-to="1"></li>
			    <li data-target="#demo" data-slide-to="2"></li>
			  </ul>
			  

			  <div className="carousel-inner">
			    <div className="carousel-item active">
			     <div className="img"><img className="d-block img-fluid"src="https://ununsplash.imgix.net/photo-1416339134316-0e91dc9ded92?q=75&fm=jpg&s=883a422e10fc4149893984019f63c818"/></div>
			    </div>
			    <div className="carousel-item">
			      <img src="chicago.jpg" alt="Chicago" width="1100" height="500"/>
			    </div>
			    <div className="carousel-item">
			      <img src="ny.jpg" alt="New York" width="1100" height="500"/>
			    </div>
			  </div>
			  

			  <a className="carousel-control-prev" href="#demo" data-slide="prev">
			    <span className="carousel-control-prev-icon"></span>
			  </a>
			  <a className="carousel-control-next" href="#demo" data-slide="next">
			    <span className="carousel-control-next-icon"></span>
			  </a>
			</div>;
  }

}
