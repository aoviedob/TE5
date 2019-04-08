import React, { Component } from 'react';

export default class Card extends Component {

  render() {

    return  <div className="card card-cascade">
			  <!-- Card image -->
			  <div className="view view-cascade overlay">
			    <img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/men.jpg" alt="Card image cap">
			    <a>
			      <div className="mask rgba-white-slight"></div>
			    </a>
			  </div>

			  <!-- Card content -->
			  <div className="card-body card-body-cascade text-center">

			    <!-- Title -->
			    <h4 className="card-title"><strong>Billy Coleman</strong></h4>
			    <!-- Subtitle -->
			    <h6 className="font-weight-bold indigo-text py-2">Web developer</h6>
			    <!-- Text -->
			    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, ex, recusandae. Facere modi sunt, quod quibusdam.
			    </p>

			    <!-- Facebook -->
			    <a type="button" className="btn-floating btn-small btn-fb"><i className="fab fa-facebook-f"></i></a>
			    <!-- Twitter -->
			    <a type="button" className="btn-floating btn-small btn-tw"><i className="fab fa-twitter"></i></a>
			    <!-- Google + -->
			    <a type="button" className="btn-floating btn-small btn-dribbble"><i className="fab fa-dribbble"></i></a>

			  </div>

			</div>;
    }

}
