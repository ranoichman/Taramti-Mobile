//import $ from 'jquery';
import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import Swipeable from 'react-swipeable';
import Modal from 'react-modal';
import Slider from 'react-slick';


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
        this.openCarouselModal = this.openCarouselModal.bind(this);
        this.closeCarouselModal = this.closeCarouselModal.bind(this);
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


    openCarouselModal() {
        this.setState({ carouselModalIsOpen: true });
    }

    closeCarouselModal() {
        this.setState({ carouselModalIsOpen: false })
    }

    render() {
        const settings = {
            infinite: true,
            arrows: false,
            slidesToShow: 1,
        }

        return (
            <div>
                <Modal
                    isOpen={this.state.carouselModalIsOpen}
                    onRequestClose={this.closeCarouselModal}
                    contentLabel="open carousel"
                    className="picBox">
                    <Slider {...settings}>
                        {this.props.imagesArr.map((imageUrl, i) => { return <img key={i} src={imageUrl} /> })}
                    </Slider>
                </Modal>
                <Swipeable onTap={this.openCarouselModal}>
                    <img className={this.state.animationDirection} src={this.props.imagesArr[this.state.index]} />
                </Swipeable>
            </div>
        );
    }
}

export default Pic;