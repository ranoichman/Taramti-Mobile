import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Auction from '../Generic/Auction';
import ActiveAuctions from './ActiveAuctions';
import MyAuction from './MyAuction';
import ThemeAuctions from './ThemeAuctions';

import '../../css/react-tabs.css';
import '../../css/transition.css';


class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgArr: ["http://proj.ruppin.ac.il/bgroup51/prod/Uploads/Items/14_pic_2.jpg", "http://proj.ruppin.ac.il/bgroup51/prod/Uploads/Items/44_pic_3.jpg", "http://proj.ruppin.ac.il/bgroup51/prod/Uploads/Items/51_pic_0.jpg"],
            tabIndex: 2,
            animation: ""
        }
        this.tabSwipeLeft = this.tabSwipeLeft.bind(this);
        this.tabSwipeRight = this.tabSwipeRight.bind(this);
    }

    tabSwipeLeft() {
        let i = this.state.tabIndex - 1;
        if (i === -1) {
            this.setState({ tabIndex: 3, animation: "slideInRight" })
        }
        else {
            this.setState({ tabIndex: i, animation: "slideInRight" })
        }
    }

    tabSwipeRight() {
        let i = this.state.tabIndex + 1;
        if (i === 4) {
            this.setState({ tabIndex: 0, animation: "slideInLeft" })
        }
        else { this.setState({ tabIndex: i, animation: "slideInLeft" }) }
    }

    render() {
        const list = ["עקפו אותי", "המוצרים שלי", "הבידים שלי"]
        return (
            <div className="pageReact" style={{minHeight:"640px"}}>
                <Swipeable onSwipedLeft={this.tabSwipeLeft} onSwipedRight={this.tabSwipeRight}>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        {/*header*/}
                        <TabList>
                            <Tab>היסטוריית רכישות</Tab>
                            <Tab>עקפו אותי</Tab>
                            <Tab>המוצרים שלי</Tab>
                            <Tab>הבידים שלי</Tab>
                        </TabList>

                        {/*someone beat me to it*/}
                        <TabPanel>
                            <div className={this.state.tabIndex === 3 ? this.state.animation : ""}>
                                <ThemeAuctions theme="history" />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className={this.state.tabIndex === 0 ? this.state.animation : ""}>
                                <ThemeAuctions theme="outBID" />
                            </div>
                        </TabPanel>

                        {/*offers*/}

                        <TabPanel>
                            <div className={this.state.tabIndex === 1 ? this.state.animation : ""}>
                                <ThemeAuctions theme="myProducts" />
                            </div>
                        </TabPanel>

                        {/*bids*/}
                        <TabPanel>
                            <div className={this.state.tabIndex === 2 ? this.state.animation : ""}>
                                <ThemeAuctions theme="current" />
                            </div>
                        </TabPanel>


                    </Tabs>
                </Swipeable>
            </div>
        );
    }
}

export default Profile;