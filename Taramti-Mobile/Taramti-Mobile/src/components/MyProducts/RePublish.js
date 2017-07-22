import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';

import Ddl from '../Generic/Ddl';

class RePublish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600)
    }

    render() {
        const days = [
            { val: -1, text: "בחר" },
            { val: 1, text: 1 },
            { val: 2, text: 2 },
            { val: 3, text: 3 },
            { val: 4, text: 4 },
            { val: 5, text: 5 },
            { val: 6, text: 6 },
            { val: 7, text: 7 },]
        return (
            <div className={this.state.open ? "box" : "box zoomOut"}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <div style={{padding:"10px"}}>
                    <h4>משך המכרז (בימים)</h4>
                    <Ddl key="1" onChange={this.onSelectedGPS} options={days} css="gpsSelect" />

                    <h4>מחיר מינימום שארצה לקבל על המוצר</h4>
                    <input type="text" id="AuctionMinPrice" />
                </div>
            </div>
        );
    }
}

export default RePublish;