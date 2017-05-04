//import $ from 'jquery';
import React, { Component } from 'react';
// import ReactSwipeEvents from 'react-Swipe-Events'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';

import Timer from './Timer';
import Pic from './Pic';
import Tetris from './Tetris';

import '../css/bootstrap.css';
import '../css/jqmCss.css';
import '../css/auction.css';

class Auction extends Component {
    constructor() {
        super();
        this.state = {
            home: true,
            tempPrice: 0,
            tempDonation: "",
            borderColor:"red"
        }
        this.offerBid = this.offerBid.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.renderHomePage = this.renderHomePage.bind(this);
        this.renderItemPage = this.renderItemPage.bind(this);
    }

    calcDonation() {
        let tempPrice = this.props.price;
        if (this.refs.newPrice !== undefined) {
            this.setState({
                borderColor: "red"
            });

            let val = this.refs.newPrice.value;
            console.log(`price: ${tempPrice},  new price: ${val}`)
            if (val > tempPrice) {
                tempPrice = val;
                this.setState({
                    borderColor: "green"
                });
            }
        }
        this.setState({
            tempDonation: `כבר ${Math.floor(tempPrice * this.props.percentage)} ש"ח לתרומה`
        });

    }

    offerBid() {
        this.setState({ home: false });
    }

    componentDidMount() {
        this.setState({ tempPrice: this.props.price });
        this.calcDonation();
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
            <div>
                <div className="basicInfo">
                    <div className="time">
                        <Timer endDate={this.props.endDate} />
                    </div>
                    <FontAwesome name='info-circle' border="true" className="fa-3x" tag="i" />
                    <FontAwesome name='question-circle' border="true" className="fa-3x" tag="i" />
                </div>
                <input type="text" ref="newPrice" onChange={this.calcDonation} style={{ borderColor : this.state.borderColor}} />
                <div className="circle">
                    <h4>
                        {this.state.tempDonation}
                    </h4>
                </div>


                <Tetris />
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
