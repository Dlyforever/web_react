import React, { Component } from 'react'
import { echarts } from 'echarts'
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines'
import request from '../../utils/request'
import {api_topic_message_list} from '../../services/api'
export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      docList: [],
      opts: {},
      nodes: [],
      edges: []
    }
  }
  componentDidMount() {
    request(api_topic_message_list +`&topicid=1853&pagesize=10`).then((res) => {
      this.setState({
        docList: res.data.docList,
     })
    })
  }
  datasort() {
    let nodes = []
    let edges = []
    let carry = {
      '新闻': 10,
      '平媒': -10,
      '微信': 30,
      '论坛': 80,
      '新闻': -80,
      'APP': 100
    }
    let sortArr = this.state.docList.sort((a, b) => {
      return Date.parse(a.pubdate)>Date.parse(b.pubdate)? 1 : -1
    })
    let medObj = {}
    sortArr.forEach((item, index) => {
      let obj = {}
      obj.color = `#${parseInt(Math.random() * 10, 10)}f19c${parseInt(Math.random() * 10, 10)}`
      obj.id = item.sid
      obj.label = item.title
      obj.size = Math.random() * 10
      obj.x = carry[item.carry] * Math.random() * 10
      obj.y = carry[item.carry] * Math.random() * 10
      nodes.push(obj)
      item.daytime = item.pubdate.split(' ')[0]
      item.isint = item.daytime.split('-')[2] === 0
      item.mtime = item.daytime.split(' ')[0].split('-')[1]
      item.time = Date.parse(item.daytime.split(' ')[0])

      medObj[item.mtime] instanceof Array ? medObj[item.mtime].push(item) : medObj[item.mtime] = Array(item)
      // obj[item.mtime].push(item)
      // console.log(obj)
    })
    let root = sortArr[0]
    // console.log(medObj)
    Object.keys(medObj).forEach(kitem => {
      let item = medObj[kitem]
      item.forEach((aitem, aindex) => {
        let obj = {
          
        }
        if(aindex === 0) {
          obj.sourceID = aitem.sid
          obj.targetID = root.sid
        }else{
          obj.sourceID = aitem.sid
          obj.targetID = item[aindex -1].sid
        }
        
        edges.push(obj)
      })
    })
    console.log(edges)
    // console.log(obj) 
    // function getedges(root) {
    //   // sortArr.forEach(item => {
    //   //   if(item.title === root.title) {
    //   //     edges.push({
    //   //       sourceID: item.title,
    //   //       targetID: root.title
    //   //     })
    //   //     getedges(item)
    //   //   }
    //   // })
    //   sortArr.splice(sortArr.indexOf(root), 1)
    //   if(sortArr.indexOf(root) !== -1) {
    //     edges.push({
    //       sourceID: sortArr[sortArr.indexOf(root)].title,
    //       targetID: root.title
    //     })
    //     getedges(sortArr[sortArr.indexOf(root)])
    //   }
    // }
  }
 
  render() {
    let nodes = []
    let edges = []
    let carry = {
      '平媒': -10,
      '微信': 30,
      '论坛': 80,
      '新闻': -80,
      'APP': 20
    }
    let sortArr = this.state.docList.sort((a, b) => {
      return Date.parse(a.pubdate)>Date.parse(b.pubdate)? 1 : -1
    })
    let medObj = {}
    sortArr.forEach((item, index) => {
      let obj = {}
      obj.color = `#${parseInt(Math.random() * 10, 10)}f1${parseInt(Math.random() * 10, 10)}c${parseInt(Math.random() * 10, 10)}`
      obj.id = item.sid
      obj.label = item.title
      obj.size = Math.random() * 100
      obj.x = carry[item.carry] * Math.random() * 10
      obj.y = carry[item.carry] * Math.random() * 10
      nodes.push(obj)
      item.daytime = item.pubdate.split(' ')[0]
      item.isint = item.daytime.split('-')[2] === 0
      item.mtime = item.daytime.split(' ')[0].split('-')[1]
      item.time = Date.parse(item.daytime.split(' ')[0])

      medObj[item.mtime] instanceof Array ? medObj[item.mtime].push(item) : medObj[item.mtime] = Array(item)
      // obj[item.mtime].push(item)
      // console.log(obj)
    })
    let root = sortArr[0]
    // console.log(medObj)
    Object.keys(medObj).forEach(kitem => {
      let item = medObj[kitem]
      item.forEach((aitem, aindex) => {
        
        if(aindex !== 0) {
          let obj = {
          
          }
          obj.sourceID = item[aindex -1].sid
          obj.targetID = aitem.sid
          edges.push(obj) 
        }
      })
    })
    // console.log(edges, nodes)
    console.log(edges)
    console.log('####################')
    console.log(nodes)

    let opt = {
      title: {
        text: 'NPM Dependencies'
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series : [
          {
              type: 'graph',
              layout: 'none',
              // progressiveThreshold: 700,
              data: nodes.map(function (node) {
                  return {
                      x: node.x,
                      y: node.y,
                      id: node.id,
                      name: node.label,
                      symbolSize: node.size,
                      itemStyle: {
                          normal: {
                              color: node.color
                          }
                      }
                  };
              }),
              edges: edges.map(function (edge) {
                  return {
                      source: edge.sourceID,
                      target: edge.targetID
                  };
              }),
              label: {
                  emphasis: {
                      position: 'right',
                      show: true
                  }
              },
              roam: true,
              focusNodeAdjacency: true,
              lineStyle: {
                  normal: {
                      width: 0.5,
                      curveness: 0.3,
                      opacity: 0.7
                  }
              }
          }
      ]
    }
    return (
      <div>
        <h1></h1>
        <ReactEcharts
          option={opt}
          echarts={echarts}
          style={{height: '800px', width: '100%'}}
        />
      </div>
    )
  }
}
