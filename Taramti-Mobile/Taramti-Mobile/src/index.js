import './css/index.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import { Router, Route, hashHistory } from 'react-router'
import { HashRouter, Route, Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';

// taramti babait components
import Home from './components/Home/Home';
import ParticipateAuction from './components/ParticipateAuction/ParticipateAuction';
import ActiveAuctions from './components/Profile/ActiveAuctions';
import MyAuction from './components/Profile/MyAuction';
import Profile from './components/Profile/Profile';
import ThemeAuctions from './components/Profile/ThemeAuctions';
import Bdika from './components/Generic/Bdika';



import GENERAL from '../www/js/master'

//const auctionWS = GENERAL.auctionWebServerAddress;
const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            auctionsArr: [
                // {
                //     code: 15,
                //     price: 535,
                //     endDate: "5/12/2017",
                //     imgArr: [
                //         "img/image.png",
                //         "img/ASP.JPG",
                //         "img/Logo.JPG"
                //     ],
                //     percentage: 0.15,
                //     prodName: "ספה שהיא נפתחת",
                //     prodDesc: "קצת מלל וכל מיני דברים שבא לי לכתוב וכן הנה עוד קצת דברים ותכף יהיו כאן גם תמונות וזה בסך הכל תיאור של מוצר גניהנכי חי כג הכ חיה יגכ הכגכ יחה גכ חיהד חכ החיגכ יח דגחב ד ח בגי דגח בגד בדב  "
                // },
                // {
                //     code: 5,
                //     price: 1234,
                //     endDate: "5/11/2017",
                //     imgArr: [
                //         "img/Logo.JPG",
                //         "img/image.png",
                //         "img/ASP.JPG"
                //     ],
                //     percentage: 0.45,
                //     prodName: "מחשב נייד",
                //     prodDesc: "בוא נכתוב כאן משהו שאפשר יהיה לראות שהכל עובד כמו שצריך. האם זה הצליח???"
                // },
                // {
                //     code: 14,
                //     price: 15,
                //     endDate: "5/14/2017",
                //     imgArr: [
                //         "img/ASP.JPG",
                //         "img/Logo.JPG",
                //         "img/image.png"
                //     ],
                //     percentage: 0.2,
                //     prodName: "שעון יד",
                //     prodDesc: "הנה כמה דברים שיש לי לומר  "
                // }
            ]
        }
        // this.offerBid = this.offerBid.bind(this);
        // this.getAuctionsByParams = this.getAuctionsByParams.bind(this);
        // this.addAuction = this.addAuction.bind(this);
        // this.renderHome = this.renderHome.bind(this);
        // this.renderAucPage = this.renderAucPage.bind(this);
    }

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        //this.getAuctionsByParams([], -1, -1, 0);
    }

    componentWillUnmount() {
        // Lifecycle function that is triggered just before a component unmounts
    }
    render() {
        console.log(`children======== ${this.props.children}`)
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
        {/* Parameter routes*/}
        <Route path="/participate" component={ParticipateAuction} />
        <Route path="/myAuction" component={MyAuction} />

        {/*testing route*/}
        <Route path="/bdika" component={ThemeAuctions}/>
    </App>
</HashRouter>, document.getElementById('app'));

