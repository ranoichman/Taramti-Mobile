import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';

// taramti babait components
import Auction from '../Generic/Auction';
import Search from './Search';
import Loader from '../Generic/Loader';
//import TaramtiMenu from './TaramtiMenu'


//import '../css/jqmCss.css';
//import '../../www/css/StyleSheet.css';
import '../../css/transition.css';

import { auctionWS, buyerID } from '../../constants/general';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchModalIsOpen: false,
            modalIsOpen: false,
            auctionsArr: [],
            loaded: false,
            loadingCounter: 0
        }
        this.SearchModalChanged = this.SearchModalChanged.bind(this);
        this.picModalChanged = this.picModalChanged.bind(this);
        this.searchTriggered = this.searchTriggered.bind(this);
        this.getAuctionsByParams = this.getAuctionsByParams.bind(this);
        this.addAuction = this.addAuction.bind(this);
        this.eachAuction = this.eachAuction.bind(this);
        this.offerBid = this.offerBid.bind(this);
        this.deleteAuction = this.deleteAuction.bind(this);
        this.moveToAddAuction = this.moveToAddAuction.bind(this);
        this.getDistance = this.getDistance.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    componentDidMount() {
        // Lifecycle function that is triggered just before a component mounts
        this.getAuctionsByParams(-1, -1, 0, 0, 0, 0); //initial data will come from 

        // this.startTO = setTimeout(()=> sst )
    }

    SearchModalChanged() {
        let newStatus = !this.state.searchModalIsOpen;
        this.setState({ searchModalIsOpen: newStatus })
    }

    picModalChanged() {
        let newStatus = !this.state.modalIsOpen;
        this.setState({ modalIsOpen: newStatus });

    }

    searchTriggered(lowPrice, highPrice, catCode, coords, radius) {
        //console.log(`entered search on ----- ${Date.now()}`)
        this.setState({ auctionsArr: [], loaded: false, loadingCounter: 0, searchModalIsOpen: false });
        this.getAuctionsByParams(lowPrice, highPrice, catCode, coords.lat, coords.lng, radius);
    }

    //call function to get auctions from serveer
    getAuctionsByParams(lowPrice, highPrice, catCode, lat, lng, radius) {
        //define "this" for inner functions
        const self = this;
        
        //stop db access after 8s
        if (this.startTO == undefined) {
            this.startTO = setTimeout(() => {
                self.setState({ loaded: true })
                self.startTO = undefined;
            }, 8000)
        }
        const id = parseInt(buyerID);
        axios.post(auctionWS + 'GetAuctionByParam', {
            lowPrice: lowPrice,
            highPrice: highPrice,
            catCode: catCode,
            lat: lat,
            lng: lng,
            radius: radius,
            user_Id: id
        }).then(function (response) {
            //clear TO when success
            clearTimeout(self.startTO);

            let res = JSON.parse(response.data.d);

            if (res.length == 0) {
                setTimeout(() => self.setState({ loaded: true }), 300)
            }

            //if no radius selected >>> add auction
            if (radius === 0) {
                res.map(self.addAuction);
            } else { //add only auctions withing specified range
                for (let k in res) {

                    let mygc = new google.maps.Geocoder();
                    let locationOrigem;
                    let locationDestino;
                    let latOrigem = 0;
                    let longOrigem = 0;
                    let latDestino = 0;
                    let longDestino = 0;

                    mygc.geocode({ 'address': res[k].Location.CityName }, function (results, status) {
                        console.log(`${k} -- city______ : ${res[k].Location.CityName}`)
                        locationOrigem = results[0].geometry.location;
                        latOrigem = results[0].geometry.location.lat();
                        longOrigem = results[0].geometry.location.lng();
                        mygc.geocode({}, function (results, status) {
                            locationDestino = new google.maps.LatLng(lat, lng);
                            //locationDestino = new google.maps.LatLng(32.313367, 34.945139);
                            let dist = google.maps.geometry.spherical.computeDistanceBetween(locationOrigem, locationDestino)
                            console.log(`${k} -- dist : ${dist}`)
                            if (dist <= radius) {
                                self.addAuction(res[k])
                            };
                        });
                    });
                }
            }

        })
            .catch(function (error) {
                console.log(error);
                
                //access db again untill results arrive or TO expires
                if (self.startTO != undefined) {
                    self.getAuctionsByParams(lowPrice, highPrice, catCode, lat, lng, radius)
                }

            });
    }

    getDistance(item, lat, lng) {
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
        return <Auction key={i} index={i} auctionfinished={this.deleteAuction} offerBid={this.offerBid} handleLoad={this.handleLoad} picModalChanged={this.picModalChanged}
             auc={item} mine={false} modalIsOpen={this.state.modalIsOpen || this.state.searchModalIsOpen} />
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
                <Swipeable onTap={this.SearchModalChanged} className="search">
                    <FontAwesome name='search' border={false} className="fa-2x" tag="div" />
                    <Modal
                        isOpen={this.state.searchModalIsOpen}
                        onRequestClose={this.SearchModalChanged}
                        contentLabel="open search``"
                        className="box" >
                        <Search closeModal={this.SearchModalChanged} startSearch={this.searchTriggered} />
                    </Modal>
                </Swipeable>

                {/*auctions display*/}
                <Loader loaded={this.state.loaded} loadingText={"...מחפש"}>
                    {this.state.auctionsArr.length == 0 ? <h1 style={{ textAlign: "center", marginTop:"40px" }}>אין מכרזים לתצוגה</h1> : ""}
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
                {/*</CSSTransitionGroup>*/}

                {/*move to add auction*/}
                <div id="fixedPlus">
                    <a onClick={this.moveToAddAuction}><i className="fa fa-plus-circle fa-4x" aria-hidden="true"></i></a>
                </div>

            </div>
        );
    }
}

export default Home;