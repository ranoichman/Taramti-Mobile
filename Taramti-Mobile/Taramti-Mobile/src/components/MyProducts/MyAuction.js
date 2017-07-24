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
import CircleButton from '../Generic/CircleButton';

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
                code: par.props.auc.code,
                price: par.price,
                endDate: par.props.auc.endDate,
                percentage: par.props.auc.percentage,
                prodCode: par.props.auc.prodCode,
                prodName: par.props.auc.prodName,
                prodDesc: par.props.auc.prodDesc,
                imgArr: par.props.auc.imgArr
            }
        }
        this.getCurPrice = this.getCurPrice.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.infoModalChanged = this.infoModalChanged.bind(this);
        this.FAQModalChanged = this.FAQModalChanged.bind(this);
    }

    componentDidMount() {
        //set correct width
        const width = this.refs.infoDiv.clientWidth;
        this.setState({ width });

        //get current price every 5 sec
        this.loadInterval = setInterval(this.getCurPrice, 5000);
        this.calcDonation();

        //get questions from db
        let product = { ItemId: this.state.auc.prodCode }
        const self = this;
        axios.post(auctionWS + 'GetAllQuestions', {
            prod: product
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            res.map(self.addQuestion);
            //self.setState({ FAQs: res })
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

    addQuestion(faq) {
        if (faq.Answer == "") {
            let tempFAQS = this.state.FAQs;
            tempFAQS.push(faq)
            this.setState({ FAQs: tempFAQS });
        }
    }

    //INFO MODAL
    infoModalChanged() {
        let newStatus = !this.state.infoModalIsOpen
        this.setState({ infoModalIsOpen: newStatus })
    }

    //FAQ MODAL
    FAQModalChanged() {
        let newStatus = !this.state.fAQModalIsOpen
        this.setState({ fAQModalIsOpen: newStatus })
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

    //calculate donation amount to insert to circle
    calcDonation() {
        let tempPrice = parseInt(this.state.auc.price);

        this.setState({
            tempDonation: `מחיר נוכחי ${tempPrice} ש"ח \nכבר ${Math.floor(tempPrice * this.state.auc.percentage / 100)} ש"ח לתרומה`
        });

    }

    render() {
        return (
            <div className="pageBC" style={{ minHeight: `${window.innerHeight + 25}px`, width: window.innerWidth, paddingTop: "10px", paddingRight: "5px", paddingLeft: "5px" }}>

                {/*basic info*/}
                <div className="basicInfo" ref="infoDiv">
                    {/*timer Component*/}
                    <div className="time">
                        <Timer endDate={this.state.auc.endDate} />
                    </div>
                    {/*price manipulation*/}
                    <div style={{ top: "13px", position: "absolute", left: `${this.state.width - 55}px` }}>
                        <PriceTag price={this.state.auc.price} modalIsOpen={this.state.fAQModalIsOpen || this.state.infoModalIsOpen} />
                    </div>
                    <div className="circle" style={{ position: "absolute", marginTop: "80px" }}>
                        <h3>מכרז על {this.state.auc.prodName}</h3>
                    <h4 style={{whiteSpace: "pre-line"}}>
                        {this.state.tempDonation}
                    </h4>
                    </div>
                </div>

                <div>
                    <div className="myAuction" style={{ width: "35%", float: "left" }} onClick={this.FAQModalChanged}>
                        <h4 style={{ textAlign: "center" }}>שאלות חדשות</h4>
                        <ChatMsg FAQs={this.state.FAQs} disabled={true} />
                    </div>

                    <div className="myAuction" style={{ width: "50%", float: "right" }} onClick={this.infoModalChanged}>
                        <AuctionInfo modal={false} auc={this.state.auc} />
                    </div>

                </div>
                <CircleButton back={true} />

                {/*info modal*/}
                <Modal
                    isOpen={this.state.infoModalIsOpen}
                    contentLabel="open info"
                    className="zoomInRight">
                    <AuctionInfo modal={true} closeModal={this.infoModalChanged} auc={this.state.auc} />
                </Modal>

                {/*FAQ modal*/}
                <Modal
                    isOpen={this.state.fAQModalIsOpen}
                    contentLabel="open FAQ"
                    className="zoomInLeft">
                    <AuctionFAQ closeModal={this.FAQModalChanged} prodCode={this.state.auc.prodCode} chat={false} />
                </Modal>

                {/*home page fixed circle*/}
                <CircleButton home={true} />
            </div>
        );
    }
}

export default MyAuction;