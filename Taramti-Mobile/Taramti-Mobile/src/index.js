import './css/index.css';

//import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import Hello from './components/Hello';
import Auction from './components/Auction';


const App = React.createClass({
    getInitialState() {
        //return StepStore.getState();
        return {
            animationName: 'push',
            home: true, // for knowing which auction page to display
            displayedAuction: -1,
            auctionsArr: [
                {
                    price: 535,
                    endDate: "5/9/2017",
                    imgArr: [
                        "img/image.png",
                        "img/ASP.JPG",
                        "img/Logo.JPG"
                    ],
                    percentage: 0.15,
                    prodName: "ספה שהיא נפתחת",
                    prodDesc: "קצת מלל וכל מיני דברים שבא לי לכתוב וכן הנה עוד קצת דברים ותכף יהיו כאן גם תמונות וזה בסך הכל תיאור של מוצר גניהנכי חי כג הכ חיה יגכ הכגכ יחה גכ חיהד חכ החיגכ יח דגחב ד ח בגי דגח בגד בדב  "
                },
                {
                    price: 1234,
                    endDate: "5/8/2017",
                    imgArr: [
                        "img/Logo.JPG",
                        "img/image.png",
                        "img/ASP.JPG"
                    ],
                    percentage: 0.45,
                    prodName: "מחשב נייד",
                    prodDesc: "בוא נכתוב כאן משהו שאפשר יהיה לראות שהכל עובד כמו שצריך. האם זה הצליח???"
                },
                {
                    price: 15,
                    endDate: "5/8/2017",
                    imgArr: [
                        "img/ASP.JPG",
                        "img/Logo.JPG",
                        "img/image.png"
                    ],
                    percentage: 0.2,
                    prodName: "שעון יד",
                    prodDesc: "הנה כמה דברים שיש לי לומר  "
                }
            ]
        }
    },

    componentWillMount() {
        // Lifecycle function that is triggered just before a component mounts
    },
    componentWillUnmount() {
        // Lifecycle function that is triggered just before a component unmounts
    },

    //remove finished auction from displayed array
    deleteAuction(i) {
        console.log(`delete: ${i} --- ${this.state.auctionsArr[i]} `)
        let arr = this.state.auctionsArr;
        arr.splice(i, 0);
        this.setState({ auctionsArr: arr });
    },

    //
    offerBid(i) {
        
        this.setState({ displayedAuction: i, home: false });
    },

    eachAuction(item, i) {
        return <Auction key={i} index={i} auctionfinished={this.deleteAuction} offerBid={this.offerBid}
            home={this.state.home} price={item.price} endDate={item.endDate}
            imgArr={item.imgArr} prodName={item.prodName} prodDesc={item.prodDesc} percentage={item.percentage} />
    },

    renderHome() {
        return (
            <div className="container-fluid">
                {this.state.auctionsArr.map(this.eachAuction)}
            </div>
        );
    },

    renderAucPage() {
        console.log(this.state.displayedAuction)
        let curAuction = this.state.auctionsArr[this.state.displayedAuction];
        return (
        <div className="container-fluid">
                <Auction index={this.state.displayedAuction} auctionfinished={this.deleteAuction}
                    home={this.state.home} price={curAuction.price} endDate={curAuction.endDate}
                    imgArr={curAuction.imgArr} prodName={curAuction.prodName} prodDesc={curAuction.prodDesc} percentage={curAuction.percentage} />
            </div>
            )
    },


    render() {
        if (this.state.home) {
            return (this.renderHome())
        }
        else { return (this.renderAucPage()) }
    },
});

ReactDOM.render(<App />, document.getElementById('app'));

