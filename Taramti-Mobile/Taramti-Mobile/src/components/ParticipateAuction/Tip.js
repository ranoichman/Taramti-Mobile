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
            tabIndex: 0,
            animation: ""
        }
        this.close = this.close.bind(this);
        this.tabSwipeLeft = this.tabSwipeLeft.bind(this);
        this.tabSwipeRight = this.tabSwipeRight.bind(this);
    }

    componentDidMount() {

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
            // <div className={this.state.open ? "box" : "box zoomOut"}>
            <div ref="modal" className={this.state.open ? "tipBox" : "tipBox zoomOut"} style={{ display: "inline-block" }}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>
                {/* <TapDemo /> 
                 <SwipeUPDemo/>  
                <SwipeDownDemo /> */}

                <Swipeable onSwipedLeft={this.tabSwipeLeft} onSwipedRight={this.tabSwipeRight}>
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