import React from 'react'
import { Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'

import {Menu, Select, DatePicker, Input, message, Icon} from 'antd'
import {
  evidListRequested
} from '../../redux/actions/createActions'
import request from '../../utils/request';
import {history} from '../../utils/history'
import {api_evidadmin_typeList} from '../../services/api'
import Interent from './Interent/Interent'
import './EvidenceManagement.less'
const Option = Select.Option;
// const { RangePicker } = DatePicker
class EvidenceManagement extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          current: 'interent',
          date: [],
          selectcurrent: '1',
          optionArr: [],
          casetypecurrent: '',
          paramstate: 0,
          iptValue: '',
          startValue: null,
          endValue: null
      }
  }
  componentDidMount() {
    request(api_evidadmin_typeList).then(res => {
      if(parseInt(res.data.code, 10) === 1) {
        this.setState({
          optionArr: res.data.data
        })
      }
      
    })
  }

  handleClick(value) {
    this.setState({
      current: value.key
    })
    // history.push('/allopinion/evidencemanagement/' + value.key)
    let param = {
      page: 1,
      pagesize: 10,
      state: 0
    }
    if(value.key === 'publicsentiment') param.state = 1
    this.setState({
      paramstate: param.state
    })
    this.props.evidListRequest(param)
    history.push('/allopinion/evidencemanagement/interent/' + (value.key === 'interent' ? 0 : 1))
  }
  onDateChange(date, dateString) {
    if(date.length <= 0) {
      this.setState({
        date: date
      })
      return
    }
    this.setState({
      date: dateString
    })
    // const startTime = parseInt(date[0].format('x'))
    // const endTime = parseInt(date[1].format('x'))
    let param = {
      typeId: this.state.casetypecurrent,
      title: this.state.iptValue,
      packageName: this.state.iptValue,
      startTime: dateString[0],
      endTime: dateString[1],
      state: this.state.paramstate
    }
    switch(this.state.selectcurrent) {
      case '1' :
        delete param.title
        delete param.typeId
        if(param.packageName === '') return
        break;
      case '2' :
        delete param.title
        delete param.packageName
        if(param.typeId === '') return
        break;
      case '3' :
        delete param.typeId
        delete param.packageName
        if(param.title === '') return
        break
      default:
        break;  
    }
    this.props.evidListRequest(param)
  }
  onSelectChange(value) {
    this.setState({
      selectcurrent: value,
      packageName: '',
      typeId: '',
      title: '',
      packageName: '',
      startTime: '',
      endTime: '',
      state: ''
    })
    // switch (value) {
    //   case '1':
    //     let param = this.state.date.length > 0 ? {packageName: this.state.iptValue,state: this.state.paramstate, startTime: this.state.startValue && this.state.startValue.format('YYYY-MM-DD'), endTime: this.state.endValue && this.state.endValue.format('YYYY-MM-DD')}:
    //                                               {packageName: this.state.iptValue,state: this.state.paramstate}
    //     if(param.packageName !== '') this.props.evidListRequest(param)
    //     break;
    //   case '2':
    //     let param2 = this.state.date.length > 0 ? {typeId: this.state.casetypecurrent, state: this.state.paramstate, startTime: this.state.startValue && this.state.startValue.format('YYYY-MM-DD'), endTime: this.state.endValue && this.state.endValue.format('YYYY-MM-DD')}:
    //     {typeId: this.state.casetypecurrent,state: this.state.paramstate}
    //     if(param2.typeId !== '') this.props.evidListRequest(param2)
    //     break;
    //   case '3':
    //     let param3 = this.state.date.length > 0 ? {title: this.state.iptValue, state: this.state.paramstate, startTime: this.state.startValue && this.state.startValue.format('YYYY-MM-DD'), endTime: this.state.endValue && this.state.endValue.format('YYYY-MM-DD')}:
    //     {title: this.state.iptValue, state: this.state.paramstate}
    //     if(param3.title !== '') this.props.evidListRequest(param3)
    //     break;
    //   default:
    //     break;  
    // }
  }
  caseTypeChange(value) {
    this.setState({
      casetypecurrent: value
    })
    // let param = {
    //   typeId: value,
    //   startTime: this.state.startValue && this.state.startValue.format('YYYY-MM-DD'),
    //   endTime: this.state.endValue && this.state.endValue.format('YYYY-MM-DD'),
    //   state: this.state.paramstate
    // }
    // if(param.endTime === null) {
    //   delete param.endTime
    // }
    // if(param.endTime === null) {
    //   delete param.startTime
    // }
    // this.props.evidListRequest(param)
  }
  inputChange(e){
    this.setState({
      iptValue: e.target.value
    })
  }
  oniptBlur() {
    let param = {
      title:  this.state.iptValue,
      packageName: this.state.iptValue,
      startTime: this.state.startValue && this.state.startValue.format('YYYY-MM-DD'),
      endTime: this.state.endValue && this.state.endValue.format('YYYY-MM-DD'),
      state: this.state.paramstate
    }
    if(param.endTime === null) {
      delete param.endTime
    }
    if(param.endTime === null) {
      delete param.startTime
    }
    if(this.state.selectcurrent === '1') delete param.title
    if(this.state.selectcurrent === '3') delete param.packageName
    this.props.evidListRequest(param)
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    }, () => {
      const {startValue, endValue} = this.state
      // console.log(this.state.startValue)
      if(endValue && endValue.isBefore(startValue)) {
        this.setState({
          endValue: null,
          startValue: null
        })
        return message.error('开始时间请不要大于结束时间')
      }
      // else if(endValue.isAfter(Date.now())){
      //   this.setState({
      //     endValue: null
      //   })
      //   return message.error('结束时间请不要大于当前时间')
      // }else if(startValue.isAfter(Date.now())){
      //   this.setState({
      //     startValue: null
      //   })
      //   return message.error('开始时间请不要大于当前时间')
      // }
      // let param = {
      //   typeId: this.state.casetypecurrent,
      //   title: this.state.iptValue,
      //   packageName: this.state.iptValue,
      //   startTime: startValue.format('YYYY-MM-DD'),
      //   endTime: endValue.format('YYYY-MM-DD'),
      //   state: this.state.paramstate
      // }
      // switch(selectcurrent) {
      //   case '1' :
      //     delete param.title
      //     delete param.typeId
      //     break;
      //   case '2' :
      //     delete param.title
      //     delete param.packageName
      //     break;
      //   case '3' :
      //     delete param.typeId
      //     delete param.packageName
      //     break
      //   default:
      //     break;  
      // }
      // if(!param.packageName) delete param.packageName
      // this.props.evidListRequest(param)
    });
  }
  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }
  onsearch(){
    let param = {
      typeId: this.state.casetypecurrent,
      title: this.state.iptValue,
      packageName: this.state.iptValue,
      startTime: this.state.startValue&&this.state.startValue.format('YYYY-MM-DD'),
      endTime: this.state.endValue&&this.state.endValue.format('YYYY-MM-DD'),
      state: this.state.paramstate
    }
    switch(this.state.selectcurrent) {
      case '1' :
        delete param.title
        delete param.typeId
        break;
      case '2' :
        delete param.title
        delete param.packageName
        break;
      case '3' :
        delete param.typeId
        delete param.packageName
        break
      default:
        break;  
    }
    Object.keys(param).forEach(item => {
      let value = param[item]
      if(value === '' || value === null || value === undefined) {
        delete param[item]
      }
    })
    this.props.evidListRequest(param)
  }

  render() {
    const option =  this.state.optionArr.map((item, index) => {
          return <Option key={item.typeId}>{item.caseType}</Option>
        })
    return (
      <div className="evidence-management">
        <div className="title">
          <Menu
              onClick={this.handleClick.bind(this)}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              style={{lineHeight:'26px',backgroundColor: '#f0f2fb',border:'none'}}
          >
              <Menu.Item key="interent" style={{fontSize:'16px'}}>
                  互联网取证
              </Menu.Item>
              <Menu.Item key="publicsentiment" style={{fontSize:'16px'}}>
                  舆情取证
              </Menu.Item>
          </Menu>
          <div className="fifter">
              <div>
                <Select style={{width: 100, borderRight: 'none', zIndex:  99}} dropdownStyle={{zIndex: 99}} value={this.state.selectcurrent} 
                  onChange={this.onSelectChange.bind(this)}
                >
                  <Option key="1">证据包名称</Option>
                  <Option key="2">案件类型</Option>
                  <Option key="3">标题</Option>
                </Select>
                {
                  this.state.selectcurrent === '2' ?  
                  <Select style={{width: 200, zIndex:  99}} 
                    onChange={this.caseTypeChange.bind(this)} 
                    dropdownStyle={{zIndex: 99}}>{option}</Select>:
                  <Input style={{width: 200}} onChange={this.inputChange.bind(this)} value={this.state.iptValue} 
                    //onBlur={this.oniptBlur.bind(this)}
                  ></Input>
                }
              </div>
            
            {/* <RangePicker onChange={this.onDateChange.bind(this)} popupStyle={{zIndex: 99}}></RangePicker> */}
            <DatePicker
              disabledDate={this.disabledStartDate}
              showTime
              format="YYYY-MM-DD"
              value={this.state.startValue}
              placeholder="开始时间"
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
              style={{marginLeft: 20}}
            />
            <DatePicker
              disabledDate={this.disabledEndDate}
              showTime
              format="YYYY-MM-DD"
              value={this.state.endValue}
              placeholder="结束时间"
              onChange={this.onEndChange}
              onOpenChange={this.handleEndOpenChange}
              style={{marginLeft: 10}}
            />
            <span className="search">
              {/* <IconFont type="icon-fangdajing" style={{fontSize: 20, marginLeft: 10, height: 100, lineHeight: 28}}></IconFont> */}
              {/* <IconFont type="icon-fangdajing"></IconFont> */}
              <Icon type="search" style={{fontSize: 20, marginLeft: 10, height: "100%", lineHeight: "28px", color: '#ccc'}} onClick={this.onsearch.bind(this)}></Icon>
            </span>
          </div>
        </div>
        <div className="content">
          <Switch>
            <Route path="/allopinion/evidencemanagement/interent/:current" component={Interent}></Route>
          </Switch>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    evidListRequest: req => {
      dispatch(evidListRequested(req));
    }
  }
}
export default connect(null, mapDispatchToProps)(EvidenceManagement)
// WEBPACK FOOTER //
// src/routes/EvidenceManagement/EvidenceManagement.js