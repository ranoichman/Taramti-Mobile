//import $ from 'jquery';
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import '../css/tetris.css';

class Tetris extends Component {
    constructor() {
        super();
        
    }

  

    render() {
        return (
            <div className="gameBlock">
                <img src="https://cdn-cloudflare.pelfusion.com/wp-content/uploads/2011/06/flash-tetris-game.jpg" style={{marginTop:"0px"}}/>
            </div>
        );
    }
}

export default Tetris;