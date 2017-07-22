import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';


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
        return (
            <div className={this.state.open ? "box" : "box zoomOut"}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <div className="Form">
                    <h4>משך המכרז (בימים)</h4>
                    <select ref="AuctionLast">
                        <option value="-1"> בחר</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>

                    <h4>מחיר מינימום שארצה לקבל על המוצר</h4>
                    <input type="text" id="AuctionMinPrice" />
                </div>
            </div>
        );
    }
}

export default RePublish;