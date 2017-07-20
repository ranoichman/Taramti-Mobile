import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import Balloon from './Balloon';

class SwipeUPDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
        }

        this.showVid = this.showVid.bind(this);
        this.renderStart = this.renderStart.bind(this);
        this.renderSwipe = this.renderSwipe.bind(this);
        this.renderFly = this.renderFly.bind(this);
    }

    componentDidMount() {
        this.showVid();
        this.loadInterval = setInterval(this.showVid, 4000);
    }

    componentWillUnmount() {
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    showVid() {
        this.setState({ mode: 0 });
        self = this;
        setTimeout(function () {
            self.setState({ mode: 1 })
            setTimeout(() => self.setState({ mode: 2 }), 2700)
        }, 800);
    }

    renderStart() {
        return (
            <Balloon curIndex={3} formerIndex={3} anim={"0"} price={80} />
        );
    }

    renderSwipe() {
        return (
            <div>
                {this.renderStart()}
            </div>
        );
    }

    renderFly() {
        return (
            <Balloon curIndex={3} formerIndex={3} anim={"1"} price={80} />
        );
    }

    render() {
        const func = [this.renderStart(), this.renderSwipe(), this.renderFly()]

        return (
            <div className={this.props.anim}>
                <h2>החלק את הבלון מעלה להצעת ביד על המוצר</h2>
                <div className={this.state.mode == 0 ? "arrow_box_up" : "arrow_box_up growUP"} style={{ display: this.state.mode == 2 ? "none" : "block" }} ></div>
                <img className={this.state.mode == 0 ? "tappingUp" : "tappingUp swipeUp"} style={{ display: this.state.mode == 2 ? "none" : "block" }} src="images/tapping_hand.png" />
                 {func[this.state.mode]} 
            </div>

        )
    }
}

export default SwipeUPDemo;