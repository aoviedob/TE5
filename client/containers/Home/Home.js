import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import SearchBox from '../../components/SearchBox/SearchBox';
import Header from '../../components/Header/Header';

//@inject('home')
// @observer
export default class Home extends Component {

  render() {

  	return <Container>
  		     <div className="row">
  		       <Header></Header>
  		     </div>
  		     
  		       <SearchBox></SearchBox>
  		     
  	       </Container>;
  }

}