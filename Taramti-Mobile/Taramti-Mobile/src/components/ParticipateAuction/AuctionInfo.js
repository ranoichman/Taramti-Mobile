//npm components
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

//style
import '../../css/modal.css';

class AuctionInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
        this.renderInfo = this.renderInfo.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.close = this.close.bind(this);
    }

    //handle modak close
    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600) //update parent component
    }

    //return display for modal
    renderModal() {
        return (
            <div className={this.state.open ? "box" : "box zoomOut"}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>
                <div>
                    <h1>
                        {this.props.auc.prodName}
                    </h1>
                    <h4> {this.props.auc.prodDesc} </h4>
                    <p> מחיר נוכחי <b style={{ color: "black" }}>{this.props.auc.price}</b> ש"ח מתוכם <b style={{ color: "green" }}>{Math.floor(this.props.auc.price * this.props.auc.percentage / 100)}</b> הולכים לתרומה </p>
                    <div>
                        {
                            this.props.auc.imgArr.map(function (pic, i) {
                                return <img key={i} src={pic} style={{ width: "40%", margin: "10px" }} />
                            })
                        }
                    </div>
                </div>
            </div>)
    }

    //return small info display 
    renderInfo() {
        return (
            <div>
                <h1 style={{ textAlign: "center" }}>
                    {this.props.auc.prodName}
                </h1>
                <div>
                    {
                        this.props.auc.imgArr.map(function (pic, i) {
                            return <img key={i} src={pic} style={{ width: "35%", margin: "5%", float: "right" }} />
                        })
                    }
                </div>
            </div>

        )
    }

    render() {
        return this.props.modal ? this.renderModal() : this.renderInfo()
    }

}

export default AuctionInfo;