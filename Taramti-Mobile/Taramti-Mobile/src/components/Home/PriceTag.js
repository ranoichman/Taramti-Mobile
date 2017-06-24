import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

class PriceTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            price: this.props.price
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ price: nextProps.price });
    }
    render() {
        return (
            <CSSTransitionGroup
                transitionName="priceTag"
                transitionAppear={true}
                transitionAppearTimeout={700}
                transitionEnterTimeout={700}
                transitionLeaveTimeout={500}>
                <div className="priceTag" key={this.key}>
                    <h5>{this.state.price}</h5>
                </div>
            </CSSTransitionGroup>
        );
    }
}

export default PriceTag;