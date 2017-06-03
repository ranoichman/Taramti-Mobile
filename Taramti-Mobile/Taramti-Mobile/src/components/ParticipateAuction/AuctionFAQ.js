import React, { Component } from 'react';
import Swipeable from 'react-swipeable';


import ChatMsg from '../Generic/ChatMsg';

import '../../css/modal.css';


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
            self.setState({ FAQ: res })
        })
            .catch(function (error) {
                console.log(error);
            });
    }


    addQuestion() {
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

                <div >
                    <textarea ref="newQ" rows="2" cols="25" />
                    <Swipeable onTap={this.addQuestion}>
                        <div className="btn"> <span>הוסף שאלה</span> </div>
                    </Swipeable>
                </div>
            </div>
        )
    }
}

export default AuctionFAQ;