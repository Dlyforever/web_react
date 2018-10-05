import React from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import request from '../../../utils/request';
import {api_interent_info_route} from '../../../services/api'
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/tooltip';
import './Routeinfo.less'
import img from'../../../assets/img/route.png'
class Routeinfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  componentDidUpdate(nextState,nextPorps){
      if(nextPorps.routerInfo !== this.props.routerInfo){
            let echarts_instance = this.echarts_react.getEchartsInstance();
            let currentIndex = -1;
            this.timer = setInterval(() =>  {
              var dataLen = this.props.routerInfo.datas.length;
              currentIndex = (currentIndex + 1) % dataLen;
              // 显示 tooltip
              echarts_instance.dispatchAction({
                type: 'showTip',
                seriesIndex: 1,
                dataIndex: currentIndex
              });
            }, 1000);
      }
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const {routerInfo} = this.props
    const opt = {
			backgroundColor: '#ffffff',
			grid: {
        top: 40,
        left: 50,
        right: 50,
        bottom: 50
      },
      xAxis: {
          splitLine: {
              show: false
          },
          axisLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLabel: {
              show: false
          },
          max: 1000,
          min: 0
      },
      yAxis: {
          silent: true,
          splitLine: {
              show: false
          },
          axisLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLabel: {
              show: false
          },
          max: 1000,
          min: 0
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}",
        position:'bottom',
        textStyle:{
          fontSize:'12px'
        }
      },
        series: 
        [
          {
		        coordinateSystem: 'cartesian2d',
		        type: 'lines',
		        polyline: false,
		        zlevel: 1,
		        effect: {
		            show: true,
		            constantSpeed: 100,
		            trailLength: 0.4,
		            symbolSize: 8,
		            symbol: 'arrow',
		            loop: true
		        },
		        lineStyle: {
		            normal: {
		                color: '#a6c84c',
		                opacity: 0.4,
		                curveness: 0,
		            },
		            emphasis:{
		            	width:2
		            }
		        },
		        data: routerInfo.lines
		      },
          {
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            polyline: false,
            zlevel: 2,
            symbol: 'image://' + img,
            symbolSize:40,
            data: routerInfo.datas
          }
        ]
    }
    return (
      <div className="route-info">
        <div className="roteImg">
        <ReactEchartsCore
            echarts={echarts}
            option={opt}
            lazyUpdate={true}
            ref={(e) => {this.echarts_react = e}}
        />
        </div>
        <div className="info">
          <div className="dns">
            <span>域名解析服务器</span>
            <ul>
              <li>
                <span>服务器ip</span>
                <span>{routerInfo.dns}</span>
              </li>
              <li>
                <span>端口</span>
                <span>53</span>
              </li>
            </ul>
          </div>
          <div className="domain">
            <span>目标域名别名</span>
            <ul>
              {routerInfo.CNAME && routerInfo.CNAME.map((item, index) => {
                return <li key={index}><span>目标域名{index + 1}</span><span>{item}</span></li>
              }) }
              
            </ul>
          </div>
          <div className="server-group">
            <span>目标服务器群</span>
            <ul>
              {routerInfo.servers && routerInfo.servers.map((item, index) => {
                return <li key={index}><span>服务器IP{index + 1}</span><span>{item}</span></li>
              })}
            </ul>
          </div>
          <div className="target-server">
          <span>取证目标服务器</span>
            <ul>
              <li><span>服务器IP1</span><span>{routerInfo.route && routerInfo.route[routerInfo.route.length-1]}</span></li>
            </ul>
          </div>

          <div target="route">
            <span>路由节点</span>
            <ul>
              
              {routerInfo.route && routerInfo.route.map((item, index) => {
                return <li key={index}><span>路由节点{index + 1}</span><span>{item}</span></li>
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
     routerInfo: state.evideinfoSucceeded.data
  }
};
export default connect(mapStateToProps,null)(Routeinfo);