import React, { Component } from 'react';
import Swipeable from 'react-swipeable';

import Ddl from './Ddl';

import '../css/modal.css';


class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 0
        }

    }

    onSelected(opt) {
        console.log(`selected: ${opt}`)
        this.setState({ selected: opt });
    }

    render() {
        return (
            <div className="box">
                <Swipeable onTap={this.props.closeModal}>
                    <a className="boxclose"></a>
                </Swipeable>
                <div>
                    <form>
                        <h3>קטגוריית מוצר</h3>
                        <Ddl onChange={this.logChange} options={[{ val: '1', text: 'One' },
                        { val: '2', text: 'Two' }, { val: '3', text: 'three' }, { val: '4', text: 'four' }
                        ]} />
                        <h3>מחיר בש"ח</h3>
                        <input type="text" ref="lowerPrice" placeholder="מ..." />
                        <input type="text" ref="higherPrice" placeholder="עד..." />
                    </form>

                </div>
            </div>
        )
    }
}

export default Search;