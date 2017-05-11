import './css/index.css';

//import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

import Hello from './components/Hello';
import Auction from './components/Auction';
import Home from './components/Home';

import GENERAL from '../www/js/master'

//const auctionWS = GENERAL.auctionWebServerAddress;
const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reRender: true, //state for rendering component only once
            home: true,
            displayedAuction: -1, // for knowing which auction page to display
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
        this.offerBid = this.offerBid.bind(this);
        this.getAuctionsByParams = this.getAuctionsByParams.bind(this);
        this.addAuction = this.addAuction.bind(this);
        this.renderHome = this.renderHome.bind(this);
        this.renderAucPage = this.renderAucPage.bind(this);
    }

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        this.getAuctionsByParams([1, 2], -1, -1, 0);
    }

    componentWillUnmount() {
        // Lifecycle function that is triggered just before a component unmounts
    }

    //change states to show specific auction page
    offerBid(i) {
        this.setState({ displayedAuction: i, home: false });
    }

    //call function to get auctions from serveer
    getAuctionsByParams(cities, lowPrice, highPrice, catCode) {
        const self = this;
        axios.post(auctionWS + 'GetAuctionByParam', {
            cities: cities,
            lowPrice: lowPrice,
            highPrice: highPrice,
            catCode: catCode
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            res.map(self.addAuction);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    //add auction to state array
    addAuction(item, i) {
        let arr = this.state.auctionsArr;
        let newAuction = {
            code: item.AuctionID,
            endDate: item.End_Date,
            price: item.Price,
            percentage: item.Percentage,
            prodName: item.ProdName,
            prodDesc: item.ProdDesc,
            imgArr: item.Images,
        }
        arr.push(newAuction);
        this.setState({ auctionsArr: arr });

    }

    renderHome() {
        return (
            <Home offerBid={this.offerBid} auctionsArr={this.state.auctionsArr} />
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
    }

    render() {
        if (this.state.home) {
            return (this.renderHome())
        }
        else {
            return (this.renderAucPage())
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

