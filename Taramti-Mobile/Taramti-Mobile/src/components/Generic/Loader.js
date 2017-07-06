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
                <div>
                    {/*<img src={"http://proj.ruppin.ac.il/bgroup51/prod/Uploads/logos/just_logo.png"} className="loading" />*/}
                    <img src={"../../../www/img/just_logo.png"} className="loading" />
                    <div style={{ display: "none" }}>
                        {this.props.children}
                    </div>
                </div>
            );
        }

    }
}

export default Loader;