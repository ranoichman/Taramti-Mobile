//npm components
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

// BID IT components
import Balloon from './Balloon';

class SwipeDownDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
        }
        this.showVid = this.showVid.bind(this);
        this.renderStart = this.renderStart.bind(this);
        this.renderSwipe = this.renderSwipe.bind(this);
        this.renderBlow = this.renderBlow.bind(this);
    }

    componentDidMount() {
        this.showVid();
        this.loadInterval = setInterval(this.showVid, 4150);
    }

    componentWillUnmount() {
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    //control mode changes over time
    showVid() {
        this.setState({ mode: 0 });
        self = this;
        setTimeout(function () {
            self.setState({ mode: 1 })
            setTimeout(() => self.setState({ mode: 2 }), 2150)
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

    renderBlow() {
        return (
            <Balloon curIndex={3} formerIndex={3} anim={"2"} price={50} />
        );
    }

    render() {
        const func = [this.renderStart(), this.renderSwipe(), this.renderBlow()]

        return (
            <div className="show1">
                <h2>החלק את הבלון מטה למחיקת ההצעה</h2>
                <div className={this.state.mode == 0 ? "arrow_box_down" : "arrow_box_down growDown"} style={{ display: this.state.mode == 2 ? "none" : "block" }} ></div>
                <img className={this.state.mode == 0 ? "tappingDown" : "tappingDown swipeDown"} style={{ display: this.state.mode == 2 ? "none" : "block" }} src="images/tapping_hand.png" />
                 {func[this.state.mode]} 
            </div>
        )
    }
}

export default SwipeDownDemo;