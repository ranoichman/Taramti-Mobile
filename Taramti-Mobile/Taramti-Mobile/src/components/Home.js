import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

import Auction from './Auction';
import Search from './Search';
import TaramtiMenu from './TaramtiMenu'


//import '../css/jqmCss.css';
//import '../../www/css/StyleSheet.css';

const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchModalIsOpen: false,
            auctionsArr: this.props.auctionsArr
        }
        this.openSearchModal = this.openSearchModal.bind(this);
        this.closeSearchModal = this.closeSearchModal.bind(this);
        this.searchTriggered = this.searchTriggered.bind(this);
        this.getAuctionsByParams = this.getAuctionsByParams.bind(this);
        this.addAuction = this.addAuction.bind(this);
        this.eachAuction = this.eachAuction.bind(this);
        this.offerBid = this.offerBid.bind(this);
        this.deleteAuction = this.deleteAuction.bind(this);
        this.moveToAddAuction = this.moveToAddAuction.bind(this);
    }

    openSearchModal() {
        this.setState({ searchModalIsOpen: true })
    }

    closeSearchModal() {
        this.setState({ searchModalIsOpen: false })
    }

    searchTriggered(cities, lowPrice, highPrice, catCode) {
        //console.log(`entered search on ----- ${Date.now()}`)
        this.setState({ auctionsArr: [] });
        this.getAuctionsByParams(cities, lowPrice, highPrice, catCode);
    }

    //call function to get auctions from serveer
    getAuctionsByParams(cities, lowPrice, highPrice, catCode) {
        const self = this;
        this.setState({ searchModalIsOpen: false });
        axios.post(auctionWS + 'GetAuctionByParam', {
            cities: cities,
            lowPrice: lowPrice,
            highPrice: highPrice,
            catCode: catCode
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            res.map(self.addAuction);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    //add auction from server to array
    addAuction(item, i) {
        let arr = this.state.auctionsArr;
        let newAuction = {
            code: item.AuctionID,
            endDate: item.End_Date,
            price: item.Price,
            percentage: item.Percentage,
            prodName: item.ProdName,
            prodDesc: item.ProdDesc,
            imgArr: item.Images,
        }
        arr.push(newAuction);
        this.setState({ auctionsArr: arr });

    }

    //function that returns a render of 1 auction
    eachAuction(item, i) {
        return <Auction key={i} index={i} auctionfinished={this.deleteAuction} offerBid={this.offerBid}
            home="true" imgArr={item.imgArr} prodName={item.prodName} prodDesc={item.prodDesc}
            price={item.price} endDate={item.endDate} code={item.code}
            percentage={item.percentage} />
    }

    //remove finished auction from displayed array
    deleteAuction(i) {
        // console.log(`delete: ${i} --- ${this.state.auctionsArr[i]} `)
        var arr = this.state.auctionsArr;
        arr.splice(i, 1);
        this.setState({ auctionsArr: arr });
        this.state.auctionsArr.map(function (item, i) { console.log(i + "____" + item.endDate + ":::::::" + item.price) })
    }

    offerBid(i) {
        this.props.offerBid(i);
    }

    moveToAddAuction() {
        location.href = 'AddingAuction-Taramti.html'
    }

    render() {
        return (
            <div>
                <div style={{ height: "74px", width: "100%" }} >
                </div>
                {/*menu*/}
                
                        <span id={"TaramtiMenuIconDiv"} style={{position: "absolute",top: "7px",right:"9px"}}>
                            <i id={"TaramtiMenuIcon"} className="fa fa-ellipsis-v fa-4x"></i>
                        </span>
                    
                    


                
                {/*<div style={{ height: "74px", width: "100%" }} >*/}
                    <img src={"img/smaller logo.JPG"} style={{ float: "left", marginLeft: "-2%", width: "80%",position: "absolute",top: "0",marginTop: "0",right: "30px" }} />
                         {/*</div>*/}

                {/*search icon*/}
                <Swipeable onTap={this.openSearchModal} className="search">
                    <FontAwesome name='search' border={false} className="fa-2x" tag="div" />
                    <Modal
                        isOpen={this.state.searchModalIsOpen}
                        onRequestClose={this.closeSearchModal}
                        contentLabel="open search``"
                        className="box" >
                        <Search closeModal={this.closeSearchModal} startSearch={this.searchTriggered} />
                    </Modal>
                </Swipeable>

                {/*auctions display*/}
                <div className="container-fluid">
                    {this.state.auctionsArr.map(this.eachAuction)}
                </div>

                {/*move to add auction*/}
                <div id="fixedPlus">
                    <a onClick={this.moveToAddAuction}><i className="fa fa-plus-circle fa-4x" aria-hidden="true"></i></a>
                </div>

            </div>
        );
    }
}

export default Home;