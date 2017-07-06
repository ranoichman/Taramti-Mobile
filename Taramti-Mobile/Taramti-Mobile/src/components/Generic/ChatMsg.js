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
            activeKey: 0,
        }
        this.generateFAQ = this.generateFAQ.bind(this);
    }

    //function that returns a render of 1 FAQ
    generateFAQ(item, i) {
        return (

            <Panel className="question" header={item.Question} key={i}>
                <FAQ faq={item} key={i} index={i} display={this.state.activeKey == i ? true:false} chat={this.props.chat} />
            </Panel>
        )
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