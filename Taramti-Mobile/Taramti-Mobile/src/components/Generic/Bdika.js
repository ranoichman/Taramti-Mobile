import React, { Component } from 'react';
import Modal from 'react-modal';

import Payment from "./Payment"
import Home from '../Home/Home';


import '../../css/balloon.css';
import '../../css/transition.css';


class Bdika extends Component {

    constructor(props) {
        super(props);
        this.state = {
            PaymentModalIsOpen: false,
            curIndex: 0,
            formerIndex: 0,
            float: false,
            width: null,
            height: null,
            loading:false
        }
        this.changeModalOpen = this.changeModalOpen.bind(this);
        this.infalteB = this.infalteB.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        setTimeout(()=> this.setState({loading:true}),3000)
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }




    changeModalOpen() {
        let newStatus = !this.state.PaymentModalIsOpen;
        this.setState({
            PaymentModalIsOpen: newStatus
        });
    }
    infalteB() {
        let i = this.state.curIndex;
        this.setState({ formerIndex: i, curIndex: i === 2 ? 0 : ++i });
    }






    render() {
        const auc = {
            price: 100,
            percentage: 15,
            prodName: "שם מגניב למוצר",

        }

        const balloonDim = [
            {
                width: "17%",
                height: "11%"
            },
            {
                width: "30%",
                height: "20%"
            },
            {
                width: "47%",
                height: "33%"
            }
        ]

        let keyframes =
            `@keyframes inflate {
            0% {${balloonDim[this.state.curIndex]}} 
            100% {${balloonDim[this.state.formerIndex]}}
        }`;

        let style = {
            width: balloonDim[this.state.curIndex]["width"],
            height: balloonDim[this.state.curIndex]["height"],
            animation: "inflate 1s"
        }

        let float = {
            //  width: balloonDim[this.state.curIndex]["width"],
            //  height: balloonDim[this.state.curIndex]["height"],
            // animation: "releaseB 4s"

            animation: "inflateLarge 1.5s"




            // WebkitTransform: `translate(0,-${this.state.height-130}px) scale(1.5, 1)`,
            // opacity: 0,
            // WebkitTransition: "4s cubic-bezier(.65, 2, .03, .32)"
        }

        return (
            <div>
                <button onClick={this.changeModalOpen}>פתח</button>
                <Modal
                    isOpen={this.state.PaymentModalIsOpen}
                    contentLabel="open FAQ"
                    className="FAQbox">
                    <Payment closeModal={this.changeModalOpen} auc={auc} />

                </Modal>
                {/*<button onClick={this.infalteB}>נפח</button>
                <button onClick={() => this.setState({ float: true })}>שחרר</button>
                <div id="float"></div>
                <div className="balloon" style={this.state.float? float: style}></div>
                <div className="pyro" style={this.state.float?  {display:"block"}: {display:"none"}}>
                    <div className="before"></div>
                    <div className="after"></div>
                </div>*/}

                <img src={"http://proj.ruppin.ac.il/bgroup51/prod/Uploads/logos/just_logo.png"} className="loading" />
                <img src={"../../../www/img/just_logo.png"} className="loading" />

            </div>
        );
    }
}

export default Bdika;