import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';


// taramti babait components
import Auction from '../Home/Auction';
import AuctionInfo from './AuctionInfo';
import AuctionFAQ from './AuctionFAQ';
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import Tetris from '../Tetris';

//constants 
import { successMSG, failedMSG, notEnoughtMSG, errorMSG } from '../../constants/messages';

class ParticipateAuction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoModalIsOpen: false,
            fAQModalIsOpen: false,
            msg_ModalIsOpen: false,
            borderColor: "red",
            msgClass: "box notEnough",
            shownMessage: "",
            price: this.props.price,
            tempDonation: ""
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
    }

    componentDidMount() {

        this.calcDonation();
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
        המכרז על ${this.props.prodName} הסתיים בהצלחה בסכום של ${this.state.price} ש"ח מתוכם ${this.state.price * this.props.percentage / 100} ש"ח הולכים לתרומה ו${this.state.price * (100 - this.props.percentage) / 100} ש"ח אליך! 
        כעת, כל מה שנותר הוא לחכות שהקונה יבצע את התשלום ולאחר מכן פרטיכם יועברו.
        `});
    }

    //calculate donation amount to insert to circle
    calcDonation() {
        let tempPrice = this.state.price;
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
            tempDonation: `כבר ${Math.floor(tempPrice * this.props.percentage / 100)} ש"ח לתרומה`
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
                    onRequestClose={this.closeMSGModal}
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
                                price={this.state.price} endDate={this.props.endDate}
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
                    <div ref="makeBidBTN" className="base"> <span>הצע ביד</span> </div>
                </Swipeable>
                <Tetris />
            </div>
        );
    }
}

export default ParticipateAuction;