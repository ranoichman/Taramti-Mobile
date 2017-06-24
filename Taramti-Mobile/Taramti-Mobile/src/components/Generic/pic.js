//import $ from 'jquery';
import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';

class Pic extends Component {
    constructor() {
        super();
        this.state = {
            index: 0,
            animationDirection: "left"
        };
        this.imgSwipeLeft = this.imgSwipeLeft.bind(this);
        this.imgSwipeRight = this.imgSwipeRight.bind(this);
    }

    imgSwipeLeft() {
        var i = this.state.index - 1;
        if (i === -1) {
            this.setState({ index: this.props.imagesArr.length - 1 })
        }
        else { this.setState({ index: i }) }
    }
    imgSwipeRight() {
        var i = this.state.index + 1;
        if (i === this.props.imagesArr.length) {
            this.setState({ index: 0 })
        }
        else { this.setState({ index: i }) }
    }

    render() {
return(

    // <Swipeable ref="swipeIMG" onSwipedLeft={this.imgSwipeLeft} onSwipedRight={this.imgSwipeRight} >
    //                 <img ref="disIMG" src={this.props.imagesArr[this.state.index]} />
    //             </Swipeable>

            <CSSTransitionGroup
                transitionName="slideLeft"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                <Swipeable key={0} className={this.state.animationDirection} onSwipedLeft={this.imgSwipeLeft} onSwipedRight={this.imgSwipeRight} >
                    <img className={this.state.animationDirection} src={this.props.imagesArr[this.state.index]} />
                </Swipeable>
            </CSSTransitionGroup> 
                
        );
    }
}

export default Pic;