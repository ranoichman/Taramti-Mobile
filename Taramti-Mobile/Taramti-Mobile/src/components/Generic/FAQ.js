import React, { Component } from 'react';
import Collapse, { Panel } from 'rc-collapse';
import axios from 'axios';

import TextInput from './TextInput';

//style
import '../../css/message.css';


import { auctionWS, buyerID } from '../../constants/general';

class FAQ extends Component {
    constructor(props) {
        super(props);

        this.displayAnswer = this.displayAnswer.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
    }

    displayAnswer() {
        return (this.props.faq.Answer !== "" ? this.props.faq.Answer :
            this.props.chat === "true" ? "המוכר טרם השיב לשאלה, נא להיעזר בסבלנות" : <TextInput send={this.addAnswer} />)
    }

    addAnswer(val) {
        console.log(`ans ---- ${val}`)
        console.log(`code ---- ${this.props.faq.QuestionCode}`)

        let question = this.props.faq;
        question["Answer"] = val;
        const self = this;

        axios.post(auctionWS + 'AddAnswer', {
            quest: question
        }).then(function (response) {
            let res = JSON.parse(response.data.d);
            // res.map(self.addAuction);
           // self.setState({ FAQs: res })
        })
            .catch(function (error) {
                console.log(error);
            });







    }

    render() {
        return (
            <p className={this.props.display ? "response" : "responseInActive"}>
                {this.displayAnswer()}
            </p>
        );
    }
}

export default FAQ;

