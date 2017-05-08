//import $ from 'jquery';
import React, { Component } from 'react';
// import ReactSwipeEvents from 'react-Swipe-Events'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';

import Timer from './Timer';
import Pic from './Pic';
import Tetris from './Tetris';
import AuctionInfo from './AuctionInfo';
import AuctionFAQ from './AuctionFAQ';

import '../css/bootstrap.css';
import '../css/jqmCss.css';
import '../css/auction.css';

class Auction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home: true,
            tempPrice: this.props.price,
            tempDonation: "",
            borderColor: "red",
            infoModalIsOpen: false,
            fAQModalIsOpen: false
        }
        this.timerFinishedHome = this.timerFinishedHome.bind(this);
        this.timerFinishedAuc = this.timerFinishedAuc.bind(this);
        this.offerBid = this.offerBid.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.renderHomePage = this.renderHomePage.bind(this);
        this.renderAucPage = this.renderAucPage.bind(this);
        this.openInfoModal = this.openInfoModal.bind(this);
        this.closeInfoModal = this.closeInfoModal.bind(this);
        this.openFAQModal = this.openFAQModal.bind(this);
        this.closeFAQModal = this.closeFAQModal.bind(this);
        this.makeBid = this.makeBid.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
        
    }

    componentDidMount() {
        //this.setState({ tempPrice: this.props.price });
        this.calcDonation();
        var interval = setInterval(this.getCurPrice, 5000);
    }

    componentWillUnmount() {
        //clear interval!!!
    }

    getCurPrice() {
        console.log("got new price!!!")
    }

    render() {
        if (this.props.home) {
            return (this.renderHomePage())
        } else {
            return (this.renderAucPage())
        }
    }

    /*
    ***************
    ***************
    home page funcs
    ***************
    ***************
    */

    timerFinishedHome() {
        this.props.auctionfinished(this.props.index);
    }

    offerBid() {
        this.props.offerBid(this.props.index);
    }

    //render func for home page
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
                        <Timer endDate={this.props.endDate} timerFinished={this.timerFinishedHome} />
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

    /*
    ***************
    ***************
    auction page funcs
    ***************
    ***************
    */

    openInfoModal() {
        this.setState({ infoModalIsOpen: true })
    }

    closeInfoModal() {
        this.setState({ infoModalIsOpen: false })
    }

    openFAQModal() {
        this.setState({ fAQModalIsOpen: true })
    }

    closeFAQModal() {
        this.setState({ fAQModalIsOpen: false })
    }

    //disable input and button
    timerFinishedAuc() {

    }
    
    //calculate donation amount to insert to circle
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


    //send bid to db
    makeBid() {
        let val = this.refs.newPrice.value;
        console.log(`make bid price: ${val}`)

    }

    //render func for auction page
    renderAucPage() {
        return (
            <div>
                <div className="basicInfo">
                    <div className="time">
                        <Timer endDate={this.props.endDate} timerFinished={this.timerFinishedAuc} />
                    </div>
                    <Swipeable onTap={this.openInfoModal}>
                        <FontAwesome name='info-circle' border="true" className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.infoModalIsOpen}
                            onRequestClose={this.closeInfoModal}
                            contentLabel="open info">
                            <AuctionInfo prodName={this.props.prodName} closeModal={this.closeInfoModal}
                                price={this.props.price} endDate={this.props.endDate}
                                imgArr={this.props.imgArr} prodDesc={this.props.prodDesc}
                                percentage={this.props.percentage} />
                        </Modal>
                    </Swipeable>

                    <Swipeable onTap={this.openFAQModal}>
                        <FontAwesome name='question-circle' border="true" className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.fAQModalIsOpen}
                            onRequestClose={this.closeFAQModal}
                            contentLabel="open FAQ">
                            <AuctionFAQ closeModal={this.closeFAQModal} />
                        </Modal>
                    </Swipeable>

                </div>
                <input type="text" ref="newPrice" onChange={this.calcDonation} style={{ borderColor: this.state.borderColor }} />
                <div className="circle">
                    <h4>
                        {this.state.tempDonation}
                    </h4>
                </div>

                <Swipeable onTap={this.makeBid}>
                    <div>
                        <button ref="bidBTN" className="down-arrow btn-primary active"> הצע ביד  </button>
                    </div>
                </Swipeable>
                <Tetris />
            </div>
        )
    }


}

export default Auction;
