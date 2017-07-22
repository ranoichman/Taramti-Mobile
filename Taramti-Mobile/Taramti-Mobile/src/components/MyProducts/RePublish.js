import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';
import SweetAlert from 'sweetalert-react';


import Ddl from '../Generic/Ddl';

import '../../css/modal.css';

class RePublish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            day: -1,
            alert: false,
            message: ""
        }
        this.close = this.close.bind(this);
        this.onSelectedDay = this.onSelectedDay.bind(this);
        this.send = this.send.bind(this);
    }

    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600)
    }

    onSelectedDay(opt) {
        this.setState({ day: opt });
    }

    send() {
        let price = this.refs.auctionMinPrice.value != "" ? this.refs.auctionMinPrice.value : -1;
        console.log(`send`);
        if (this.state.day == -1) {
            this.setState({
                alert: true,
                message: "חובה לבחור משך למכרז"
            });
        }
        else if (price == -1) {
            this.setState({
                alert: true,
                message: "חובה להזין סכום רצוי"
            });
        }
        else{
            console.log(`db call from ran`)
        }
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
                <div style={{ padding: "10px" }}>
                    <h4>משך המכרז (בימים)</h4>
                    <Ddl key="1" onChange={this.onSelectedDay} options={days} css="gpsSelect" />

                    <h4>מחיר מינימום שארצה לקבל על המוצר</h4>
                    <input type="number" ref="auctionMinPrice" />
                </div>

                <div className="button-1">
                    <button type="button" id="AddingProductAuctionbtn" onClick={this.send} className="btn-l btn-10">שגר מכרז</button>
                </div>

                <SweetAlert
                    show={this.state.alert}
                    title="...אופס"
                    type="error"
                    text={this.state.message}
                    confirmButtonText="אישור"
                    onConfirm={() => this.setState({ alert: false })} />

            </div>
        );
    }
}

export default RePublish;