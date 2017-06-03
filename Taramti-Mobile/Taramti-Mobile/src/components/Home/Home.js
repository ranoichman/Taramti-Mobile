import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import Auction from './Auction';
import Search from './Search';
//import TaramtiMenu from './TaramtiMenu'


//import '../css/jqmCss.css';
//import '../../www/css/StyleSheet.css';

import { auctionWS, buyerID } from '../../constants/general';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchModalIsOpen: false,
            auctionsArr: []
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

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        this.getAuctionsByParams(-1, -1, 0, 0, 0, 0); //initial data will come from 
    }

    openSearchModal() {
        this.setState({ searchModalIsOpen: true })
    }

    closeSearchModal() {
        this.setState({ searchModalIsOpen: false })
    }

    searchTriggered(lowPrice, highPrice, catCode, coords, radius) {
        //console.log(`entered search on ----- ${Date.now()}`)
        this.setState({ auctionsArr: [] });
        this.getAuctionsByParams(lowPrice, highPrice, catCode, coords.lat, coords.lng, radius);
    }
    // lowPrice,highPrice,catCode,id,lat,lng,radius
    //call function to get auctions from serveer
    getAuctionsByParams(lowPrice, highPrice, catCode, lat, lng, radius) {
        const self = this;
        console.log(`buyerrrrrr ------- ${buyerID}`)
        const id = parseInt(buyerID);
        this.setState({ searchModalIsOpen: false });
        axios.post(auctionWS + 'GetAuctionByParam', {
            lowPrice: lowPrice,
            highPrice: highPrice,
            catCode: catCode,
            id: id,
            lat: lat,
            lng: lng,
            radius: radius
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            res.map(self.addAuction);
        })
            .catch(function (error) {
                console.log('shgiaaaaaaa')
                console.log(error);
            });
    }

    getLocation(city, lat, lng) {
        let mygc = new google.maps.Geocoder();
        let locationOrigem;
        let locationDestino;
        let latOrigem = 0;
        let longOrigem = 0;
        let latDestino = 0;
        let longDestino = 0;

        mygc.geocode({ 'address': city }, function (results, status) {
            locationOrigem = results[0].geometry.location;
            latOrigem = results[0].geometry.location.lat();
            longOrigem = results[0].geometry.location.lng();
            mygc.geocode({}, function (results, status) {
                locationDestino = new google.maps.LatLng(lat, lng);
                // alert(latDestino + " " + longDestino);
                console.log(locationOrigem);
                console.log(locationDestino);
                return (google.maps.geometry.spherical.computeDistanceBetween(locationOrigem, locationDestino));
            });
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
        this.props.offerBid(i, this.state.auctionsArr);
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

                <span id={"TaramtiMenuIconDiv"} style={{ position: "absolute", top: "7px", right: "9px" }}>
                    <i id={"TaramtiMenuIcon"} className="fa fa-ellipsis-v fa-4x"></i>
                </span>

                {/*<div style={{ height: "74px", width: "100%" }} >*/}
                <img src={"http://proj.ruppin.ac.il/bgroup51/prod/Uploads/logos/smaller_logo.jpg"} style={{ float: "left", marginLeft: "-2%", width: "80%", position: "absolute", top: "0", marginTop: "0", right: "30px" }} />
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