import React, { Component } from 'react';
import Modal from 'react-modal';

import Payment from "./Payment"

class Bdika extends Component {

    constructor(props) {
        super(props);
        this.state = {
            PaymentModalIsOpen: false
        }
        this.changeModalOpen = this.changeModalOpen.bind(this);
    }

    changeModalOpen() {
        let newStatus = !this.state.PaymentModalIsOpen;
        this.setState({
            PaymentModalIsOpen: newStatus
        });
    }

    render() {
        const auc = {
                price: 100,
                percentage: 15,
                prodName: "שם מגניב למוצר",
                
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
            </div>
        );
    }
}

export default Bdika;