//npm components
import React, { Component } from 'react';

// BID IT components
import ThemeAuctions from '../Generic/ThemeAuctions';
import Menu from '../Generic/Menu';
import CircleButton from '../Generic/CircleButton';

class MyProducts extends Component {
    constructor(props){
        super(props);

    }


    render() {
        return (
            <div className="pageReact" style={{ minHeight: window.innerHeight }}>
                <Menu/>
                <ThemeAuctions theme="myProducts" />

                {/*home page fixed circle*/}
                <CircleButton home={true} />
            </div>
        );
    }
}

export default MyProducts;