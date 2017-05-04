import './css/index.css';

//import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import Hello from './components/Hello';
import Auction from './components/Auction';


const App = React.createClass({
  getInitialState() {
    //return StepStore.getState();
    return {
      animationName: 'push',
      home:true,
      auctionsArr : [
    {
      price: 535,
      endDate: "5/5/2017",
      imgArr: [
        "img/image.png",
        "img/ASP.JPG",
        "img/Logo.JPG"
      ],
      prodName: "ספה שהיא נפתחת",
      prodDesc: "קצת מלל וכל מיני דברים שבא לי לכתוב וכן הנה עוד קצת דברים ותכף יהיו כאן גם תמונות וזה בסך הכל תיאור של מוצר גניהנכי חי כג הכ חיה יגכ הכגכ יחה גכ חיהד חכ החיגכ יח דגחב ד ח בגי דגח בגד בדב  "

    // },
    // {
    //   price: 1234,
    //   endDate: "5/6/2017",
    //   imgArr: [
    //     "img/Logo.JPG",
    //     "img/image.png",
    //     "img/ASP.JPG"
    //   ],
    //   prodName: "מחשב נייד",
    //   prodDesc: "בוא נכתוב כאן משהו שאפשר יהיה לראות שהכל עובד כמו שצריך. האם זה הצליח???"
    // },
    // {
    //   price: 15,
    //   endDate: "5/8/2017",
    //   imgArr: [
    //     "img/ASP.JPG",
    //     "img/Logo.JPG",
    //     "img/image.png"
    //   ],
    //   prodName: "שעון יד",
    //   prodDesc: "הנה כמה דברים שיש לי לומר  "
    }
  ]
    }
  },
  componentWillMount() {
    // Lifecycle function that is triggered just before a component mounts
  },
  componentWillUnmount() {
    // Lifecycle function that is triggered just before a component unmounts
  },






  render() {
    return (
      <div className="container-fluid">
        {
          this.state.auctionsArr.map(function (item, i) {
            return <Auction key={i} price={item.price} endDate={item.endDate} imgArr={item.imgArr} prodName={item.prodName} prodDesc={item.prodDesc} />
          })
        }
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));

