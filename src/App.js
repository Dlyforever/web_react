import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Index from './routes/Index/Index';
import DetailOpinion from './routes/DetailOpinion/DetailOpinion';
import MulOpinion from './routes/Multilingual/MulOpinion/MulOpinion'
import BiddingOpinion from './routes/BiddingOpinion/Biddingpinion/Biddingpinion'
import Login from './routes/Login/Login'
class App extends Component {
  componentWillMount() {
    var orignalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key,newValue){
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this,arguments);
    }
  }
  render() {
    return (
        <Router>
            <Switch>
              <Route path="/detail" component={DetailOpinion}/>
              <Route path="/multilingual/detail/:sid/:languages/:param/:lang" component={MulOpinion}/>
              <Route path="/multilingual/detail/" component={BiddingOpinion}/>
              <Route path="/login" exact component={Login}/>
              <Route path="/" component={Index} />
              {/* <Route exact path="/login" component={Login}/> */}
            </Switch>
        </Router>
    )
  }
}
export default App;
