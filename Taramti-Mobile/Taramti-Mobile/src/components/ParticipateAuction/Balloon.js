import React, { Component } from 'react';

import '../../css/balloon.css';

class Balloon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    }

    componentDidMount() {
        //this.updateWindowDimensions();
        //        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


    render() {
        const balloonDim = [
            {
                width: "17%",
                height: "11%",
                left: "50%"
            },
            {
                width: "23%",
                height: "15%",
                left: "47%"
            },
            {
                width: "30%",
                height: "20%",
                left: "43%"
            },
            {
                width: "47%",
                height: "33%",
                left: "35%"
            }
        ]

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
            </div>
        );
    }
}

export default Balloon;