import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

import Auction from './Auction';
import Search from './Search';

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
    }


    openSearchModal() {
        this.setState({ searchModalIsOpen: true })
    }

    closeSearchModal() {
        this.setState({ searchModalIsOpen: false })
    }

    searchTriggered(cities, lowPrice, highPrice, catCode) {
        console.log(`entered search on ----- ${Date.now()}`)
        //this.setState({ auctionsArr: [] });
        //this.getAuctionsByParams(cities, lowPrice, highPrice, catCode);
    }

    //call function to get auctions from serveer
    getAuctionsByParams(cities, lowPrice, highPrice, catCode) {
        const self = this;
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
        console.log(`delete: ${i} --- ${this.state.auctionsArr[i]} `)
        var arr = this.state.auctionsArr;
        arr.splice(i, 1);
        this.setState({ auctionsArr: arr });
        this.state.auctionsArr.map(function(item,i){console.log(i + "____" +  item.endDate + ":::::::" + item.price)})
    }

    offerBid(i) {
        this.props.offerBid(i);
    }

    render() {
        return (
            <div>
                <Swipeable onTap={this.openSearchModal}>
                    <FontAwesome name='search' border="true" className="fa-3x" tag="div" />
                    <Modal
                        isOpen={this.state.searchModalIsOpen}
                        onRequestClose={this.closeSearchModal}
                        contentLabel="open search``"
                        className="box" >
                        <Search closeModal={this.closeSearchModal} startSearch={this.searchTriggered} />
                    </Modal>
                </Swipeable>
                <div className="container-fluid">
                    {this.state.auctionsArr.map(this.eachAuction)}
                </div>
            </div>
        );
    }
}

export default Home;