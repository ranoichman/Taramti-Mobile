//npm components
import React, { Component } from 'react';

//style
import '../../css/balloon.css';

class Balloon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.calcDonation = this.calcDonation.bind(this);

    }

    componentDidMount() {
        //this.updateWindowDimensions();
        //        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillReceiveProps(nextProps) {
        {/*animating price upadate*/ }
        if ((nextProps.anim == "2" && this.props.anim != "2")) {
            this.refs.newPrice.value = "";
            this.calcDonation();
        }
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    calcDonation() {
        let val = this.refs.newPrice !== undefined ? parseInt(this.refs.newPrice.value) : -5;
        if (this.props.calc != undefined) {
            this.props.calc(val);
        }
    }

    render() {

        //array with all balloon dimension
        const balloonDim = [
            {
                width: `${0.17 * this.state.width}px`, //17%
                height: `${0.11 * this.state.height}px`, //11%
                left: "50%"
            },
            {
                width: `${0.23 * this.state.width}px`, //23%
                height: `${0.15 * this.state.height}px`, //15%
                left: "47%"
            },
            {
                width: `${0.30 * this.state.width}px`, //30%
                height: `${0.20 * this.state.height}px`, //20%
                left: "43%"
            },
            {
                width: `${0.47 * this.state.width}px`, //47%
                height: `${0.33 * this.state.height}px`, //33%
                left: "35%"
            }
        ]

        //keyframes for inflating
        let keyframes =
            `@keyframes inflate {
            0% {${balloonDim[this.props.formerIndex]}} 
            100% {${balloonDim[this.props.curIndex]}}
        }`;

        let style = {
            width: balloonDim[this.props.curIndex]["width"],
            height: balloonDim[this.props.curIndex]["height"],
            left: balloonDim[this.props.curIndex]["left"],
            animation: `inflate 1s, floatingB 4s ease-in-out infinite`
        }

        let float = {
            width: balloonDim[this.props.curIndex]["width"],
            height: balloonDim[this.props.curIndex]["height"],
            animation: `${this.props.anim === "1" ? "releaseB 4s" : "blowDown 1.5s"}`,
        }

        return (
            <div className="balloon" style={this.props.anim === "0" ? style : float}>
                <input type="number" ref="newPrice" className="priceInput" placeholder={this.props.price} onChange={this.calcDonation} />
            </div>
        );
    }
}

export default Balloon;
