import React, { Component } from 'react';
import Swipeable from 'react-swipeable';


import ChatMsg from '../Generic/ChatMsg';

import '../../css/modal.css';


class AuctionFAQ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FAQs: [{ question: "יש לי איזו שאלה", answer: "כל מיני מללים ועוד מלא מלא מללים והנה הוספתי קצת כדי שיהיה ככה בשביל התחושה הטובה והכיפית" },
            { question: "יש לי איזו שאלה", answer: "והנה התשובה לשאלה הזאת" },
            { question: "יש לי איזו שאלה", answer: "" },
            { question: "יש לי איזו שאלה", answer: "בלה בלה בלה בלה בלה בלה" },
            { question: "יש לי איזו שאלה", answer: "" }]
        }
        this.addQuestion = this.addQuestion.bind(this);
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
                    <textarea ref="newQ" rows="2" cols="25"/>
                    <Swipeable onTap={this.addQuestion}>
                        <div className="btn"> <span>הוסף שאלה</span> </div>
                    </Swipeable>
                </div>
            </div>
        )
    }
}

export default AuctionFAQ;