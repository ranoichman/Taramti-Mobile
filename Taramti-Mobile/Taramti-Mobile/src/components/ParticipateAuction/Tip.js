import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ThemeAuctions from '../Generic/ThemeAuctions';
import TapDemo from './TapDemo';
import SwipeUPDemo from './SwipeUPDemo';
import SwipeDownDemo from './SwipeDownDemo';

class Tip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            swipe: null, // to determine wheter or not to animate swipe right demo
            tabIndex: 0,
            animation: ""
        }
        this.showSwipeRight = this.showSwipeRight.bind(this);
        this.close = this.close.bind(this);
        this.tabSwipeLeft = this.tabSwipeLeft.bind(this);
        this.tabSwipeRight = this.tabSwipeRight.bind(this);
    }

    componentDidMount() {
        this.showSwipeRight();
        this.loadInterval = setInterval(this.showSwipeRight, 6000);
        let self = this;
        setTimeout(function () {
            self.setState({ swipe: null });
            self.loadInterval && clearInterval(self.loadInterval);
            self.loadInterval = false;
        }, 12000)
    }

    componentWillUnmount() {
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    showSwipeRight() {
        let self = this;
        if (self.state.tabIndex != 0) {
            self.setState({ swipe: null });
            self.loadInterval && clearInterval(self.loadInterval);
            self.loadInterval = false;
        }
        self.setState({ swipe: false });
        setTimeout(function () {
            self.setState({ swipe: true })
            setTimeout(() => self.setState({ swipe: null }), 2200)
        }, 1500)
    }


    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600)
    }

    tabSwipeLeft() {
        let i = this.state.tabIndex - 1;
        if (i === -1) {
            this.setState({ tabIndex: 2, animation: "slideInRight" })
        }
        else {
            this.setState({ tabIndex: i, animation: "slideInRight" })
        }
    }

    tabSwipeRight() {
        let i = this.state.tabIndex + 1;
        if (i === 3) {
            this.setState({ tabIndex: 0, animation: "slideInLeft" })
        }
        else { this.setState({ tabIndex: i, animation: "slideInLeft" }) }
    }

    render() {

        return (

            <div ref="modal" className={this.state.open ? "tipBox" : "tipBox zoomOut"} style={{ display: "inline-block" }}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>

                <Swipeable onSwipedLeft={this.tabSwipeLeft} onSwipedRight={this.tabSwipeRight}>
                    <div style={{ opacity: this.state.swipe == null ? 0 : 1 }}>
                        <div className={this.state.swipe ? "arrow_box_right growRight" : "arrow_box_right"}></div>
                        <img className={this.state.swipe ? "tappingRight swipeRight" : "tappingRight"} src="images/tapping_hand.png" />
                    </div>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>

                        <TabList style={{ display: "none" }}>
                            <Tab></Tab>
                            <Tab></Tab>
                            <Tab></Tab>
                        </TabList>


                        <TabPanel>
                            <TapDemo anim={this.state.tabIndex === 0 ? this.state.animation : ""} />
                        </TabPanel>

                        <TabPanel>
                            <SwipeUPDemo anim={this.state.tabIndex === 1 ? this.state.animation : ""} />
                        </TabPanel>

                        <TabPanel>
                            <SwipeDownDemo anim={this.state.tabIndex === 2 ? this.state.animation : ""} />
                        </TabPanel>


                    </Tabs>
                </Swipeable>







            </div>
        );
    }
}

export default Tip;