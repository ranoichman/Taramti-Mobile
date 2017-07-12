import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Auction from '../Home/Auction';
import ActiveAuctions from './ActiveAuctions';
import MyAuction from './MyAuction';

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
        const list = ["מישהו עקף אותי", "המוצרים שלי", "הבידים שלי"]
        return (
            <div>
                <Swipeable onSwipedLeft={this.tabSwipeLeft} onSwipedRight={this.tabSwipeRight}>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        {/*header*/}
                        <TabList>
                            <Tab>מישהו עקף אותי</Tab>
                            <Tab>ההצעות שלי</Tab>
                            <Tab>הבידים שלי</Tab>
                        </TabList>

                        {/*someone beat me to it*/}
                        <TabPanel>
                            <div className={this.state.tabIndex === 0 ? this.state.animation : ""}>
                                <h2>עקפו אותי</h2>
                                <Auction key={0} index={0}
                                    // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                    home="true" imgArr={this.state.imgArr} prodName={"דמחמחכמה"} prodDesc={" כ יחכ יחכח כיחיחג חיג חי יחגכ חיגכחי יחיג יגכ ג דמהיחהכ"}
                                    price={500} endDate={"7/7/2017"} code={4}
                                    percentage={20} prodCode={4} />
                            </div>
                        </TabPanel>

                        {/*offers*/}

                        <TabPanel>
                            <div className={this.state.tabIndex === 1 ? this.state.animation : ""}>
                                <h2>ההצעות</h2>
                                <Auction key={1} index={1}
                                    // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                    home="true" imgArr={this.state.imgArr} prodName={"dnjvnhjsbv h fs "} prodDesc={" djs jh kjs jk hj  ah hgdaj jk kjsk kjdjk djk hj hjad jd ahjad hj "}
                                    price={500} endDate={"7/7/2017"} code={4}
                                    percentage={20} prodCode={4} />
                            </div>
                        </TabPanel>

                        {/*bids*/}
                        <TabPanel>
                            <div className={this.state.tabIndex === 2 ? this.state.animation : ""}>
                                <h2>בידים</h2>
                            </div>
                        </TabPanel>

                    </Tabs>
                    </Swipeable>
            </div>
                );
    }
}

export default Profile;