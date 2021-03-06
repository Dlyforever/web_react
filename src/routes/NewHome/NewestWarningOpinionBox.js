import React from 'react';
import {connect} from 'react-redux';
import IconFont from '../../components/IconFont';
import BlankPage from '../../base/Exception/BlankPage';
import './NewestWarningOpinionBox.less';
import { Tabs,Icon } from 'antd';
import {history} from '../../utils/history';
import {BLUES} from '../../utils/colors';
const TabPane = Tabs.TabPane;

class NagetiveOpinion extends React.Component {
    constructor() {
        super();
        this.state = {
            datetagType:'all'
        }
     }
    clickItemTitle(sid) {
        window.open(window.location.origin + window.location.pathname + '#/detail/' + sid);
    }

    goAllOpinion() {
        history.push({
            pathname: '/allopinion/allopiniondetail?datetag='+this.state.datetagType +'&neg=2'
        });
    }
    datetagType(key){
        let datetag = {
            '1': 'all',
            '2':'today'
         }
         this.setState({
             datetagType:datetag[key]
         })
    }
    delNewestWarningOpinionBox(){
          this.props.delNewestWarningBox(1);
    }
    render() {
        const {todayOpinion,alldayOpinion,themeColor} = this.props;
        const more = this.props.status!=='setting'?<span  onClick={this.goAllOpinion.bind(this)}>
        <IconFont type="icon-gengduo" style={{color: '#9b9b9b',fontSize: '16px',marginLeft:'6px'}}/>
        </span>:<Icon type="close-circle" className="delModule" style={{fontSize: '18px',color:BLUES}}
        onClick={this.delNewestWarningOpinionBox.bind(this)}
        ></Icon>;
        const haverClass = themeColor.topColor.backgroundColor === '#373d41' ? 'white':'black';
        const blankFlag = themeColor.topColor.backgroundColor === '#373d41' ? true:false;
        return (
            <div className="newest-warning-opinion-box" style={{background:themeColor.bottomColor.backgroundColor}}>
                <div className="container">
                    <div className="top" style={{borderBottom: `1px solid ${themeColor.borderColor.color}`}}>
                        <div className="title">
                            <IconFont type="icon-shandian" style={{color: BLUES,fontSize: '21px',verticalAlign:'-5px'}}/>
                            <span className="txt" style={{color:themeColor.textColor.color}}>预警舆情</span>
                            {/* <span className="txt" style={{color:BLACK}}>特推信息</span> */}
                        </div>
                        <div className="more">
                               {more}
                        </div>
                    </div>
                    <div className="bottom">
                        <Tabs defaultActiveKey="1" onChange={this.datetagType.bind(this)} tabBarStyle={{color:themeColor.textColor.color,borderBottom:`1px solid ${themeColor.borderColor.color}`}}>
                        <TabPane tab="全部" key="1">
                                <ul className="list">
                                    {alldayOpinion.length > 0 ?
                                        alldayOpinion.map((item,index) =>
                                        <li key={index} className={`list-item ${haverClass}`} onClick={this.clickItemTitle.bind(this,item.sid)}
                                        >
                                            <div className="content">
                                                <div className="title" style={{color:themeColor.textColor.color}}>{item.title}</div>
                                                <div className="desc">
                                                    <span className="time">{item.pubdate.substring(10)}</span>
                                                    <span className="source">{item.source}</span>
                                                </div>
                                            </div>
                                        </li>
                                        ) : <BlankPage  status={blankFlag} desc='<span>空空如也，赶紧去<a href="index.html#/allopinion/warnsetting">添加</a>关键词</span>'/>
                                    }
                                </ul>
                            </TabPane>
                            <TabPane tab="最新" key="2">
                                <ul className="list">
                                    {todayOpinion.length > 0 ?
                                        todayOpinion.map((item,index) =>
                                        <li key={index} className={`list-item ${haverClass}`} onClick={this.clickItemTitle.bind(this,item.sid)}>
                                            <div className="content">
                                                <div className="title" style={{color:themeColor.textColor.color}}>{item.title}</div>
                                                <div className="desc">
                                                    <span className="time">{item.pubdate.substring(10)}</span>
                                                    <span className="source">{item.source}</span>
                                                </div>
                                            </div>
                                        </li>
                                        ) : <BlankPage  status={blankFlag} desc='<span>空空如也，赶紧去<a href="index.html#/allopinion/warnsetting">添加</a>关键词</span>'/>
                                    }
                                </ul>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
      themeColor: state.changeThemeReducer
    }
  };
export default  connect(mapStateToProps, null)(NagetiveOpinion);
