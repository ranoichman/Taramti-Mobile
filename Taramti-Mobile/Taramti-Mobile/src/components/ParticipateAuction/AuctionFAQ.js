import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';

import ChatMsg from '../Generic/ChatMsg';
import TextInput from '../Generic/TextInput';

import '../../css/modal.css';

import { auctionWS, buyerID } from '../../constants/general';
class AuctionFAQ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FAQs: []
        }
        this.addQuestion = this.addQuestion.bind(this);
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


    addQuestion() {

        let questioner = { UserId: buyerID };
        let quest = {
            ProdCode: this.props.prodCode,
            Question: this.refs.newQ.value,
            Questioner: questioner
        };

        axios.post(auctionWS + 'AddQuestion', {
            quest: quest
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            if (res != 1) {
                //insert to localhost and deal with it later
                console.log(`res not 1`)
            } else {
                console.log("question added");
            }

            //dispaly modal with success!!!

        })
            .catch(function (error) {
                console.log(error);
            });


        console.log(`asked: ${this.refs.newQ.value}`);
    }

    render() {
        return (
            <div>
                {/*close button*/}
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                {/*all FAQ's*/}
                <ChatMsg FAQs={this.state.FAQs} />

                <TextInput send={this.addQuestion}/>
            </div>
        )
    }
}

export default AuctionFAQ;