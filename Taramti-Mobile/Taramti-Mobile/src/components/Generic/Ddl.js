//npm components
import React, { Component } from 'react';

class Ddl extends Component {
    constructor(props) {
        super(props)
        this.ddlChanged = this.ddlChanged.bind(this);

    }

    eachOption(opt, i) {
        return (
            <option key={i} value={opt.val} label={opt.text}>{opt.text}</option>
        )
    }

    ddlChanged() {
        this.props.onChange(this.refs.ddl.value);
    }

    render() {
        return (
            <select ref="ddl" onChange={this.ddlChanged} className={this.props.css} style={this.props.style}>
                {this.props.options.map(this.eachOption)}
            </select>
        );
    }
}

export default Ddl;