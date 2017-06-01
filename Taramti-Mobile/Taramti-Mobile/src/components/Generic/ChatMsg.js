import React, { Component } from 'react';
import Collapse, { Panel } from 'rc-collapse';

//style
import '../../css/message.css';

class ChatMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: 0
            
        }
        this.generateFAQ = this.generateFAQ.bind(this);
    }

    //function that returns a render of 1 FAQ
    generateFAQ(item, i) {
        return (
            <Panel className="question" header={item.question} key={i}>
                <p className={this.state.activeKey == i ? "response" : "responseInActive"}>
                    {item.answer !== "" ? item.answer : "המוכר טרם השיב לשאלה, נא להיעזר בסבלנות"}
                </p>
            </Panel>
        )

    }

    render() {
        // const FAQs = this.props.
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