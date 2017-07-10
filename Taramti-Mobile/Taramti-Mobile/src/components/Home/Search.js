import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';

// taramti babait components
import Ddl from '../Generic/Ddl';

//constants 
import {auctionWS} from '../../constants/general';

import '../../css/modal.css';

//const auctionWS = GENERAL.auctionWebServerAddress;
//const auctionWS = "http://proj.ruppin.ac.il/bgroup51/test2/AuctionWebService.asmx/";

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categroy: 0,
            gps: 0,
            display: "none",
            categoriesArr: [{ val: 0, text: "כל הקטגוריות" }]
        }
        this.onSelectedCat = this.onSelectedCat.bind(this);
        this.onSelectedGPS = this.onSelectedGPS.bind(this);
        this.cbChanged = this.cbChanged.bind(this);
        this.searchBTN = this.searchBTN.bind(this);
    }

    componentDidMount() {
        const self = this;
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
    }

    onSelectedCat(opt) {
        this.setState({ categroy: opt });
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

    //send search params to index.js
    searchBTN() {
        let low = this.refs.lowerPrice.value !== "" ? this.refs.lowerPrice.value : -1;
        let high = this.refs.higherPrice.value !== "" ? this.refs.higherPrice.value : -1;
        let catCode = this.state.categroy;
        let coords = {lat: 0, lng: 0};
        let radius = 0;

        if (!(this.refs.locationCB.checked)) {
            this.props.startSearch(low, high, catCode,coords,radius); // start search without location    
        } else {
            const self = this;
            navigator.geolocation.getCurrentPosition(function (pos_result) {
                console.log(`lat -- ${pos_result.coords.latitude} _____ lat-- ${pos_result.coords.longitude}`)
                coords = {lat: pos_result.coords.latitude, lng: pos_result.coords.longitude};
                radius= self.state.gps;
                self.props.startSearch(low, high, catCode,coords,radius); // start search with location after city arr is filled

            })
        }



    }

    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
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
                        </div>
                    </div>

                    {/*category select*/}
                    <h3>קטגוריית מוצר</h3>
                    <Ddl key="2" onChange={this.onSelectedCat} options={this.state.categoriesArr} css="priceSelect" />


                    {/*between price area*/}
                    <h3>מחיר בש"ח</h3>
                    <input type="text" ref="lowerPrice" placeholder="מ..." />
                    <input type="text" ref="higherPrice" placeholder="עד..." />
                    <button className="ui-btn ui-btn-corner-all btn-info" onClick={this.searchBTN}> חפש </button>

                    {/*</form>*/}

                </div>
            </div>
        )
    }
}

export default Search;