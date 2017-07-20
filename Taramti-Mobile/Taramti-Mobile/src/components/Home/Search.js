import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';

// taramti babait components
import Ddl from '../Generic/Ddl';

//constants 
import { auctionWS, assocWS } from '../../constants/general';

import '../../css/modal.css';
import '../../css/transition.css';

//const auctionWS = GENERAL.auctionWebServerAddress;
//const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            categroy: 0,
            tag: 0,
            gps: 0,
            display: "none",
            categoriesArr: [{ val: 0, text: "כל הקטגוריות" }],
            tagsArr: [{ val: 0, text: "כל התגיות" }]
        }
        this.onSelectedCat = this.onSelectedCat.bind(this);
        this.onSelectedGPS = this.onSelectedGPS.bind(this);
        this.onSelectedTag = this.onSelectedTag.bind(this);
        this.cbChanged = this.cbChanged.bind(this);
        this.searchBTN = this.searchBTN.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        const self = this;

        // fetch product categories
        axios.post(auctionWS + "GetAllProductsCategories", {}).then(function (response) {
            let res = JSON.parse(response.data.d);
            res.map(function (cat, i) {
                let arr = self.state.categoriesArr;
                arr.push({ val: cat.Cat_id, text: cat.Cat_Name });
                self.setState({ categoriesArr: arr });
            });
        })
            .catch(function (error) {
                console.log(error);
            });

        // fetch assoc Tags
        axios.post(assocWS + "GetAllAssocTags", {}).then(function (response) {
            let res = JSON.parse(response.data.d);
            let arr = self.state.tagsArr;
            res.map(function (tag, i) {
                arr.push({ val: tag.Code, text: tag.Tag_Name });
            });
            self.setState({ tagsArr: arr });
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    onSelectedCat(opt) {
        this.setState({ categroy: opt });
    }
    onSelectedTag(opt) {
        this.setState({ tag: opt });
    }

    onSelectedGPS(opt) {
        this.setState({ gps: opt });
    }

    //switch gps select display attr
    cbChanged() {
        if (this.refs.locationCB.checked) {
            this.setState({ display: "inline" });
        }
        else {
            this.setState({ display: "none" });
        }
    }

    //send search params to home.js
    searchBTN() {
        let low = this.refs.lowerPrice.value !== "" ? this.refs.lowerPrice.value : -1;
        let high = this.refs.higherPrice.value !== "" ? this.refs.higherPrice.value : -1;
        let catCode = this.state.categroy;
        let tagCode = this.state.tag;
        let coords = { lat: 0, lng: 0 };
        let radius = 0;

        if (!(this.refs.locationCB.checked)) {
            this.props.startSearch(low, high, catCode, tagCode, coords, radius); // start search without location    
        } else {
            const self = this;
            navigator.geolocation.getCurrentPosition(function (pos_result) {
                console.log(`lat -- ${pos_result.coords.latitude} _____ lat-- ${pos_result.coords.longitude}`)
                coords = { lat: pos_result.coords.latitude, lng: pos_result.coords.longitude };
                radius = self.state.gps;
                self.props.startSearch(low, high, catCode, tagCode, coords, radius); // start search with location after city arr is filled

            })
        }



    }

    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600)
    }

    render() {
        return (
            <div className={this.state.open ? "searchBox" : "searchBox zoomOut"}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose"></a>
                </Swipeable>
                <div>
                    {/*<form>*/}
                    {/*GPS checkbox*/}
                    <div className="gpsCont">
                        <input type="checkbox" ref="locationCB" onClick={this.cbChanged} />הצג מוצרים בקרבתי
                        <div style={{ display: this.state.display }}  >
                            <Ddl key="1" onChange={this.onSelectedGPS} options={[{ val: '10000', text: '10 ק"מ' },
                            { val: '20000', text: '20 ק"מ' }, { val: '30000', text: '30 ק"מ' }, { val: '50000', text: '50 ק"מ' }
                            ]} css="gpsSelect" />
                            <img className="gpsMarker bounceInDown" src="images/icons8-Marker-64.png" />
                        </div>
                    </div>

                    {/*category select*/}
                    <h3>קטגוריית מוצר</h3>
                    <Ddl key="2" onChange={this.onSelectedCat} options={this.state.categoriesArr} css="priceSelect" />

                    {/*assoc tag select*/}
                    <h3>תגית עמותה</h3>
                    <Ddl key="3" onChange={this.onSelectedTag} options={this.state.tagsArr} css="priceSelect" />


                    {/*between price area*/}
                    <h3>מחיר בש"ח</h3>
                    <input type="text" ref="lowerPrice" placeholder="מ..." />
                    <input type="text" ref="higherPrice" placeholder="עד..." />
                    <button className="ui-btn ui-btn-corner-all searchBtn" onClick={this.searchBTN}> חפש </button>

                    {/*</form>*/}

                </div>
            </div>
        )
    }
}

export default Search;