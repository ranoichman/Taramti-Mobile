import React, { Component } from 'react';

import '../../css/timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsRemaining: Date.parse(this.props.endDate) - Date.now(),
            elapsed: ""
        }
        this.tick = this.tick.bind(this);
        this.calculateElapsed = this.calculateElapsed.bind(this);
        this.renderBlink = this.renderBlink.bind(this);
        this.renderReg = this.renderReg.bind(this);
    }
    //countdown timer - interval function
    tick() {
        if (this.state.secondsRemaining !== 'undefined') {
            this.state.secondsRemaining = this.state.secondsRemaining - 1000;
            this.setState({ elapsed: this.calculateElapsed() });
            if (this.state.secondsRemaining <= 0) {
                this.setState({ elapsed: "המכרז הסתיים" });
                if (this.props.timerFinished !== 'undefined') {
                    this.props.timerFinished();
                }
                clearInterval(this.loadInterval);
            }
        }
    }

    //calculate and display elapsed time in hh:mm:ss format
    calculateElapsed() {
        let elaps = this.state.secondsRemaining / 1000;
        let seconds = Math.floor(elaps % 60) >= 10 ? Math.floor(elaps % 60) : `0${Math.floor(elaps % 60)}`;
        elaps /= 60;
        let minutes = Math.floor(elaps % 60) >= 10 ? Math.floor(elaps % 60) : `0${Math.floor(elaps % 60)}`;
        elaps /= 60;
        let hours = Math.floor(elaps) >= 10 ? Math.floor(elaps) : `0${Math.floor(elaps)}`;

        return `${hours}:${minutes}:${seconds}`
    }

    componentDidMount() {
        // console.log(`end---${this.props.endDate}`)
         this.setState({ secondsRemaining: Date.parse(this.props.endDate) - Date.now() });
        this.loadInterval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.endDate != nextProps.endDate) {
    //         this.loadInterval && clearInterval(this.loadInterval);
    //         this.loadInterval = false;
    //         this.setState({ secondsRemaining: Date.parse(this.props.endDate) - Date.now() });
    //         this.loadInterval = setInterval(this.tick, 1000);
    //     }
    // }


    renderReg() {
        return (
            <div className="rect regBorder">
                <h3 className="text-center">{this.state.elapsed}</h3>
            </div>)
    }

    renderBlink() {
        return (
            <div className="rect blinkBorder">
                <h3 className="text-center">{this.state.elapsed}</h3>
            </div>)
    }

    render() {
        // if (this.state.secondsRemaining >= 20870000) {
        if (this.state.secondsRemaining >= 120) {
            return (
                this.renderReg()
            )
        }
        else {
            return (
                this.renderBlink()
            )
        }
    }
}

export default Timer;