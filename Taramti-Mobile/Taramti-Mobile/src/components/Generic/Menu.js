import React, { Component } from 'react';

//style
import '../../css/menu.css';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: 'menuB'
        }
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick() {
        this.setState({ visible: this.state.visible == 'menuB' ? 'menuB visible' : 'menuB' });
    }


    //  $("span.nav-list-it5").click(function () {
    //                     $("ul.nav-top-list1").slideToggle("slow", function () {
    //                         // Animation complete.
    //                     });
    //                 });
    render() {

        const menuLabel = {
            display: "block",
            margin: "0 0 .4em",
            fontSize: "16px",
            fontWeight: 400,
            color: "#636363",
        }
        return (
            <div id="MenuBarDiv" style={{ zIndex: 150, position: "relative" }} className="navigation-1 navigation-5">

                <img id="LogoBidIt" src="images/LogoBidIt.png" style={{ left: this.props.home ? "40%" : "" }} />
                <div className="nav-left">
                    <img style={{ zIndex: 150, marginTop: 0, marginLeft: this.props.home ? "25%" : "" }} id="TaramtiLogo" src="images/LogoCircle.png" />
                </div>
                <div className="nav-right" onClick={this.handleClick} style={{marginTop:"13.7188px"}}>
                    <span className="nav-list-it5">
                        <i className="fa fa-bars"></i>
                    </span>


                    <ul className={`${this.state.visible}`}>

                        <li><a>דף הבית</a><label>|</label></li>
                        <li><a>הוספת מכרז</a><label>|</label></li>
                        <li><a>פרופיל משתמש</a><label>|</label></li>
                        <li><a>הגדרות אפליקציה</a><label>|</label></li>
                        <li><a>פרטי עמותות</a><label>|</label></li>
                        <li><a>הוספת עמותה</a></li>

                        {/* <!--<li><a class="active" href="#"><i class="fa fa-home"></i>Home</a><label>|</label></li>--> */}
                    </ul>
                </div>
                <div className="clearfix"> </div>
            </div>
        );
    }
}

export default Menu;