import React, { Component } from 'react';
import Collapse, { Panel } from 'rc-collapse';

import TextInput from './TextInput';
import FAQ from './FAQ';

//style
import '../../css/message.css';

class ChatMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: 0
        }
        this.generateFAQ = this.generateFAQ.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
    }

    //function that returns a render of 1 FAQ
    generateFAQ(item, i) {
        return (
            <Panel className="question" header={item.Question} key={i}>
                <FAQ faq={item} key={i} active={this.state.activeKey} chat="true" />
            </Panel>
            // <Panel className="question" header={item.Question} key={item.QuestionCode}>
            //     <p className={this.state.activeKey == i ? "response" : "responseInActive"}>
            //         {/*{item.Answer !== "" ? item.Answer : <TextInput send={this.addQuestion} />}*/}
            //         {this.postAnswer(item.Answer)}
            //     </p>
            // </Panel>
        )
    }

    postAnswer(ans){
        if (this.props.chat === "true") {
            return (ans !== "" ? ans : "המוכר טרם השיב לשאלה, נא להיעזר בסבלנות")
        } else {
            return (ans !== "" ? ans : <TextInput send={this.addQuestion} />)
        }
    }

    render() {
        
        return (
            <div>
                <Collapse accordion={true} onChange={(activeKey) => this.setState({ activeKey })}>
                    {this.props.FAQs.map(this.generateFAQ)}
                </Collapse>
            </div>
        );
    }
}

export default ChatMsg;