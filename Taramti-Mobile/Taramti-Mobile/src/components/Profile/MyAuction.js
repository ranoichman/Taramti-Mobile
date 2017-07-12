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
        this.timerFinishedAuc = this.timerFinishedAuc.bind(this);
        this.calcDonation = this.calcDonation.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
        this.addQuestion = this.addQuestion.bind(this);

        this.infoModalChanged = this.infoModalChanged.bind(this);
        this.FAQModalChanged = this.FAQModalChanged.bind(this);
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

        // const customStyles = {
        //     content: {
        //         webkitAnimation: "zoomInRight 1s both",
        //         animation: "zoomInRight 1s both"

        //     }
        // };

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
                        <PriceTag price={this.state.auc.price} modalIsOpen={this.state.fAQModalIsOpen || this.state.infoModalIsOpen} />
                    </div>
                    <div className="circle" style={{ top: "5px", position: "absolute", left: `${this.state.width - 105}px` }}>
                        <h4>
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


            </div>
        );
    }
}

export default MyAuction;