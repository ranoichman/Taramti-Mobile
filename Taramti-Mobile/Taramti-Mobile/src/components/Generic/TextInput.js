import React, { Component } from 'react';
import Swipeable from 'react-swipeable';


class TextInput extends Component {
    constructor(props) {
        super(props);
        this.sendText = this.sendText.bind(this);
    }

    sendText() {
        console.log(`sendText---- ${this.refs.newText.value}`)
        this.props.send(this.refs.newText.value);
        this.refs.newText.value = "";
    }

    render() {
        return (
            <div >
                <textarea ref="newText" rows="2" cols="25" />
                <Swipeable onTap={this.sendText} className="icon_circle">
                      <i className="zmdi zmdi-mail-send zmdi-hc-fw zmdi-hc-rotate-180"></i>
                </Swipeable>
            </div>
        );
    }
}

export default TextInput;