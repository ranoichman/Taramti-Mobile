import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import ChatMsg from '../Generic/ChatMsg';
import PriceTag from '../Generic/PriceTag';
import AuctionInfo from '../ParticipateAuction/AuctionInfo';
import AuctionFAQ from '../ParticipateAuction/AuctionFAQ';

import '../../css/balloon.css';

//constants 
import { successMSG, failedMSG, notEnoughtMSG, errorMSG } from '../../constants/messages';
import { auctionWS, buyerID } from '../../constants/general';

class MyAuction extends Component {


    constructor(props) {
        super(props);
        const par = JSON.parse(localStorage.getItem("aucData"));
        this.state = {
            infoModalIsOpen: false,
            fAQModalIsOpen: false,
            FAQs: [],
            tempDonation: "",
            width: null,
            
            // auc data
            auc: {
                code: par.props.code,
                price: par.price,
                endDate: par.props.endDate,
                percentage: par.props.percentage,
                prodCode: par.props.prodCode,
                prodName: par.props.prodName,
                prodDesc: par.props.prodDesc,
                finished: false,
                imgArr: par.props.imgArr
            }
        }
        this.timerFinishedAuc = this.timerFinishedAuc.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);

        this.openInfoModal = this.openInfoModal.bind(this);
        this.closeInfoModal = this.closeInfoModal.bind(this);
        this.openFAQModal = this.openFAQModal.bind(this);
        this.closeFAQModal = this.closeFAQModal.bind(this);
    }

    componentDidMount() {
        //set correct width
        const width = this.refs.infoDiv.clientWidth;
        this.setState({ width });

        //calculate amount to donation
        this.calcDonation();

        //get current price every 5 sec
        this.loadInterval = setInterval(this.getCurPrice, 5000);

        //get questions from db
        let product = { ItemId: this.state.auc.prodCode }
        const self = this;
        axios.post(auctionWS + 'GetAllQuestions', {
            prod: product
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            // res.map(self.addAuction);
            self.setState({ FAQs: res })
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        //clear interval!!!
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }


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
                    self.calcDonation();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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
                    // self.congratulateSeller();
                    self.openMSGModal();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //calculate donation amount to insert to circle
    calcDonation() {
        let tempPrice = parseInt(this.state.auc.price);
        let i = this.state.curIndex;

        if (this.refs.newPrice !== undefined) {
            this.setState({
                borderColor: "red"
            });

            let val = parseInt(this.refs.newPrice.value);
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
        }
        this.setState({
            tempDonation: `כבר ${Math.floor(tempPrice * this.state.auc.percentage / 100)} ש"ח לתרומה`
        });

    }


    render() {

        const customStyles = {
            content: {
                webkitAnimation: "zoomInRight 1s both",
                animation: "zoomInRight 1s both"

            }
        };

        return (
            <div>

                {/*home page fixed circle*/}
                <Link to="/">
                    <div id="fixedCircle">
                        <div>
                            <a>
                                <i className="fa fa-circle-o fa-5x" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div id="fixedHome">
                        <div>
                            <a>
                                <FontAwesome name='home' className="fa-3x" tag="i" />
                            </a>
                        </div>
                    </div>
                </Link>

                {/*basic info*/}
                <div className="basicInfo" ref="infoDiv">
                    {/*timer Component*/}
                    <div className="time">
                        <Timer endDate={this.state.auc.endDate} timerFinished={this.timerFinishedAuc} />
                    </div>
                    {/*price manipulation*/}
                    <div style={{ position: "absolute", width: "20%", margin: "80px 40%" }}>
                        <PriceTag price={this.state.auc.price} />
                    </div>
                    <div className="circle" style={{ top: "5px", position: "absolute", left: `${this.state.width - 105}px` }}>
                        <h4>
                            {this.state.tempDonation}
                        </h4>
                    </div>
                </div>

                <div>
                    <div className="myAuction" style={{ width: "35%", float: "left" }} onClick={() => this.setState({ fAQModalIsOpen: true })}>
                        <ChatMsg FAQs={this.state.FAQs} disabled="false" />
                    </div>

                    <div className="myAuction" style={{ width: "50%", float: "right" }} onClick={() => this.setState({ infoModalIsOpen: true })}>
                        <AuctionInfo modal={false} auc={this.state.auc} />
                    </div>
                </div>

                {/*info modal*/}
                <Swipeable onTap={this.openInfoModal}>
                    <Modal
                        isOpen={this.state.infoModalIsOpen}
                        contentLabel="open info"
                        className="zoomInRight"
                    >
                        <AuctionInfo modal={true} closeModal={this.closeInfoModal} auc={this.state.auc} />
                    </Modal>
                </Swipeable>

                {/*FAQ modal*/}
                <Swipeable onTap={this.openFAQModal}>
                    <Modal
                        isOpen={this.state.fAQModalIsOpen}
                        contentLabel="open FAQ"
                        className="zoomInLeft">
                        <AuctionFAQ closeModal={this.closeFAQModal} prodCode={this.state.auc.prodCode} chat={false} />
                    </Modal>
                </Swipeable>

            </div>
        );
    }
}

export default MyAuction;