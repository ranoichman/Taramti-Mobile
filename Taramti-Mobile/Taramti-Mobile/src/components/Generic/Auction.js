//npm components
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// BID IT components
import PriceTag from '../Generic/PriceTag';
import Timer from '../Generic/Timer';
import Pic from '../Generic/Pic';
import ParticipateAuction from '../ParticipateAuction/ParticipateAuction';
import RePublish from '../MyProducts/RePublish';

//constants 
import { auctionWS, buyerID } from '../../constants/general';

//style
import '../../css/bootstrap.css';
import '../../css/auction.css';
import '../../css/modal.css';
import '../../css/transition.css';

class Auction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reDirect: false,
            sold: false,
            finished: false,
            price: this.props.auc.price,
            rePublishModalIsOpen: false

        };
        this.timerFinishedHome = this.timerFinishedHome.bind(this);
        this.getCurPrice = this.getCurPrice.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.rePublishModalChanged = this.rePublishModalChanged.bind(this);
    }

    componentDidMount() {
        //if product is sold display sold stamp and dont show participate button
        if (this.props.auc.buyer != null) {
            setTimeout(() => this.setState({ sold: true }), 250)
        }
        //signal home component that finished rendering
        this.props.handleLoad();
        //get current price from db every 5s
        this.loadInterval = setInterval(this.getCurPrice, 5000);
    }

    componentWillUnmount() {
        //clear interval!!!
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    //updates price from db
    getCurPrice() {
        const self = this;
        axios.post(auctionWS + 'GetAuctionPrice', {
            auctionCode: self.props.auc.code
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

    //re-publish modal is changed 
    rePublishModalChanged(finished) {
        let newStatus = !this.state.rePublishModalIsOpen;
        this.setState({ rePublishModalIsOpen: newStatus })
        this.props.modalChanged(); // update parent
        if (finished) {
            this.props.rePublish();
        }
        
    }

    timerFinishedHome() {
        this.setState({ finished: true });
        if (this.props.auctionfinished !== 'undefined') {
            this.props.auctionfinished(this.props.index);
        }
    }

    //handle button clicked 
    buttonClicked() {
        if (this.state.finished) {
            this.rePublishModalChanged(); //open re-publish modal
        } else {
            localStorage.setItem("aucData", JSON.stringify({ props: this.props, price: this.state.price }));
            this.setState({ reDirect: true }); //send to different page
        }
    }

    render() {
        if (this.state.reDirect) {
            if (this.props.mine) {
                return <Redirect push to="/myAuction" />
            } else {
                return <Redirect push to="/participate" />
            }

        }
        // handle displayed button text
        let buttonText = "השתתפות במכרז";
        if (this.props.mine) {
            if (this.state.finished) {
                buttonText = "פרסום מחדש";
            } else {
                buttonText = "צפייה במכרז";
            }
        }

        return (
            <div className="row" style={{width:window.innerWidth}}>
                {/*sold stamp*/}
                {this.props.auc.buyer != null ?
                    <div className={this.state.sold ? "sold stamp" : "stamp"} style={{ zIndex: !this.state.sold ? -5 : (this.props.modalIsOpen ? 0 : 1) }}>
                        !נמכר</div> : null}

                <div className="col-xs-6 imgContainer">

                    <PriceTag key={`.$${this.props.index}`} index={this.props.index} price={this.state.price} modalIsOpen={this.props.modalIsOpen || this.state.rePublishModalIsOpen} />

                    <Pic key={this.key} imagesArr={this.props.auc.imgArr} picModalChanged={this.props.modalChanged} />

                </div>
                <div className="col-xs-6" dir="rtl">
                    <div>
                        <Timer endDate={this.props.auc.endDate} timerFinished={this.timerFinishedHome} />
                        <h4 className="text-center">{this.props.auc.prodName}</h4>
                        <p className="descPar">{this.props.auc.prodDesc}</p>
                        <br />
                        <h5 style={{ float: "right", display: "inline" }}><span style={{ fontWeight: "bold" }}>מיקום: </span>{this.props.auc.city.CityName}</h5>

                        {this.state.sold ? "" : <button ref="bidBTN" className="btn-l btn-10 ui-btn ui-shadow ui-corner-all" onClick={this.buttonClicked} style={{width:"inherit", padding:".5em 1em"}}> {buttonText}  </button>}
                    </div>

                </div>

                <Modal
                    isOpen={this.state.rePublishModalIsOpen}
                    contentLabel="open info"
                    className="zoomIn">
                    
                    <RePublish closeModal={this.rePublishModalChanged} prodCode={this.props.auc.prodCode}/>
                </Modal>

            </div>

        )
    }

}

export default Auction;
