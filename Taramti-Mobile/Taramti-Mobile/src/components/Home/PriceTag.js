import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

class PriceTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            price: this.props.price,
            style: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (parseInt(this.state.price) < parseInt(nextProps.price)) {
            this.setState({
                price: nextProps.price,
                style: {
                    animation: "tada 0.7s both",
                    WebkitAnimation: "tada 0.7s both"
                }
            });
            //remove the animation style
            setTimeout(() => this.setState({ style: {} }), 700)
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