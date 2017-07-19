import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import TapDemo from './TapDemo';
import SwipeUPDemo from './SwipeUPDemo';
import SwipeDownDemo from './SwipeDownDemo';

class Tip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
        this.close = this.close.bind(this);
    }

    componentDidMount() {
         this.mHeight = this.refs.modal.clientHeight;
    }
    

    close() {
        this.setState({ open: false });
        setTimeout(() => this.props.closeModal(), 600)
    }

    render() {
        
        console.log(`height: ${this.props.height}`)
        return (
            <div ref="modal" className={this.state.open ? "tipBox" : "tipBox zoomOut"} style={{display:"inline-block"}}>
                <Swipeable onTap={this.close}>
                    <a className="boxclose" ></a>
                </Swipeable>
                {/* <TapDemo /> */}
                 {/* <SwipeUPDemo/>  */}
                 <SwipeDownDemo/> 
            </div>
        );
    }
}

export default Tip;