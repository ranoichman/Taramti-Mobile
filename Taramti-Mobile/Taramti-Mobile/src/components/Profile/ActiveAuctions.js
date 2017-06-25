import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import Swipeable from 'react-swipeable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Auction from '../Home/Auction';

import '../../css/transition.css';
import '../../css/react-tabs.css';


class ActiveAuctions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArr: ["http://proj.ruppin.ac.il/bgroup51/prod/Uploads/Items/14_pic_2.jpg"],
            tabIndex: 2
        };
        this.handleAdd = this.handleAdd.bind(this);
        this.tabSwipeLeft = this.tabSwipeLeft.bind(this);
        this.tabSwipeRight = this.tabSwipeRight.bind(this);

    }

    handleAdd() {
        const newItems = this.state.items.concat([
            prompt('Enter some text')
        ]);
        this.setState({ items: newItems });
    }

    handleRemove(i) {
        let newItems = this.state.items.slice();
        newItems.splice(i, 1);
        this.setState({ items: newItems });
    }

    tabSwipeLeft() {
        let i = this.state.tabIndex - 1;
        if (i === -1) {
            this.setState({ tabIndex: 2 })
        }
        else { this.setState({ tabIndex: i }) }
    }

    tabSwipeRight() {
        let i = this.state.tabIndex + 1;
        if (i === 3) {
            this.setState({ tabIndex: 0 })
        }
        else { this.setState({ tabIndex: i }) }
    }

    render() {

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
                            <h2>עקפו אותי</h2>
                            <Auction key={0} index={0}
                                // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                home="true" imgArr={this.state.imgArr} prodName={"דמחמחכמה"} prodDesc={" כ יחכ יחכח כיחיחג חיג חי יחגכ חיגכחי יחיג יגכ ג דמהיחהכ"}
                                price={500} endDate={"7/7/2017"} code={4}
                                percentage={20} prodCode={4} />
                        </TabPanel>

                        {/*offers*/}
                        <TabPanel>
                            <h2>ההצעות</h2>
                            <Auction key={1} index={1}
                                // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                home="true" imgArr={this.state.imgArr} prodName={"dnjvnhjsbv h fs "} prodDesc={" djs jh kjs jk hj  ah hgdaj jk kjsk kjdjk djk hj hjad jd ahjad hj "}
                                price={500} endDate={"7/7/2017"} code={4}
                                percentage={20} prodCode={4} />
                        </TabPanel>

                        {/*bids*/}
                        <TabPanel>
                            <h2>בידים</h2>
                        </TabPanel>

                    </Tabs>
                </Swipeable>
            </div>
        );
    }
}

export default ActiveAuctions;