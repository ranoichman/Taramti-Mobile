//npm components
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

// BID IT components
import ChatMsg from '../Generic/ChatMsg';

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FAQs: []
        }
    }

    componentDidMount() {

        let product = { ItemId: this.props.prodCode }
        const self = this;

        axios.post(auctionWS + 'GetAllQuestions', {
            prod: product
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            // res.map(self.addAuction);
            self.setState({ FAQs: res })
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    addAnswer(val) {
        console.log(`add answer---- ${val}`)
        let questioner = { UserId: buyerID };
        let quest = {
            ProdCode: this.props.prodCode,
            Question: val,
            Questioner: questioner
        };
        let newFAQ = this.state.FAQs;
        newFAQ.push({ Question: val, Answer: "" })
        axios.post(auctionWS + 'AddQuestion', {
            quest: quest
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            if (res != 1) {
                //insert to localhost and deal with it later
                console.log(`res not 1`)
            } else {
                console.log("answer added");
            }

            //dispaly modal with success!!!

        })
            .catch(function (error) {
                console.log(error);
            });


    }


    render() {
        return (
            <div>
                {/*close button*/}
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                {/*all FAQ's*/}
                <ChatMsg FAQs={this.state.FAQs} chat="false" />
            </div>
        );
    }
}

export default Questions;