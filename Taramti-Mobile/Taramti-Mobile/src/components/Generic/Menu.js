import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

//style
import '../../css/menu.css';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: 'menuB',
            reDirect: false
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

        if (this.state.reDirect && !this.props.home) {
            return <Redirect push to="/"/>
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

                        <li><a onClick={()=> this.setState({reDirect:true})}>דף הבית</a><label>|</label></li>
                        <li><a onClick={()=> location.href='AddingAuction-Taramti.html'}>הוספת מכרז</a><label>|</label></li>
                        <li><a onClick={()=> location.href='userDetails.html'}>פרופיל משתמש</a><label>|</label></li>
                        <li><a onClick={()=> location.href='appSettings.html#Settings.html'}>הגדרות אפליקציה</a><label>|</label></li>
                        <li><a onClick={()=> location.href='appSettings.html#SearchAssoc'}>פרטי עמותות</a><label>|</label></li>
                        <li><a onClick={()=> location.href='RegisterAssoc-Taramti.html'}>הוספת עמותה</a></li>

                        {/* <!--<li><a class="active" href="#"><i class="fa fa-home"></i>Home</a><label>|</label></li>--> */}
                    </ul>
                </div>
                <div className="clearfix"> </div>
            </div>
        );
    }
}

export default Menu;