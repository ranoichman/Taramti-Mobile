import React, { Component } from 'react';

class Ddl extends Component {
    constructor(props) {
        super(props)
this.ddlChanged = this.ddlChanged.bind(this);

    }

    eachOption(opt, i) {
        return (
            <option value={opt.val} label={opt.text}>{opt.text}</option>
        )
    }

ddlChanged(){
this.props.onChange(this.refs.ddl);

}


    render() {
        return (
            <select ref="ddl" onChange={this.ddlChanged} style={{width:"100%"}}>
                {this.props.options.map(this.eachOption)}
            </select>
        );
    }
}

export default Ddl;