import React, { Component } from 'react';
import Collapse, { Panel } from 'rc-collapse';

//style
import '../../css/message.css';

class FAQ extends Component {
    constructor(props) {
        super(props);

        this.displayAnswer = this.displayAnswer.bind(this);

    }

    displayAnswer() {
        if (this.props.chat === "true") {
            return (this.props.faq.Answer !== "" ? this.props.faq.Answer : "המוכר טרם השיב לשאלה, נא להיעזר בסבלנות")
        } else {
            return (this.props.faq.Answer !== "" ? this.props.faq.Answer : <TextInput send={this.addQuestion} />)
        }
    }

    render() {
        return (
                <p className={this.props.active === this.key ? "response" : "responseInActive"}>
                    {/*{item.Answer !== "" ? item.Answer : <TextInput send={this.addQuestion} />}*/}
                    {this.displayAnswer()}
                </p>
            // <Panel className="question" header={this.props.faq.Question} key={this.props.key} >
            //     <p className={this.state.activeKey == this.props.key ? "response" : "responseInActive"}>
            //         {/*{item.Answer !== "" ? item.Answer : <TextInput send={this.addQuestion} />}*/}
            //         {this.displayAnswer()}
            //     </p>
            // </Panel>
        );
    }
}

export default FAQ;

