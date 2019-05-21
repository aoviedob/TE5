import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import SearchBox from '../SearchBox/SearchBox';
import Header from '../../containers/Header/Header';
import './Dashboard.css';

@observer
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: {
        index: 0,
        renderComponent: () => <div></div>,
      } 
    }
  }

  setActiveItem = (item, index) => this.setState({ activeItem: { index, renderComponent: item.renderComponent } });

  renderItems = items => items.map((item, index) => { 
    const className = index === this.state.activeItem.index ? 'active' : '';
    return <li key={`li-${item.name}-${index}`} className={className}><a href="#" onClick={() => this.setActiveItem(item, index)}>{item.icon}<span className="hidden-xs hidden-sm">{item.name}</span></a></li>
  });

  render() {
    const { items, renderUserDetails } = this.props;
    const { activeItem } = this.state;

    return (<Container>
        <Header/>
       <div className="home">
    <div className="container-fluid display-table">
        <div className="row display-table-row">
            <div className="col-md-3 col-sm-3 hidden-xs display-table-cell v-align box" id="navigation">
                {renderUserDetails && renderUserDetails()}
                <div className="navi">
                    <ul>
                      {this.renderItems(items)}  
                    </ul>
                </div>
            </div>
            <div className="col-md-9 col-sm-10 display-table-cell v-align">
                <div className="row">
                  <div className="col-md-12" style={{ marginTop: 10 }}>
                    <SearchBox />  
                  </div>
                </div>
                <div className="user-dashboard">
                   {activeItem.renderComponent()}
                </div>
            </div>
        </div>

    </div>

</div>
            </Container>);
  }

}