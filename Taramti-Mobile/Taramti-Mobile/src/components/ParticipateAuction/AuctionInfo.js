import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import '../../css/modal.css';


class AuctionInfo extends Component {
    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <div>
                    <h1>
                        {this.props.auc.prodName}
                    </h1>
                    <h4> {this.props.auc.prodDesc} </h4>
                    <p> מחיר נוכחי <b style={{ color: "black" }}>{this.props.auc.price}</b> ש"ח מתוכם <b style={{ color: "green" }}>{Math.floor(this.props.auc.price * this.props.auc.percentage/100)}</b> הולכים לתרומה </p>
                    <div>
                        {
                            this.props.auc.imgArr.map(function (pic, i) {
                                return <img key={i} src={pic} style={{ width: "40%", margin: "10px" }} />
                            })

                        }
                    </div>
                </div>
            </div>

        )
    }
    
}

export default AuctionInfo;