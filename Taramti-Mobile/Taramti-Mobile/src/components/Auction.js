//import $ from 'jquery';
import React, { Component } from 'react';
// import ReactSwipeEvents from 'react-Swipe-Events'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';

import Timer from './Timer';
import Pic from './Pic';

import '../css/bootstrap.css';
import '../css/jqmCss.css';
import '../css/auction.css';

class Auction extends Component {
    constructor() {
        super();
        this.state = {
            home: true
        }
        this.offerBid = this.offerBid.bind(this);
        this.renderHomePage = this.renderHomePage.bind(this);
        this.renderItemPage = this.renderItemPage.bind(this);
    }

    offerBid() {
        this.setState({ home: false });
    }
    renderHomePage() {
        return (
            <div className="row">
                <div className="col-xs-6 imgContainer">
                    <div className="priceTag">
                        <h5>{this.props.price}</h5>
                    </div>
                    <Pic imagesArr={this.props.imgArr} />
                </div>
                <div className="col-xs-6" dir="rtl">
                    <div>
                        <Timer endDate={this.props.endDate} />
                        <h4 className="text-center">{this.props.prodName}</h4>
                        <p className="descPar">{this.props.prodDesc}</p>
                        <Swipeable onTap={this.offerBid}>
                            <button ref="bidBTN" className="ui-btn ui-btn-corner-all btn-primary"> הצע ביד!  </button>
                        </Swipeable>
                    </div>
                </div>
            </div>
        );
    }
    renderItemPage() {
        return (
            <div className="basicInfo">
                <div className="time">
                    <Timer endDate={this.props.endDate} />
                </div>
                <FontAwesome name='info-circle' border="true" className="fa-3x" tag="i" />
                <FontAwesome name='question-circle' border="true" className="fa-3x" tag="i" />
            </div>
        )
    }
    render() {
        if (this.state.home) {
            return (this.renderHomePage())
        } else {
            return (this.renderItemPage())
        }
    }
}

export default Auction;
