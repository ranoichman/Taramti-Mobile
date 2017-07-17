import React, { Component } from 'react';

import ThemeAuctions from '../Generic/ThemeAuctions';
import Menu from '../Generic/Menu';

class MyProducts extends Component {
    constructor(props){
        super(props);

    }


    render() {
        return (
            <div className="pageReact" style={{ minHeight: window.innerHeight }}>
                <Menu/>
                <ThemeAuctions theme="myProducts" />
            </div>
        );
    }
}

export default MyProducts;