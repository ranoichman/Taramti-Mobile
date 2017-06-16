import React, { Component } from 'react';
import Swipeable from 'react-swipeable';



class Payment extends Component {

    constructor(props) {
        super(props);
        this.makePayment = this.makePayment.bind(this);
    }

    makePayment() {
        console.log(`tashlum?????`)
    }

    render() {

        return (
            <div>
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <h1>מזל טוב!</h1>
                <p style={{ fontSize: "22px" }}>לאחר מאבק עיקש זכית בזכות לרכוש את <span className="info">{this.props.auc.prodName}</span></p>
                <p style={{ fontSize: "22px" }}>כעת כל שנותר הוא להעביר את התשלום למוכר ולאחר מכן ניתן יהיה להחליף פרטים</p>
                <button onClick={this.makePayment}>פייפאל!!!!!</button>
            </div>
        );
    }
}

export default Payment;