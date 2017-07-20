import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CircleButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resize: false,
        }
        this.renderHome = this.renderHome.bind(this);
        this.renderPlus = this.renderPlus.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let newStatus = !this.state.resize;
        this.setState({ resize: newStatus });
    }


    renderPlus() {
        return (
            <div className="FixedButton" style={{ display: this.state.resize ? "none" : "block" }}>
                <div className="RoundDivfixed">
                    <div id="fixedPlus">
                        <div onClick={() => location.href = 'AddingAuction-Taramti.html'}>
                            <img src="images/add_icon.png" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderHome() {
        return (
            <div className="FixedButton" style={{ display: this.state.resize ? "none" : "block" }}>
                <div className="RoundDivfixed">
                    <div id="fixedCircle">
                        <div> <Link to="/"><img src="images/circle-for-home.png" style={{ marginLeft: "-20px" }} /></Link></div>
                    </div>
                    <div id="fixedHome">
                        <div><Link to="/"> <img src="images/Home1600.png" style={{ marginLeft: "30px" }} /></Link></div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        // if (this.state.secondsRemaining >= 20870000) {
        if (this.props.home) {
            return (
                this.renderHome()
            )
        }
        else {
            return (
                this.renderPlus()
            )
        }
    }
}

export default CircleButton;



