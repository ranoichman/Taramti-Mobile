//style
import './css/index.css';

//npm components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';

// BID IT components
import Home from './components/Home/Home';
import ParticipateAuction from './components/ParticipateAuction/ParticipateAuction';
import TapDemo from './components/ParticipateAuction/TapDemo';

import MyAuction from './components/MyProducts/MyAuction';
import Profile from './components/Profile/Profile';
import MyProducts from './components/MyProducts/MyProducts';


import Menu from './components/Generic/Menu';
import Loader from './components/Generic/Loader';



import GENERAL from '../www/js/master'

//const auctionWS = GENERAL.auctionWebServerAddress;
const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class App extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        //this.getAuctionsByParams([], -1, -1, 0);
    }

    componentWillUnmount() {
        // Lifecycle function that is triggered just before a component unmounts
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>

        )
    }
}

ReactDOM.render(<HashRouter>
    <App>
        <Route exact path="/" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/products" component={MyProducts} />
        {/* Parameter routes*/}
        <Route path="/participate" component={ParticipateAuction} />
        <Route path="/myAuction" component={MyAuction} />

        {/*testing route*/}
        {/* <Route path="/bdika" component={Bdika}/> */}
    </App>
</HashRouter>, document.getElementById('app'));

