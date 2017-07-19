import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
// import Auction from '../Home/Auction';
import AuctionInfo from './AuctionInfo';
import AuctionFAQ from './AuctionFAQ';
import Balloon from './Balloon';
import Tip from './Tip';
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import CircleButton from '../Generic/CircleButton';

import '../../css/balloon.css';

//constants 
import { successMSG, failedMSG, notEnoughtMSG, errorMSG } from '../../constants/messages';
import { auctionWS, buyerID } from '../../constants/general';

class ParticipateAuction extends Component {


    constructor(props) {
        super(props);
        const par = JSON.parse(localStorage.getItem("aucData"));
        this.state = {
            infoModalIsOpen: false,
            fAQModalIsOpen: false,
            msg_ModalIsOpen: false,
            tipModalIsOpen: false,
            borderColor: "red",
            msgClass: "box notEnough",
            shownMessage: "",
            tempDonation: "",
            tip: 0,
            offered: 0,
            curIndex: 0,
            formerIndex: 0,
            anim: "0", // determine anim: 0-reg, 1-float to top 2-blow down the balloon 

            // auc data
            auc: {
                code: par.props.auc.code,
                price: par.price,
                endDate: par.props.auc.endDate,
                percentage: par.props.auc.percentage,
                prodCode: par.props.auc.prodCode,
                prodName: par.props.auc.prodName,
                prodDesc: par.props.auc.prodDesc,
                finished: false,
                imgArr: par.props.auc.imgArr
            }
        }
        // this.openMSGModal = this.openMSGModal.bind(this);
        // this.closeMSGModal = this.closeMSGModal.bind(this);

        this.infoModalChanged = this.infoModalChanged.bind(this);
        this.FAQModalChannged = this.FAQModalChannged.bind(this);
        this.MSGModalChanged = this.MSGModalChanged.bind(this);
        this.tipModalChanged = this.tipModalChanged.bind(this);
        this.congratulateSeller = this.congratulateSeller.bind(this);
        this.makeBid = this.makeBid.bind(this);
        this.timerFinishedAuc = this.timerFinishedAuc.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
        this.addToWatch = this.addToWatch.bind(this);
        this.updateWatch = this.updateWatch.bind(this);
        this.deleteOffer = this.deleteOffer.bind(this);
        this.changeTip = this.changeTip.bind(this);
        this.stopChangeTip = this.stopChangeTip.bind(this);
    }

    componentDidMount() {
        this.addToWatch()
        this.calcDonation(-5);
        this.loadInterval = setInterval(this.getCurPrice, 5000);
        this.tipInterval = setInterval(this.changeTip, 3150);
        setTimeout(this.tipModalChanged, 700);
        setTimeout(this.stopChangeTip, 100000);
    }

    componentWillUnmount() {
        this.updateWatch()

        //clear interval!!!
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;

        this.tipInterval && clearInterval(this.tipInterval);
        this.tipInterval = false;
    }

    getCurPrice() {
        const self = this;
        axios.post(auctionWS + 'GetAuctionPrice', {
            auctionCode: self.state.auc.code
        })
            .then(function (response) {
                let ans = response.data.d;
                if (ans !== "-1") {
                    let tempObj = self.state.auc;
                    tempObj["price"] = ans;
                    self.setState({ auc: tempObj });
                    self.calcDonation(-1);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /*
   ***************
      INFO MODAL
   ***************
   */
    infoModalChanged() {
        let newstatus = !this.state.infoModalIsOpen
        this.setState({ infoModalIsOpen: newstatus });
    }

    /*
       ***************
          FAQ MODAL
       ***************
    */
    FAQModalChannged() {
        let newstatus = !this.state.fAQModalIsOpen
        this.setState({ fAQModalIsOpen: newstatus });
    }

    /*
       ***************
          MSG MODAL
       ***************
    */
    MSGModalChanged() {
        let newstatus = !this.state.msg_ModalIsOpen
        this.setState({ msg_ModalIsOpen: newstatus });
    }
    /*
       ***************
          MSG MODAL
       ***************
    */
    tipModalChanged() {
        let newstatus = !this.state.tipModalIsOpen
        this.setState({ tipModalIsOpen: newstatus });
    }

    //disable input and button
    timerFinishedAuc() {
        let tempObj = this.state.auc;
        tempObj["finished"] = true;
        this.setState({ auc: tempObj });
        const self = this;
        axios.post(auctionWS + 'GetAuctionPrice', {
            auctionCode: self.props.params.code
        })
            .then(function (response) {
                let ans = response.this.d;
                if (ans !== "-1") {
                    self.congratulateSeller();
                    self.openMSGModal();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //display a congratulate message to the seller when the auction is finished
    congratulateSeller() {
        this.setState({
            shownMessage: `מזל טוב!
        המכרז על ${this.state.auc.prodName} הסתיים בהצלחה בסכום של ${this.state.auc.price} ש"ח מתוכם ${this.state.auc.price * this.state.auc.percentage / 100} ש"ח הולכים לתרומה ו${this.state.auc.price * (100 - this.state.auc.percentage) / 100} ש"ח אליך! 
        כעת, כל מה שנותר הוא לחכות שהקונה יבצע את התשלום ולאחר מכן פרטיכם יועברו.
        `});
    }

    //calculate donation amount to insert to circle
    // newP: -1 if comes from getCurPrice()
    //       -5 if input is empty
    //        else offered price from balloon input
    calcDonation(newP) {
        let tempPrice = parseInt(this.state.auc.price);
        let i = this.state.curIndex;
        let val = newP;
        if (newP != -1) {
            this.setState({
                borderColor: "red"
            });

            if (newP != -5) {
                this.setState({ offered: newP });
            }

            let val = newP != -1 ? newP : 0;
            // let val = parseInt(this.refs.newPrice.value);
            //console.log(`price: ${tempPrice},  new price: ${val}`)
            if (val > tempPrice) {
                tempPrice = val;
                this.setState({
                    curIndex: 3,
                    formerIndex: i,
                    borderColor: "green"
                });
            }
            else {
                if (val >= tempPrice * 0.6) {
                    this.setState({
                        curIndex: 2,
                        formerIndex: i
                    });
                } else if (val >= tempPrice * 0.15) {
                    this.setState({
                        curIndex: 1,
                        formerIndex: i
                    });
                }
                else {
                    this.setState({
                        curIndex: 0,
                        formerIndex: i
                    });
                }
            }
            this.setState({
                tempDonation: `כבר ${Math.floor(tempPrice * this.state.auc.percentage / 100)} ש"ח לתרומה`
            });
        }
        // else{
        //     this.setState({
        //         tempDonation: `כבר ${Math.floor(tempPrice * this.state.auc.percentage / 100)} ש"ח לתרומה`
        //     });
        // }
    }

    //send bid to db
    makeBid() {
        if (this.state.borderColor !== "red") {
            const currentAuc = this.state.auc;

            let val = parseInt(this.refs.newPrice.value);

            let buyer = { UserId: buyerID }
            let auc = { AuctionID: currentAuc.code, Buyer: buyer, ProdName: currentAuc.prodName }

            self = this;

            //db call!!
            axios.post(auctionWS + 'OfferBid', {
                auc: auc,
                bid: val,
            })
                .then(function (response) {
                    let ans = response.data.d;
                    if (ans === true) {
                        self.setState({
                            msgClass: "box success",
                            anim: "1",
                            shownMessage: successMSG
                        })

                        //stop fireworks and bring baloon back
                        setTimeout(() => self.setState({ anim: "0" }), 4500)
                    }
                    else {
                        self.setState({
                            msgClass: "box failure",
                            shownMessage: failedMSG,
                            anim: "2"
                        })
                        setTimeout(() => self.setState({ anim: "0" }), 1500)
                    }
                    //self.setState({ msg_ModalIsOpen: true });
                })
                .catch(function (error) {
                    console.log(error);
                    self.setState({
                        msgClass: "box failure",
                        shownMessage: errorMSG,
                        msg_ModalIsOpen: true
                    })
                });
        }
        else {
            console.log("לא מספיק כסף!!!!!");
            this.setState({
                msgClass: "box notEnough",
                shownMessage: notEnoughtMSG
            });
            this.MSGModalChanged();
        }
        //console.log(`make bid price: ${val}`)

    }

    addToWatch() {
        let user = { UserId: buyerID };
        let auc = {
            AuctionID: this.state.auc.code,
            Buyer: user
        };
        this.enter = Date.now();

        axios.post(auctionWS + 'AddToWatch_Log', {
            auc: auc, enter: parseInt(this.enter)
        })
            .then(function (response) {
                let ans = response.data.d;
                console.log(`add to watch - ${ans}`)
                if (ans != 1) {
                    //add to local storage
                }
            })
            .catch(function (error) {
                console.log(error);
                //add to local storage
            });
    }

    updateWatch() {
        let user = { UserId: buyerID };
        let auc = {
            AuctionID: this.state.auc.code,
            Buyer: user
        };
        this.leave = Date.now();

        axios.post(auctionWS + 'UpdateWatch_Log', {
            auc: auc, enter: parseInt(this.enter), leave: parseInt(this.leave)
        })
            .then(function (response) {
                let ans = response.data.d;
                console.log(`add to watch - ${ans}`)
                if (ans != 1) {
                    //add to local storage
                }
            })
            .catch(function (error) {
                console.log(error);
                //add to local storage
            });
    }

    deleteOffer() {
        this.setState({ anim: "2" });
        setTimeout(() => this.setState({ anim: "0" }), 1500)
    }

    changeTip() {
        let rnd = Math.floor(Math.random() * 3)
        if (rnd != this.state.tip) {
            this.setState({ tip: rnd });
        } else {
            this.changeTip();
        }
    }

    stopChangeTip() {
        this.tipInterval && clearInterval(this.tipInterval);
        this.tipInterval = false;
        this.setState({
            tip: -1
        });
    }

    render() {

        return (
            <div className="pageBC" style={{ minHeight: window.innerHeight, paddingTop: "10px", paddingRight: "5px" }}>

                {/*shown messegae*/}
                <Modal
                    isOpen={this.state.msg_ModalIsOpen}

                    contentLabel="open info"
                    className={this.state.msgClass}>
                    <Swipeable onTap={this.MSGModalChanged}>
                        <a className="boxclose"></a>
                    </Swipeable>
                    <h3>{this.state.shownMessage}</h3>
                </Modal>

                {/*basic info*/}
                <div className="basicInfo">
                    {/*timer Component*/}
                    <div className="time">
                        <Timer endDate={this.state.auc.endDate} timerFinished={this.timerFinishedAuc} />
                    </div>

                    {/*info modal*/}
                    <Swipeable onTap={this.infoModalChanged}>
                        <div className="icon_container" style={{ right: "5px" }}>
                            <div id="faqIcon">
                                <img src="images/attention1600.png" />
                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.infoModalIsOpen}
                            contentLabel="open info"
                            className="zoomInRight">
                            <AuctionInfo modal={true} closeModal={this.infoModalChanged} auc={this.state.auc} />
                        </Modal>
                    </Swipeable>

                    {/*FAQ modal*/}
                    <Swipeable onTap={this.FAQModalChannged}>
                        <div className="icon_container" style={{ right: "80px" }}>
                            <div id="faqIcon">
                                <img src="images/question_mark1600.png" />
                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.fAQModalIsOpen}
                            contentLabel="open FAQ"
                            className="zoomInRight">
                            <AuctionFAQ closeModal={this.FAQModalChannged} prodCode={this.state.auc.prodCode} chat={true} />
                        </Modal>
                    </Swipeable>
                </div>

                {/*price manipulation*/}
                <div className="circle">
                    <h4>
                        {this.state.tempDonation}
                    </h4>
                </div>

                <Swipeable onSwipedUp={this.makeBid} onSwipedDown={this.deleteOffer} onTap={this.stopChangeTip}>
                    <div style={{height:"250px", width:"50%"}}>
                    <Balloon curIndex={this.state.curIndex} formerIndex={this.state.formerIndex} anim={this.state.anim} price={this.state.auc.price} calc={this.calcDonation} />
                    </div>
                </Swipeable>

                {/*fireworks*/}
                <div className="pyro" style={this.state.anim === "1" ? { display: "block" } : { display: "none" }}>
                    <div className="before"></div>
                    <div className="after"></div>
                </div>

                {/*home page fixed circle*/}
                <CircleButton home={true} />

                {/* tip modal */}
                <Modal
                    isOpen={this.state.tipModalIsOpen}
                    contentLabel="open info"
                    className="zoomIn">
                    <Tip closeModal={this.tipModalChanged} height={window.innerHeight} />

                </Modal>




            </div>
        );
    }
}

export default ParticipateAuction;