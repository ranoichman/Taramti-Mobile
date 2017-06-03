import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import Auction from '../Home/Auction';
import AuctionInfo from './AuctionInfo';
import AuctionFAQ from './AuctionFAQ';
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import Tetris from '../Tetris';

//constants 
import { successMSG, failedMSG, notEnoughtMSG, errorMSG } from '../../constants/messages';
import { auctionWS } from '../../constants/general';

class ParticipateAuction extends Component {


    constructor(props) {
        super(props);
        const par = JSON.parse(localStorage.getItem("aucData"));
        this.state = {
            infoModalIsOpen: false,
            fAQModalIsOpen: false,
            msg_ModalIsOpen: false,
            borderColor: "red",
            msgClass: "box notEnough",
            shownMessage: "",
            tempDonation: "",
            // auc data
            auc: {
                code: par.props.code,
                price: par.price,
                endDate: par.props.endDate,
                percentage: par.props.percentage,
                prodCode: par.props.prodCode,
                prodName: par.props.prodName,
                prodDesc: par.props.prodDesc,
                imgArr: par.props.imgArr
                
            }
        }
        this.openMSGModal = this.openMSGModal.bind(this);
        this.closeMSGModal = this.closeMSGModal.bind(this);
        this.congratulateSeller = this.congratulateSeller.bind(this);
        this.openInfoModal = this.openInfoModal.bind(this);
        this.closeInfoModal = this.closeInfoModal.bind(this);
        this.openFAQModal = this.openFAQModal.bind(this);
        this.closeFAQModal = this.closeFAQModal.bind(this);
        this.makeBid = this.makeBid.bind(this);
        this.timerFinishedAuc = this.timerFinishedAuc.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
    }



    componentDidMount() {
        // const par = this.props.match.params.end;
        // console.log(`end!!!! ${par}`);
        // const aucCode = this.props.match.params.code;
        // var auc = { AuctionID: aucCode }
        // const self = this;
        // //fetch data from server by auction code  
        // axios.post(auctionWS + 'GetAuctionByCode', {
        //     auc
        // }).then(function (response) {
        //     let res = JSON.parse(response.data.d);
        //     self.setState({ auc: res });
        // });

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
                    let tempObj = self.state.auc;
                    tempObj.price = ans;
                    self.setState({ auc: tempObj });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //#region modal methods
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
    //#endregion modal methods

    //disable input and button
    timerFinishedAuc() {
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
    calcDonation() {
        let tempPrice = this.state.auc.price;
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
            tempDonation: `כבר ${Math.floor(tempPrice * this.state.auc.percentage / 100)} ש"ח לתרומה`
        });

    }

    //send bid to db
    makeBid() {
        if (this.state.borderColor !== "red") {
            let val = this.refs.newPrice.value;
            self = this;
            //db call!!
            axios.post(auctionWS + 'OfferBid', {
                auc: self.state.auc.code,
                bid: val,
                buyer: buyerID
            })
                .then(function (response) {
                    let ans = response.data.d;
                    if (ans === true) {
                        self.setState({
                            msgClass: "box success",
                            shownMessage: successMSG
                        })
                    }
                    else {
                        self.setState({
                            msgClass: "box failure",
                            shownMessage: failedMSG
                        })
                    }
                    self.setState({ msg_ModalIsOpen: true });
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
            this.openMSGModal();
        }
        //console.log(`make bid price: ${val}`)

    }


    render() {
        return (
            <div>

                {/*home page fixed circle*/}
                <Link to="/">
                    <div id="fixedCircle">
                        <div> <a>
                            <i className="fa fa-circle-o fa-5x" aria-hidden="true"></i></a></div>
                    </div>
                    <div id="fixedHome">
                        <div> <a><FontAwesome name='home' className="fa-3x" tag="i" />
                        </a></div>
                    </div>
                </Link>

                {/*shown messegae*/}
                <Modal
                    isOpen={this.state.msg_ModalIsOpen}
                    
                    contentLabel="open info"
                    className={this.state.msgClass}>
                    <Swipeable onTap={this.closeMSGModal}>
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
                    <Swipeable onTap={this.openInfoModal}>
                        <FontAwesome name='info-circle' border={true} className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.infoModalIsOpen}
                            
                            contentLabel="open info"
                            className="box">
                            <AuctionInfo closeModal={this.closeInfoModal} auc={this.state.auc} />
                        </Modal>
                    </Swipeable>

                    {/*FAQ modal*/}
                    <Swipeable onTap={this.openFAQModal}>
                        <FontAwesome name='question-circle' border={true} className="fa-3x" tag="i" />
                        <Modal
                            isOpen={this.state.fAQModalIsOpen}
                            
                            contentLabel="open FAQ"
                            className="FAQbox">
                            <AuctionFAQ closeModal={this.closeFAQModal} prodCode={this.state.auc.prodCode} />
                        </Modal>
                    </Swipeable>
                </div>

                {/*price manipulation*/}
                <input type="number" ref="newPrice" onChange={this.calcDonation} style={{ borderColor: this.state.borderColor }} />
                <div className="circle">
                    <h4>
                        {this.state.tempDonation}
                    </h4>
                </div>

                <Swipeable onTap={this.makeBid}>
                    <div ref="makeBidBTN" className="base"> <span>הצע ביד</span> </div>
                </Swipeable>
                <Tetris />
            </div>
        );
    }
}

export default ParticipateAuction;