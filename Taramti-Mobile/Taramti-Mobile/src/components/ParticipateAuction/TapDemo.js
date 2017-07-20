import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import Balloon from './Balloon';

class TapDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
        }
        
        this.showVid = this.showVid.bind(this);
        this.renderStart = this.renderStart.bind(this);
        this.renderTap = this.renderTap.bind(this);
        this.renderInflate = this.renderInflate.bind(this);
    }

    componentDidMount() {
        this.showVid();
        this.loadInterval = setInterval(this.showVid, 5000);
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
            setTimeout(function () {
                self.setState({ mode: 0 })
                setTimeout(() => self.setState({ mode: 2 }), 1000)
            }, 500)



        }, 1500);
    }

    renderStart() {
        return (
            <Balloon curIndex={0} formerIndex={0} anim={"0"} price={50} />
        );
    }

    renderTap() {
        return (
            <div>
                <img className="tappingUp" src="images/tapping_hand.png" />
                {this.renderStart()}
            </div>
        );
    }

    renderInflate() {
        return (
            <Balloon curIndex={3} formerIndex={0} anim={"0"} price={80} />
        );
    }

    render() {
        const func = [this.renderStart(), this.renderTap(), this.renderInflate()]

        return (
            <div className={this.props.anim}>
                <h2>
                    לחץ על הבלון להזנת מחיר
            </h2>
                {func[this.state.mode]}
            </div>

        )
    }
}

export default TapDemo;