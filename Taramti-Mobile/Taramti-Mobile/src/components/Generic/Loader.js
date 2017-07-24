//npm components
import React, { Component } from 'react';

class Loader extends Component {
    render() {
        if (this.props.loaded) {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className="loader">
                    <img id="LoadingImg" src={require("../../../www/img/just_logo.png")} />
                    <h3 style={{ position:"fixed", left:"37%", top:"50%", textAlign: "center"  }}>{this.props.loadingText}</h3>

                    <div style={{ display: "none" }}>
                        {this.props.children} 
                    </div>
                </div>
            );
        }

    }
}

export default Loader;