import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

class PriceTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            price: this.props.price,
            style: { zIndex: this.props.modalIsOpen ? 0 : 1 }
        };
    }

    componentWillReceiveProps(nextProps) {

        {/*animating price upadate*/ }
        if (parseInt(this.state.price) < parseInt(nextProps.price)) {
            this.setState({
                price: nextProps.price,
                style: {
                    zIndex: this.props.modalIsOpen ? 0 : 1,
                    animation: "tada 0.7s both",
                    WebkitAnimation: "tada 0.7s both"
                }
            });
            //remove the animation style
            setTimeout(() => this.setState({ style: { zIndex: this.props.modalIsOpen ? 0 : 1 } }), 700)
        }

        {/*controling z-index*/ }
        if (this.props.modalIsOpen != nextProps.modalIsOpen) {
            this.setState({ style: { zIndex: nextProps.modalIsOpen ? 0 : 1 } });
        }
    }

    render() {
        return (
            <div className="priceTag" style={this.state.style} key={this.props.index}>
                <h5>{this.state.price}</h5>
            </div>
        );
    }
}

export default PriceTag;