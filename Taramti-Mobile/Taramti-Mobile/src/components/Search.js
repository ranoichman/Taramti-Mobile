import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import Ddl from './Ddl';

import '../css/modal.css';


class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categroy: 0,
            gps: 0,
            display: "none"
        }
        this.onSelectedCat = this.onSelectedCat.bind(this);
        this.onSelectedGPS = this.onSelectedGPS.bind(this);
        this.cbChanged = this.cbChanged.bind(this);
        this.searchBTN = this.searchBTN.bind(this);
    }


    onSelectedCat(opt) {
        console.log(`category: ${opt}`);
        this.setState({ categroy: opt });
    }

    onSelectedGPS(opt) {
        console.log(`gps---- ${opt}`);
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
    searchBTN(){
        let low = this.refs.lowerPrice.value;
        let high = this.refs.higherPrice.value;
        let cities = [];
        let catCode = this.state.categroy;
        
        navigator.geolocation.getCurrentPosition(function(pos_result){
            console.log(`alt -- ${pos_result.coords.altitude} _____ lat-- ${pos_result.coords.longitude}` )


        })

        this.props.startSearch(cities,low,high,catCode);
    }

    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose"></a>
                </Swipeable>
                <div>
                    <form>
                        {/*GPS checkbox*/}
                        <div className="gpsCont">
                            <input type="checkbox" ref="locationCB" onClick={this.cbChanged} />הצג מוצרים בקרבתי
                            <div style={{ display: this.state.display }}  >
                                <Ddl key="1" onChange={this.onSelectedGPS} onChange={this.logChange} options={[{ val: '10', text: '10 ק"מ' },
                                { val: '20', text: '20 ק"מ' }, { val: '30', text: '30 ק"מ' }, { val: '50', text: '50 ק"מ' }
                                ]} css="gpsSelect" />
                            </div>
                        </div>

                        {/*category select*/}
                        <h3>קטגוריית מוצר</h3>
                        <Ddl key="2" onChange={this.onSelectedCat} options={[{ val: '1', text: 'One' },
                        { val: '2', text: 'Two' }, { val: '3', text: 'three' }, { val: '4', text: 'four' }
                        ]} css="priceSelect" />


                        {/*between price area*/}
                        <h3>מחיר בש"ח</h3>
                        <input type="text" ref="lowerPrice" placeholder="מ..." />
                        <input type="text" ref="higherPrice" placeholder="עד..." />
                        <button className="ui-btn ui-btn-corner-all btn-info" onClick={this.searchBTN}> חפש </button>

                    </form>

                </div>
            </div>
        )
    }
}

export default Search;