import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import Auction from '../Generic/Auction';
import Loader from '../Generic/Loader';
import ScrollButton from '../Generic/ScrollButton';

import '../../css/transition.css';

//constants 
import { auctionWS, buyerID } from '../../constants/general';

class ThemeAuctions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchModalIsOpen: false,
            modalIsOpen: false,
            auctionsArr: [],
            loaded: false,
            loadingCounter: 0
        }
        this.modalOpenedChanged = this.modalOpenedChanged.bind(this);
        this.getLeadingAuctions = this.getLeadingAuctions.bind(this);
        this.addAuction = this.addAuction.bind(this);
        this.eachAuction = this.eachAuction.bind(this);
        this.deleteAuction = this.deleteAuction.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.rePublish = this.rePublish.bind(this);
    }

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        this.getLeadingAuctions()
    }

    modalOpenedChanged() {
        let newStatus = !this.state.modalIsOpen;
        this.setState({ modalIsOpen: newStatus });
    }

    //call function to get auctions from serveer
    getLeadingAuctions() {
        //define "this" for inner functions
        const self = this;

        let funcName = ""
        switch (this.props.theme) {
            case "current":
                funcName = "Get_Current_LeadingAuctions"
                break;
            case "history":
                funcName = "Get_History_LeadingAuctions"
                break;
            case "myProducts":
                funcName = "GetAllMySells"
                break;
            case "outBID":
                funcName = "GetOutBiddedAuctions"
                break;
            case "":
                funcName = "Get_Current_LeadingAuctions"
                break;
            default:
                break;
        }
        console.log(funcName)
        //stop db access after 7s
        if (this.startTO == undefined) {
            this.startTO = setTimeout(() => {
                self.setState({ loaded: true })
                self.startTO = undefined;
            }, 7000)
        }
        const id = buyerID;
        // const id = parseInt(buyerID);
        axios.post(auctionWS + funcName, {
            user_Id: id
        }).then(function (response) {
            //clear TO when success
            clearTimeout(self.startTO);

            let res = JSON.parse(response.data.d);

            if (res.length == 0) {
                setTimeout(() => self.setState({ loaded: true }), 300)
            }

            res.map(self.addAuction);
        })
            .catch(function (error) {
                console.log(error);

                //access db again untill results arrive or TO expires
                if (self.startTO != undefined) {
                    self.getLeadingAuctions()
                }

            });
    }

    //add auction from server to array
    addAuction(item) {
        let arr = this.state.auctionsArr;
        let newAuction = {
            code: item.AuctionID,
            endDate: item.End_Date,
            price: item.Price,
            percentage: item.Percentage,
            prodCode: item.ItemCode,
            prodName: item.ProdName,
            prodDesc: item.ProdDesc,
            imgArr: item.Images,
            city: item.Location,
            buyer: item.Buyer
        }
        arr.push(newAuction);
        this.setState({ auctionsArr: arr });

    }

    //function that returns a render of 1 auction
    eachAuction(item, i) {
        return <Auction key={i} index={i} auctionfinished={this.deleteAuction} offerBid={this.offerBid} handleLoad={this.handleLoad} modalChanged={this.modalOpenedChanged}
            auc={item} mine={this.props.theme === "myProducts" ? true : false} modalIsOpen={this.state.modalIsOpen} rePublish={this.rePublish} />
    }

    //force update after seller re-publish product
    rePublish(){
        this.setState({auctionsArr:[]});
        this.getLeadingAuctions();
    }

    //remove finished auction from displayed array
    deleteAuction(i) {

        // var arr = this.state.auctionsArr;
        // arr.splice(i, 1);
        // this.setState({ auctionsArr: arr });
        // this.state.auctionsArr.map(function (item, i) { console.log(i + "____" + item.endDate + ":::::::" + item.price) })
    }

    handleLoad() {
        let couner = this.state.loadingCounter;
        couner++;
        if (couner == this.state.auctionsArr.length) {
            setTimeout(() => this.setState({ loaded: true }), 1000) // display loader 1 more sec 
        }
        else {
            this.setState({ loadingCounter: couner });
        }
    }

    render() {
        return (
            <div>
                {/*auctions display*/}
                <Loader loaded={this.state.loaded} loadingText={"...מחפש"}>
                    {this.state.auctionsArr.length == 0 ? <h1 style={{ textAlign: "center", marginTop: "40px", marginBottom: "200px" }}>אין מכרזים לתצוגה</h1> : ""}
                    <div className="container-fluid">
                        <CSSTransitionGroup
                            transitionName="auction"
                            transitionAppear={true}
                            transitionAppearTimeout={700}
                            transitionEnterTimeout={700}
                            transitionLeave={false}>
                            {this.state.auctionsArr.map(this.eachAuction)}
                        </CSSTransitionGroup>
                    </div>
                </Loader>
                <ScrollButton scrollStepInPx="30" delayInMs="16.66" />
            </div>
        );
    }
}

export default ThemeAuctions;