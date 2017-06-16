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
    //#region removed methods
    //change states to show specific auction page
    // offerBid(i, arr) {
    //     this.setState({ auctionsArr: arr,displayedAuction: i, home: false });
    // }

    // //call function to get auctions from serveer
    // getAuctionsByParams(cities, lowPrice, highPrice, catCode) {
    //     const self = this;
    //     axios.post(auctionWS + 'GetAuctionByParam', {
    //         cities: cities,
    //         lowPrice: lowPrice,
    //         highPrice: highPrice,
    //         catCode: catCode
    //     }).then(function (response) {
    //         let res = JSON.parse(response.data.d);
    //         res.map(self.addAuction);
    //     })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    // //add auction to state array
    // addAuction(item, i) {
    //     let arr = this.state.auctionsArr;
    //     let newAuction = {
    //         code: item.AuctionID,
    //         endDate: item.End_Date,
    //         price: item.Price,
    //         percentage: item.Percentage,
    //         prodName: item.ProdName,
    //         prodDesc: item.ProdDesc,
    //         imgArr: item.Images,
    //     }
    //     arr.push(newAuction);
    //     this.setState({ auctionsArr: arr });

    // }
    /*
        renderHome() {
            return (
                <Home offerBid={this.offerBid} auctionsArr={this.state.auctionsArr}  />
            );
        }
    
        renderAucPage() {
            let curAuction = this.state.auctionsArr[this.state.displayedAuction];
            return (
                <div className="container-fluid">
                    <Auction index={this.state.displayedAuction} auctionfinished={this.deleteAuction}
                        home={this.state.home} price={curAuction.price} endDate={curAuction.endDate} code={curAuction.code}
                        imgArr={curAuction.imgArr} prodName={curAuction.prodName} prodDesc={curAuction.prodDesc} percentage={curAuction.percentage} />
                </div>
            )
        }*/
    //#region removed methods
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
        {/* Parameter route*/}
        <Route path="/participate" component={ParticipateAuction} />

        {/*testing route*/}
        <Route path="/bdika" component={Bdika}/>
    </App>
</HashRouter>, document.getElementById('app'));

