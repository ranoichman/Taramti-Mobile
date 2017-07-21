import React, { Component } from 'react';

class ScrollButton extends Component {
  constructor() {
    super();

    this.state = {
        intervalId: 0
    };
      this.scrollToTop = this.scrollToTop.bind(this);
      this.scrollStep = this.scrollStep.bind(this);
  }
  
  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }
  
  scrollToTop() {
    let intervalId = setInterval(this.scrollStep, this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }
  
  render () {
      // return <button title='Back to top' className='scroll' 
      //          onClick={ () => { this.scrollToTop(); }}>
      //           <span className='arrow-up glyphicon glyphicon-chevron-up'></span>
      //         </button>;
      return <a onClick={ () => { this.scrollToTop(); }} id="toTop" style={{display:"block"}}> <span id="toTopHover" style={{opacity:1}}> </span></a>
   }
} 
  
  
  export default ScrollButton;