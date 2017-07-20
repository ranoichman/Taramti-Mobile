//import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import Modal from 'react-modal';
import Slider from 'react-slick';

import '../../css/transition.css';

class Pic extends Component {
    constructor() {
        super();
        this.state = {
            index: 0,
            carouselModalIsOpen: false,
            animationDirection: "left"
        };
        this.imgSwipeLeft = this.imgSwipeLeft.bind(this);
        this.imgSwipeRight = this.imgSwipeRight.bind(this);
        this.changeCarouselModalOpen = this.changeCarouselModalOpen.bind(this);
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


    changeCarouselModalOpen() {
        let newstatus = !this.state.carouselModalIsOpen
        this.setState({ carouselModalIsOpen: newstatus });
        this.props.picModalChanged();
    }

    render() {
        const settings = {
            infinite: false,
            arrows: false,
            slidesToShow: 1,
            // rtl: true
        }

        return (
            <div>
                <Modal
                    isOpen={this.state.carouselModalIsOpen}
                    onRequestClose={this.changeCarouselModalOpen}
                    contentLabel="open carousel"
                    className="picBox">
                    <Slider {...settings} style={{ height: 0 }}>
                        {this.props.imagesArr.map((imageUrl, i) => { return <img key={i} src={imageUrl} className="pic" style={{ display: "inline" }} /> })}
                    </Slider>
                </Modal>

                <img className="pic" style={{ borderRadius: "18%" }} onClick={this.changeCarouselModalOpen} src={this.props.imagesArr[this.state.index]} />

            </div>
        );
    }
}

export default Pic;