import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import '../css/modal.css';


class AuctionFAQ extends Component {
    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
            </div>
        )
    }
}

export default AuctionFAQ;