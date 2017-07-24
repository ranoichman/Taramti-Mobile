//npm components
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import axios from 'axios';

// BID IT components
import ChatMsg from '../Generic/ChatMsg';
import TextInput from '../Generic/TextInput';

//constants 
import { auctionWS, buyerID } from '../../constants/general';

//style
import '../../css/modal.css';

class AuctionFAQ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FAQs: [],
            width: null,
            open: true
        }
        this.addQuestion = this.addQuestion.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        const width = this.refs.questions.clientWidth;
        console.log(`faq ---- ${width}`)
        this.setState({ width });
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

    //function to send new question
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

    //handle close modal
    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600) //update parent component
    }

    render() {
        return (
            <div  className={this.state.open ? "FAQbox" : "FAQbox zoomOut"}>
                <div ref="questions">
                    {/*close button*/}
                    <Swipeable onTap={this.close}>
                        <a className="boxclose" ></a>
                    </Swipeable>
                    {/*all FAQ's*/}
                    <ChatMsg FAQs={this.state.FAQs} chat={this.props.chat} />

                    {this.props.chat ? <TextInput send={this.addQuestion} width={this.state.width} /> : <span></span>}
                </div>
            </div>
        )
    }
}

export default AuctionFAQ;