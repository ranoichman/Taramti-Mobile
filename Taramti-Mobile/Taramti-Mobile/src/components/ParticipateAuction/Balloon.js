import React, { Component } from 'react';

import '../../css/balloon.css';

class Balloon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: null,
            height: null
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


    render() {
        const balloonDim = [
            {
                width: "17%",
                height: "11%"
            },
            {
                width: "23%",
                height: "15%"
            },
            {
                width: "30%",
                height: "20%"
            },
            {
                width: "47%",
                height: "33%"
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
            // bottom: "20px",
            // left: "50%",
            //bottom: "20px",
            animation: `inflate 1s, floatingB 4s ease-in-out infinite`
            //animation: `inflate 1s` 
        }

        let float = {
            width: balloonDim[this.props.curIndex]["width"],
            height: balloonDim[this.props.curIndex]["height"],
            animation: `${this.props.anim === "1"? "releaseB 4s": "blowDown 1.5s"}`,
            // left: "50%"
            //  bottom: "20px",
            // left: "50%",
            //WebkitTransitionDelay: "1s",
            // TransitionDelay: "1s",
            // WebkitTransformDelay: "1s",
            // TransformDelay: "1s",
            // WebkitTransform: `translate(0,-${this.state.height-130}px) scale(1.5, 1)`,
            // opacity: 0,
            // WebkitTransition: "8s cubic-bezier(.65, 2, .03, .32)"
        }
        return (
            <div className="balloon" style={this.props.anim === "0" ? style :float }>
            </div>
        );
    }
}

export default Balloon;
