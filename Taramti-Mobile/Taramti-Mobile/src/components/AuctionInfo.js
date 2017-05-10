import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import '../css/modal.css';


class AuctionInfo extends Component {
    constructor(props) {
        super(props)
this.btnClicked = this.btnClicked.bind(this);
    }

btnClicked(){
    console.log("Btn clicked!!!!!!@!@!@!@!")
    this.props.searchBTN();
}

    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <div>
                    <h1>
                        {this.props.prodName}
                    </h1>
                    <h4> {this.props.prodDesc} </h4>
                    <p> מחיר נוכחי <b style={{ color: "black" }}>{this.props.price}</b> ש"ח מתוכם <b style={{ color: "green" }}>{Math.floor(this.props.price * this.props.percentage)}</b> הולכים לתרומה </p>
                    <div>
                        {
                            this.props.imgArr.map(function (pic, i) {
                                return <img key={i} src={pic} style={{ width: "40%", margin: "10px" }} />
                            })

                        }

                        <button className="ui-btn ui-btn-corner-all btn-info" onClick={this.btnClicked}> חפש </button>

                    </div>
                </div>
            </div>

        )
    }

}

export default AuctionInfo;