import React, { Component } from 'react';
import Swipeable from 'react-swipeable';


class TextInput extends Component {
    constructor(props) {
        super(props);
        this.sendText = this.sendText.bind(this);
    }

    sendText() {
        this.props.send(this.refs.newText.value);
    }

    render() {
        return (
            <div >
                <textarea ref="newText" rows="2" cols="25" />
                <Swipeable onTap={this.addQuestion}>
                    <div>
                    {/*<div className="circle">*/}
                      <i className="zmdi zmdi-mail-send"></i>
                      {/*<i className="zmdi zmdi-mail-send zmdi-hc-fw zmdi-hc-rotate-180"></i>*/}
                      </div>
                </Swipeable>
            </div>
        );
    }
}

export default TextInput;