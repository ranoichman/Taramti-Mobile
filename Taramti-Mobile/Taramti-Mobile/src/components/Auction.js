//import $ from 'jquery';
import React, { Component } from 'react';
// import ReactSwipeEvents from 'react-Swipe-Events'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

import Timer from './Timer';
import Pic from './Pic';
import Tetris from './Tetris';
import AuctionInfo from './AuctionInfo';
import AuctionFAQ from './AuctionFAQ';

import '../css/bootstrap.css';
import '../css/jqmCss.css';
import '../css/auction.css';
import '../css/modal.css';

//const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";
const auctionWS = GENERAL.auctionWebServerAddress;
const buyerID = GENERAL.USER.userID();

//constants messages
const successMSG = "מזל טוב, אתה כרגע מוביל במכרז, אך המכרז עוד לא נגמר אז אל תלך לישון עדיין!";
const failedMSG = "מישהו עקף אותך ברגע האחרון, הצע ביד נוסף כדי לעקוף אותו";
const notEnoughtMSG = "הסכום המוצע לא מספיק, נא הצע סכום גדול יותר כדי להשתתף במכרז"
const errorMSG = "משהו לא הלך כשורה, נא נסה שוב";

class Auction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            home: true,
            tempPrice: this.props.price,
            price: this.props.price,
            tempDonation: "",
            borderColor: "red",
            msgClass: "box notEnough",
            shownMessage:"",
            infoModalIsOpen: false,
            fAQModalIsOpen: false,
            msg_ModalIsOpen: false,
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
        this.openMSGModal = this.openMSGModal.bind(this);
        this.closeMSGModal = this.closeMSGModal.bind(this);
    }

    componentDidMount() {
        this.calcDonation();
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
                        <h5>{this.state.price}</h5>
                    </div>
                    <Pic imagesArr={this.props.imgArr} />
                </div>
                <div className="col-xs-6" dir="rtl">
                    <div>
                        <Timer endDate={this.props.endDate} timerFinished={this.timerFinishedHome} />
                        <h4 className="text-center">{this.props.prodName}</h4>
                        <p className="descPar">{this.props.prodDesc}</p>
                        <Swipeable onTap={this.offerBid}>
                            <button ref="bidBTN" className="ui-btn ui-btn-corner-all btn-primary"> השתתף במכרז!  </button>
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


    /*
   ***************
      INFO MODAL
   ***************
   */
    openInfoModal() {
        this.setState({ infoModalIsOpen: true })
    }

    closeInfoModal() {
        this.setState({ infoModalIsOpen: false })
    }

    /*
       ***************
          FAQ MODAL
       ***************
       */
    openFAQModal() {
        this.setState({ fAQModalIsOpen: true })
    }

    closeFAQModal() {
        this.setState({ fAQModalIsOpen: false })
    }
    /*
       ***************
          MSG MODAL
       ***************
       */
    openMSGModal() {
        this.setState({ msg_ModalIsOpen: true })
    }

    closeMSGModal() {
        this.setState({ msg_ModalIsOpen: false })
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
        //console.log(`price: ${tempPrice},  new price: ${val}`)
            if (val > tempPrice) {
                tempPrice = val;
                this.setState({
                    borderColor: "green"
                });
            }
        }
        this.setState({
            tempDonation: `כבר ${Math.floor(tempPrice * this.props.percentage/100)} ש"ח לתרומה`
        });

    }

    //send bid to db
    makeBid() {
        if (this.state.borderColor !== "red") {
            let val = this.refs.newPrice.value;
            self = this;
            //db call!!
            axios.post(auctionWS + 'OfferBid', {
                auc: self.props.code,
                bid: val,
                buyer: buyerID
            })
                .then(function (response) {
                    let ans = response.data.d;
                    if (ans === true) {
                       self.setState({msgClass: "box success",
                                    shownMessage:successMSG})
                    }
                    else{
                        self.setState({msgClass: "box failure",
                                    shownMessage:failedMSG})
                    }
                    self.setState({msg_ModalIsOpen:true});
                })
                .catch(function (error) {
                    console.log(error);
                    self.setState({msgClass: "box failure",
                                    shownMessage:errorMSG,
                                    msg_ModalIsOpen:true})
                });
        }
        else {console.log("לא מספיק כסף!!!!!");
           this.setState({msgClass: "box notEnough",
                        shownMessage:notEnoughtMSG,
                        msg_ModalIsOpen:true
                    });
        }
        //console.log(`make bid price: ${val}`)

    }

    //render func for auction page
    renderAucPage() {
        return (
            <div>
                {/*shown messegae*/}
                <Swipeable onTap={this.openMSGModal}>
                    <Modal
                        isOpen={this.state.msg_ModalIsOpen}
                        onRequestClose={this.closeMSGModal}
                        contentLabel="open info"
                        className={this.state.msgClass}>
                        <h3>{this.state.shownMessage}</h3>
                    </Modal>
                </Swipeable>


                {/*basic info*/}
                <div className="basicInfo">
                    {/*timer Component*/}
                    <div className="time">
                        <Timer endDate={this.props.endDate} timerFinished={this.timerFinishedAuc} />
                    </div>

                    {/*info modal*/}
                    <Swipeable onTap={this.openInfoModal}>
                        <FontAwesome name='info-circle' border={true} className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.infoModalIsOpen}
                            onRequestClose={this.closeInfoModal}
                            contentLabel="open info"
                            className="box">
                            <AuctionInfo prodName={this.props.prodName} closeModal={this.closeInfoModal}
                                price={this.props.price} endDate={this.props.endDate}
                                imgArr={this.props.imgArr} prodDesc={this.props.prodDesc}
                                percentage={this.props.percentage} />
                        </Modal>
                    </Swipeable>

                    {/*FAQ modal*/}
                    <Swipeable onTap={this.openFAQModal}>
                        <FontAwesome name='question-circle' border={true} className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.fAQModalIsOpen}
                            onRequestClose={this.closeFAQModal}
                            contentLabel="open FAQ"
                            className="box">
                            <AuctionFAQ closeModal={this.closeFAQModal} />
                        </Modal>
                    </Swipeable>
                </div>

                <input type="number" ref="newPrice" onChange={this.calcDonation} style={{ borderColor: this.state.borderColor }} />
                <div className="circle">
                    <h4>
                        {this.state.tempDonation}
                    </h4>
                </div>

                <Swipeable onTap={this.makeBid}>
                    {/*<div>*/}
                        <div ref="bidBTN" className="base" onClick={this.state.makeBid}> <span>הצע ביד</span> </div>
                    {/*</div>*/}
                </Swipeable>
                <Tetris />
            </div>
        )
    }


}

export default Auction;
