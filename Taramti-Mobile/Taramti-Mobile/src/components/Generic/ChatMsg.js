import React, { Component } from 'react';

//style
import '../../css/message.css';

class ChatMsg extends Component {
    constructor(props){
        super(props)
    }



    render() {
        return (
            <div>
                <div className="animate question">יש לי איזו שאלה  </div>
                <p className="animate response">והנה התשובה לשאלה הזאת</p>
            </div>
        );
    }
}

export default ChatMsg;