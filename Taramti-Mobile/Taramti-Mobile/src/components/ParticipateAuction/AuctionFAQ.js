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
            FAQs: [],
            width: null
        }
        this.addQuestion = this.addQuestion.bind(this);
    }

    componentDidMount() {
        const width = this.refs.questions.clientWidth;
        this.setState({width});
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

    addQuestion(val) {
        console.log(`addQuestion---- ${val}`)
        let questioner = { UserId: buyerID };
        let quest = {
            ProdCode: this.props.prodCode,
            Question: val,
            Questioner: questioner
        };
        let newFAQ = this.state.FAQs;
        newFAQ.push({ Question: val, Answer: "" })
        this.setState({ FAQs: newFAQ });

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

    }

    render() {
        return (
            <div ref="questions">
                {/*close button*/}
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose" ></a>
                </Swipeable>
                {/*all FAQ's*/}
                <ChatMsg FAQs={this.state.FAQs} chat="true" />

                <TextInput send={this.addQuestion} width={this.state.width} />
            </div>
        )
    }
}

export default AuctionFAQ;