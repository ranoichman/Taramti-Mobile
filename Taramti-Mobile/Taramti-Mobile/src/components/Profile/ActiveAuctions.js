import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import Swipeable from 'react-swipeable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Slider from 'react-slick';

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
        const settings = {
            infinite: false,
            arrows: false,
            slidesToShow: 1,
            slide: "360px"
        }

        const list = ["מישהו עקף אותי","ההצעות שלי","הבידים שלי"]
        return (
                <div>
                    <ul className="react-tabs__tab-list" role="tablist">
                        {list.map((item,i)=> {
                             return <li className={this.state.tabIndex === i ? "react-tabs__tab react-tabs__tab--selected" : "react-tabs__tab"} tabIndex={i} key={i} onClick={() => this.setState({ tabIndex : i })}>
                                 {item}
                                 </li> })
                             }
                        {/*<li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false" tabIndex={0} onClick={() => this.setState({ tabIndex : 0 })}>מישהו עקף אותי</li>
                        <li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false" tabIndex={1} onClick={() => this.setState({ tabIndex : 1 })}>ההצעות שלי</li>
                        <li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false" tabIndex={2} onClick={() => this.setState({ tabIndex : 2 })}>הבידים שלי</li>*/}
                    </ul>
                    <Slider {...settings}>
                        {/*someone beat me to it*/}
                        <div className={this.state.tabIndex === 0 ? "slick-active" : ""}>
                            <h2>עקפו אותי</h2>
                            <Auction key={0} index={0}
                                // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                home="true" imgArr={this.state.imgArr} prodName={"דמחמחכמה"} prodDesc={" כ יחכ יחכח כיחיחג חיג חי יחגכ חיגכחי יחיג יגכ ג דמהיחהכ"}
                                price={500} endDate={"7/7/2017"} code={38}
                                percentage={20} prodCode={4} />
                        </div>

                        {/*offers*/}
                        <div className={this.state.tabIndex === 1 ? "slick-active" : ""}>
                            <h2>ההצעות</h2>
                            <Auction key={1} index={1}
                                // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
                                home="true" imgArr={this.state.imgArr} prodName={"dnjvnhjsbv h fs "} prodDesc={" djs jh kjs jk hj  ah hgdaj jk kjsk kjdjk djk hj hjad jd ahjad hj "}
                                price={500} endDate={"7/7/2017"} code={49}
                                percentage={20} prodCode={4} />
                        </div>

                        {/*bids*/}
                        <div className={this.state.tabIndex === 2 ? "slick-active" : ""}>
                            <h2>בידים</h2>
                        </div>
                    </Slider>



                </div>


            // <Swipeable onSwipedLeft={this.tabSwipeLeft} onSwipedRight={this.tabSwipeRight}>
            //     <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            //         {/*header*/}
            //         <TabList>
            //             <Tab>מישהו עקף אותי</Tab>
            //             <Tab>ההצעות שלי</Tab>
            //             <Tab>הבידים שלי</Tab>
            //         </TabList>

            //         {/*someone beat me to it*/}
            //         <TabPanel>
            //             <h2>עקפו אותי</h2>
            //             <Auction key={0} index={0}
            //                 // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
            //                 home="true" imgArr={this.state.imgArr} prodName={"דמחמחכמה"} prodDesc={" כ יחכ יחכח כיחיחג חיג חי יחגכ חיגכחי יחיג יגכ ג דמהיחהכ"}
            //                 price={500} endDate={"7/7/2017"} code={38}
            //                 percentage={20} prodCode={4} />
            //         </TabPanel>

            //         {/*offers*/}
            //         <TabPanel>
            //             <h2>ההצעות</h2>
            //             <Auction key={1} index={1}
            //                 // auctionfinished={this.deleteAuction} offerBid={this.offerBid}
            //                 home="true" imgArr={this.state.imgArr} prodName={"dnjvnhjsbv h fs "} prodDesc={" djs jh kjs jk hj  ah hgdaj jk kjsk kjdjk djk hj hjad jd ahjad hj "}
            //                 price={500} endDate={"7/7/2017"} code={49}
            //                 percentage={20} prodCode={4} />
            //         </TabPanel>

            //         {/*bids*/}
            //         <TabPanel>
            //             <h2>בידים</h2>
            //         </TabPanel>

            //     </Tabs>
            // </Swipeable>
        );
    }
}

export default ActiveAuctions;


























// <ul className="react-tabs__tab-list" role="tablist">
//                             <li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false">מישהו עקף אותי</li>
//                             <li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false">ההצעות שלי</li>
//                             <li className="react-tabs__tab" role="tab" aria-selected="false" aria-disabled="false">הבידים שלי</li>