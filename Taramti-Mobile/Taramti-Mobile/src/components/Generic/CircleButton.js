import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CircleButton extends Component {
    constructor(props) {
        super(props)
        this.state={

        }
        this.renderHome = this.renderHome.bind(this);
        this.renderPlus = this.renderPlus.bind(this);
    }

    renderPlus(){
        return (
            // <div>
            //     <div className="RoundDivfixed">
            //          <div id="fixedCircle">
            //             <div> <Link to="/"><img src="images/circle-for-home.png" /></Link></div>
            //         </div> 
                    <div id="fixedPlus">
                        <div><Link to="/"> <img src="images/add_icon.png" /></Link></div>
                    </div>
            //     </div>
            // </div>
        );
    }
    renderHome(){
        return (
            <div>
                <div className="RoundDivfixed">
                    <div id="fixedCircle">
                        <div> <Link to="/"><img src="images/circle-for-home.png" /></Link></div>
                    </div>
                    <div id="fixedHome">
                        <div><Link to="/"> <img src="images/Home1600.png" /></Link></div>
                    </div>
                </div>
            </div>
        );
    }

     render() {
        // if (this.state.secondsRemaining >= 20870000) {
        if (this.props.home) {
            return (
                this.renderHome()
            )
        }
        else {
            return (
                this.renderPlus()
            )
        }
    }
}

export default CircleButton;



