import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import PriceTag from './PriceTag';
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import ParticipateAuction from '../ParticipateAuction/ParticipateAuction';
//import Tetris from '../Tetris';


//constants 
import { auctionWS, buyerID } from '../../constants/general';

//style
import '../../css/bootstrap.css';
//import '../../css/jqmCss.css';
import '../../css/auction.css';
import '../../css/modal.css';
import '../../css/transition.css';

class Auction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reDirect: false,
            price: this.props.price
        };
        this.timerFinishedHome = this.timerFinishedHome.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
        this.toParticipate = this.toParticipate.bind(this);
    }

    componentDidMount() {
        this.props.handleLoad();
        this.loadInterval = setInterval(this.getCurPrice, 5000);
    }

    componentWillUnmount() {
        //clear interval!!!
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    getCurPrice() {
        const self = this;
        axios.post(auctionWS + 'GetAuctionPrice', {
            auctionCode: self.props.code
        })
            .then(function (response) {
                let ans = response.data.d;
                if (ans !== "-1") {
                    self.setState({ price: ans });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    timerFinishedHome() {
        this.props.auctionfinished(this.props.index);
    }

    toParticipate() {
        //let aucData = Object.assign({},)
        // aucData.price = this.state.price;
        localStorage.setItem("aucData", JSON.stringify({ props: this.props, price: this.state.price }));
        this.setState({ reDirect: true });

    }

    render() {
        if (this.state.reDirect) {
            return <Redirect push to="/participate" />;
        }
        return (

            <div className="row">
                <div className="col-xs-6 imgContainer">
                   
                        <PriceTag key={`.$${this.props.index}`} index={this.props.index} price={this.state.price} />

                    <CSSTransitionGroup
                        transitionName="slide"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                        <Pic key={this.key} imagesArr={this.props.imgArr} />
                    </CSSTransitionGroup>
                </div>
                <div className="col-xs-6" dir="rtl">
                    <div>
                        <Timer endDate={this.props.endDate} timerFinished={this.timerFinishedHome} />
                        <h4 className="text-center">{this.props.prodName}</h4>
                        <p className="descPar">{this.props.prodDesc}</p>
                        <button ref="bidBTN" className="ui-btn ui-btn-corner-all btn-primary" onClick={this.toParticipate}> השתתף במכרז!  </button>
                    </div>
                </div>
            </div>

        )
    }

}

export default Auction;
