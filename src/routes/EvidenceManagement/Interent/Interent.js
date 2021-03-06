import React from 'react'
import { Checkbox, Pagination, Input, Modal, Button, Tooltip, message, Popover} from 'antd'
import {connect} from 'react-redux';
import {
  evidListRequested
} from '../../../redux/actions/createActions'
import {
  api_interent_check,
  api_interent_delete,
  api_interent_deitcasetype,
  api_interent_deitPackage,
  api_evidadmin_typeList,
  api_interent_reObtainEvidence
} from '../../../services/api'
import IconFont from '../../../components/IconFont'
import Select from '../../../components/Select/Select'
import request from '../../../utils/request'
import {history} from '../../../utils/history'
import './Interent.less'
import evidding from '../../../assets/img/evidding.gif'
class componentName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      checkArr: new Array(10).fill(false),
      typeEditInputShow: new Array(10).fill(false),
      evieEditInputShow: new Array(10).fill(false),
      evidValue: '',
      typeValue: '',
      visible: false,
      btn: false,
      fileName: '',
      modalstate: {},
      typeList: [],
      edittypevisible: false,
      allCaseType: '',
      editnamevisible: false,
      allname: '',
      page: 1,
      pagesize: 10,
      isrecheck: true
    }
  }
  componentDidMount() {
    let param = {
      state: 0,
      page: 1,
      pagesize: 10
    }
    this.timerreq = setInterval( () => {
      const param = {
        state: this.props.match.params.current,
        page:this.state.page,
        pagesize: this.state.pagesize
      }
      this.props.evidListRequest(param)
    }, 20000)
    request(api_evidadmin_typeList).then(res => {
      this.setState({
        typeList: res.data.data
      })
      this.props.evidListRequest(param)
    })
  }
  componentWillReceiveProps(nextprops) {
    if(nextprops.data && this.state.isrecheck) {
      this.setState({
        checkArr: Array(nextprops.data.content.length).fill(false),
        checked: false
      })
    }
    if(this.props.match.params.current !== nextprops.match.params.current) {
      this.setState({
        page: 1
      })
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerreq)
  }
  onAllChange(e) {
    let [...arr] = this.state.checkArr
    arr.fill(e.target.checked)
    this.setState({
      checked: e.target.checked,
      checkArr: arr
    })
  }
  onItemChange(index, e) {
    let [...arr] = this.state.checkArr
    arr[index] = e.target.checked
    
    const isEveryChecked = arr.every(item => {
      return (item === true);
    })
    // this.state.checked ?  this.setState({checked: false}) : ''
    this.setState({
      checkArr: arr,
      checked: isEveryChecked
    })
  }
  getchangeitem () {
    let arr = []
    this.state.checkArr.forEach((item, index) => {
      // if(item === true) arr.push(this.props.data.content[index])
      if(item === true) arr.push({id: this.props.data.content[index].id, fileId: this.props.data.content[index].fileID})
    })
    return arr
  }
  onShowSizeChange(current, pageSize) {
    this.setState({
      page: current,
      pagesize: pageSize,
    })
    const parme = {
      page: current,
      pagesize: pageSize,
      state: this.props.match.params.current
    }
    this.props.evidListRequest(parme)
  }
  onPageChange(current, pageSize) {
    this.setState({
      page: current,
      pagesize: pageSize,
    })
    const parme = {
      page: current,
      pagesize: pageSize,
      state: this.props.match.params.current
    }
    this.props.evidListRequest(parme)
  }
  ondbClick(index, type, e) {
    let [...arr] = this.state.evieEditInputShow
    let [...arr2] = this.state.typeEditInputShow
    arr.fill(false)
    arr2.fill(false)
    if(type === 'evieEditInput') {
      arr[index] = true
      this.setState({
        evidValue: e.target.innerText
      })
    }else if(type === 'typeEditInput'){
      arr2[index] = true
      this.setState({
        typeValue: e.target.innerText
      })
    }
    this.setState({
      typeEditInputShow: arr2,
      evieEditInputShow: arr
    }, () => {
      this['iptref' + index].focus()
    })
  }
  // 证据包修改
  editInputBlur(index, id, e) {
    let [...arr] = this.state.evieEditInputShow 
    arr[index] = false
    this.setState({
      evieEditInputShow: arr
    })
    const idarr = []
    idarr.push(id)
    request(api_interent_deitPackage + `&ids=${JSON.stringify(idarr)}&packageName=${e.target.value}`).then(res => {
      const param =  {
        state: this.props.match.params.current,
        page: 1,
        pagesize: 10
      }
      this.props.evidListRequest(param)
      this.setState({
        page: 1
      })
    })
  }
  valueChange(e) {
    this.setState({
      evidValue: e.target.value
    })
  }
  // 证据校验
  checkClick(fileID) {
    request(api_interent_check + `&fileID=${fileID}`).then(res => {
      this.setState({
        modalstate: res.data.data,
        visible: true,
        btn: true
      })
    })
  }
  oncheckModalCanle() {
    this.setState({
      visible: false
    })
  }
  downloadCertificate(fileName){
    window.open('http://103.94.42.70:5000/static/all/downloadFile/'+ fileName +'.tar.gz.dase.png')
  }
  onModalCanle() {
    this.setState({
      visible: false,
      btn: false,
      modalstate: {}
    })
  }
  // 下载
  download(fileName) {
    window.open('http://103.94.42.70:5000/static/all/downloadFile/'+ fileName +'.tar.gz')
  }
  // 删除
  deleteitem(fileId, id, index) {
    this.setState({
      isrecheck: false
    })
    const fileIdArr = []
    const idArr = []
    fileIdArr.push(fileId)
    idArr.push(id)
    const jsonFileId = JSON.stringify(fileIdArr)
    const jsonId = JSON.stringify(idArr)
    request(api_interent_delete + `&ids=${jsonId}&fileIDs=${jsonFileId}`).then(res => {
      if(res.data.code === 1) {
        const param =  {
          state: this.props.match.params.current,
          page: 1,
          pagesize: 10
        }
        let [...arr] = this.state.checkArr
        arr[index] = false
        this.setState({
          checkArr: arr,
          checked: false
        })
        this.props.evidListRequest(param)
        message.success('删除成功')
        this.setState({
          page: 1
        })
      }
    })

  }
  // 案件类型修改
  onTypeOk(index, id, value) {
    // console.log(value)
    // console.log(arguments)
    let [...arr] = this.state.typeEditInputShow
    arr[index] = false
    this.setState({
      typeEditInputShow: arr
    })
    let idArr = []
    idArr.push(id)
    request(api_interent_deitcasetype + `&ids=${JSON.stringify(idArr)}&caseType=${value}`).then(res => {
      const param =  {
        state: this.props.match.params.current,
        page: 1,
        pagesize: 10
      }
      this.props.evidListRequest(param)
      this.setState({
        page: 1
      })
    })
  }
  // 批量删除
  batchdelet() {
    const checkArr = this.getchangeitem()
    if(checkArr.length <= 0) {
      return message.error('无选中元素')
    }
    let idsarr = []
    let filesidarr = []
    checkArr.forEach(item => {
      idsarr.push(item.id)
      filesidarr.push(item.fileId)
    })
    request(api_interent_delete + `&ids=${JSON.stringify(idsarr)}&fileIDs=${JSON.stringify(filesidarr)}`).then(res => {
      if(res.data.code === 1) {
        message.success('删除成功')
        const param =  {
          state: this.props.match.params.current,
          page: 1,
          pagesize: 10,
          checked: false
        }
        this.props.evidListRequest(param)
        this.setState({
          page: 1
        })
      }
    })
  }

  // 批量 修改案件类型
  caseTypebtnClick() {
    this.setState({
      edittypevisible: true
    })
  }
  ondatachange(value) {
    this.setState({
      allCaseType: value
    })
  }
  onedittypecancel() {
    this.setState({
      edittypevisible: false
    })
  }
  onedittypeok() {
    const checkArr = this.getchangeitem()
    if(checkArr.length <= 0) {
      return message.error('无选中元素')
    }
    let idsarr = []
    checkArr.forEach(item => {
      idsarr.push(item.id)
    })
    request(api_interent_deitcasetype + `&ids=${JSON.stringify(idsarr)}&caseType=${this.state.allCaseType}`).then(res => {
      if(res.data.code === 1) {
        message.success('修改成功')
        const param =  {
          state: this.props.match.params.current,
          page: 1,
          pagesize: 10
        }
        this.setState({
          edittypevisible: false
        })
        this.props.evidListRequest(param)
        this.setState({
          page: 1
        })
      }
    })
  }

  // 批量 证据包名称
  nameBtnclick() {
    this.setState({
      editnamevisible: true
    })
  }
  onNameChange(e) {
    this.setState({
      allname: e.target.value
    })
  }
  onEditNameCancel() {
    this.setState({
      editnamevisible: false
    })
  }
  onEditNameOk() {
    // console.log(this.state.allname)
    const checkArr = this.getchangeitem()
    if(checkArr.length <= 0) {
      return message.error('无选中元素')
    }
    let idsarr = []
    checkArr.forEach(item => {
      idsarr.push(item.id)
    })
    request(api_interent_deitPackage + `&ids=${JSON.stringify(idsarr)}&packageName=${this.state.allname}`).then(res => {
      if(res.data.code === 1) {
        message.success('修改成功')
        const param =  {
          state: this.props.match.params.current,
          page: 1,
          pagesize: 10
        }
        this.props.evidListRequest(param)
        this.setState({
          editnamevisible: false,
          page: 1
        })
      }
    })
  }
  onItemClick(fileName,status) {
    if(status === '0'){   
        history.push({
          pathname: '/allopinion/evidinfo/routeinfo/' + fileName,
          search: `fileName=${fileName}`
        })
   }else{
       message.error(['取证完成', '正在取证', '取证等待', '取证失败'][parseInt(status,10)])
   }
  }

  // 重新取证 
  retakeEvid(url, id, fileID) {
    request(api_interent_reObtainEvidence + `&id=${id}&fileID=${fileID}&url=${url}`).then(res => {
      const param =  {
        state: this.props.match.params.current,
        page: 1,
        pagesize: 10
      }
      this.props.evidListRequest(param)
      this.setState({
        page: 1
      })
    })
  }
  render() {
    const timestamp = (date) => {
      const JsDate = new Date(date);
      const Y = JsDate.getFullYear() + '-';
      const M = (JsDate.getMonth()+1 < 10 ? '0'+(JsDate.getMonth()+1) : JsDate.getMonth()+1) + '-';
      const D = JsDate.getDate() + ' ';
      const h = JsDate.getHours()-0 < 10 ?  '0' + JsDate.getHours() + ':' : JsDate.getHours() + ':';
      const m = JsDate.getMinutes()-0 < 10 ? '0' + JsDate.getMinutes() + ':' : JsDate.getMinutes() + ':';
      const s = JsDate.getSeconds()-0 < 10 ? '0' + JsDate.getSeconds() + ':' : JsDate.getSeconds();
      return Y+M+D+h+m+s;
    }
    const content = (
      <div>
        <Button type="primary" onClick={this.nameBtnclick.bind(this)}>证据包名称</Button>
        <Button type="primary" style={{marginLeft: 20}} onClick={this.caseTypebtnClick.bind(this)}>案件类型</Button>
      </div>
    )
    return (
      <div className='interent'>
        <ul className='head'>
            <li className="operation-icon">
                <span>
                  <Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.checked}></Checkbox>
                </span>
                <Tooltip title="删除" placement="top">
                  <span onClick={this.batchdelet.bind(this)} style={{marginLeft: 15, marginRight: 5}}>
                    <IconFont type="icon-shanchu1-copy" style={{fontSize: 19}}></IconFont>
                  </span>
                </Tooltip>
                <Popover content={content} trigger="click" placement="bottom">
                  <Tooltip title="修改" placement="top">
                    <span>
                      <IconFont type="icon-zongliangluru" style={{fontSize: 18}}>
                      </IconFont></span>
                  </Tooltip>
                </Popover>
            </li>
            <li>&nbsp;&nbsp;文件</li>
            <li>&nbsp;&nbsp;证据域名</li>
            <li style={{textAlign:'center'}}>证据包名称</li>
            <li style={{textAlign:'center'}}>案件类型</li>
            <li style={{textAlign:'center'}}>操作</li>
            <li style={{textAlign:'center'}}>取证进度</li>
        </ul>
        <div className="content">
          <ul className="eviddata">
            {!this.props.data ? '' : this.props.data.content.map((item, index) => {
              return <li key={index}> 
              <ul className="eviditem">
                <li>
                  <Checkbox onChange={this.onItemChange.bind(this, index)} style={{marginLeft: '16%'}} checked={this.state.checkArr[index]}></Checkbox>
                  {(() => {
                     let img = ''
                     if(parseInt(item.status, 10) === 0) {
                      img = <img src={`http://103.94.42.70:5000/static/all/${item.fileName}/shot_s.png`} alt='图片'/>
                      //img = <img src={evidding} alt='图片'style={{border: '1px solid #ccc'}} />
                     }else if(parseInt(item.status, 10) === 1) {
                      img = <img src={evidding} alt='图片'style={{border: '1px solid #ccc'}} />
                     }else if(parseInt(item.status, 10) === 2) {
                      // img = <span style={{width: 80, height: 45, marginLeft: '30%', border: '1px solid #000'}}><img src={evidwait} alt='图片'/></span>
                      img = <span style={{width: 80, height: 70, marginLeft: '15%', border: '1px solid #ccc', lineHeight: '70px', textAlign: 'center', color: '#999'}}>取证等待</span>
                     }else if(parseInt(item.status, 10) === 3) {
                      img = <span style={{width: 80, height: 70, marginLeft: '15%', border: '1px solid #ccc', lineHeight: '70px', textAlign: 'center', color: '#999'}}>取证失败</span>
                     }
                     return img
                  })()}
                </li>
                <li onClick={this.onItemClick.bind(this, item.fileName,item.status)}>
                  <div>
                    <span>{item.title.substr(0, 23)}</span>
                    <span style={parseInt(this.props.match.params.current,10) === 0 ? {marginLeft: 0} : {}}>{timestamp(item.startTime)}</span>
                    {parseInt(this.props.match.params.current,10) !== 0 ? <span>关键词: {item.keywords}</span> :''}
                  </div>
                </li>
                <li style={{textAlign:'left'}}>{item.body}</li>
                <li onDoubleClick={this.ondbClick.bind(this, index, 'evieEditInput')}>{item.packageName ? item.packageName : '未知'}
                <Input 
                    type={this.state.evieEditInputShow[index] ? 'text' : 'hidden'}
                    onBlur={this.editInputBlur.bind(this, index, item.id)}
                    className="type-input"
                    autoFocus
                    value={this.state.evidValue}
                    onChange={this.valueChange.bind(this)}
                    ref={ ref => this['iptref' + index] = ref }
                  >
                  </Input>
                </li>
                <li onDoubleClick={this.ondbClick.bind(this, index, 'typeEditInput')}>{item.caseType ? item.caseType : '未知'} 
                  {/* <Input 
                    type={this.state.typeEditInputShow[index] ? 'text' : 'hidden'}
                    onBlur={this.editInputBlur.bind(this, index, 'typeEditInput')}
                    className='type-input'
                    autoFocus='autoFocus'
                    value={this.state.typeValue}
                    onChange={this.valueChange.bind(this, 'typeEditInput')}
                  >
                  </Input> */}
                  <Select
                    className='type-input'
                    defaultValut = {item.caseType}
                    list={this.state.typeList}
                    style={this.state.typeEditInputShow[index] ? {display: 'block'} : {display: 'none'}}
                    onOk={this.onTypeOk.bind(this, index, item.id)}
                    valueclear="true"
                    fkey={index}>
                  </Select>
                </li>
                <li className="item-icon">
                  <Tooltip title="删除" placement="top">
                    <span onClick={this.deleteitem.bind(this, item.fileID, item.id, index)}>
                      <IconFont type="icon-shanchu1-copy" style={{fontSize: 19}}>
                      </IconFont>
                    </span>
                  </Tooltip>
                  <Tooltip title="下载" placement="top">
                    <span onClick={this.download.bind(this, item.fileName)}>
                      <IconFont type="icon-msnui-download-copy" style={{fontSize: 19}}>
                      </IconFont>
                    </span>
                  </Tooltip>
                  <Tooltip title="证据校验" placement="top">
                    <span onClick={this.checkClick.bind(this, item.fileID)}>  
                      <IconFont type="icon-jiance1-copy" style={{fontSize: 19}}>
                      </IconFont>
                    </span>
                  </Tooltip>
                </li>
                {
                  parseInt(item.status,10) === 3 ? 
                  <li><Button onClick={this.retakeEvid.bind(this, item.url, item.id, item.fileID)}>重新取证</Button></li> : 
                  <li>{['取证完成', '正在取证', '取证等待', '取证失败'][item.status]}</li>
                }
                {/* {<li><Button onClick={this.retakeEvid.bind(this, item.url, item.id, item.fileID)}>重新取证</Button></li>} */}
              </ul>
            </li>
            })}
            {/* {this.state.arr.map((item, index) => {
              return <li key={index}> 
                        <ul>
                          <li><Checkbox onChange={this.onItemChange.bind(this, index)} checked={this.state.checkArr[index]}></Checkbox>假装是图片</li>
                          <li>
                            <span>时间时间</span>
                            <span>关键词: '关键词关键词关键词关键词'</span>
                          </li>
                          <li>www.xxx.sscom</li>
                          <li onDoubleClick={this.ondbClick.bind(this, index, 'evieEditInput')}>证据包名称
                          <Input 
                              type={this.state.evieEditInputShow[index] ? 'text' : 'hidden'}
                              onBlur={this.editInputBlur.bind(this, index, 'evieEditInput')}
                              className="type-input"
                              autoFocus
                              value={this.state.evidValue}
                              onChange={this.valueChange.bind(this, 'evieEditInput')}
                            >
                            </Input>
                          </li>
                          <li onDoubleClick={this.ondbClick.bind(this, index, 'typeEditInput')}>案件类型 
                            <Input 
                              type={this.state.typeEditInputShow[index] ? 'text' : 'hidden'}
                              onBlur={this.editInputBlur.bind(this, index, 'typeEditInput')}
                              className='type-input'
                              autoFocus='autoFocus'
                              value={this.state.typeValue}
                              onChange={this.valueChange.bind(this, 'typeEditInput')}
                            >
                            </Input>
                          </li>
                          <li><span>图标</span><span>图标</span><span>图标</span></li>
                          <li>取证中</li>
                        </ul>
                      </li>
            })} */}
            {/* <li>
              <img src="." alt=""/>
              <ul>
                <li><Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.checkArr[index]}></Checkbox>假装是图片</li>
                <li>
                  <span>时间时间</span>
                  <span>关键词: '关键词关键词关键词关键词'</span>
                </li>
                <li>www.xxx.sscom</li>
                <li>证据包名称</li>
                <li>案件类型</li>
                <li><span>图标</span><span>图标</span><span>图标</span></li>
                <li>取证中</li>
              </ul>
            </li> */}


          
          </ul>
        </div>
        <Pagination
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange.bind(this)}
          onChange={this.onPageChange.bind(this)}
          defaultCurrent={1}
          total={this.props.data && this.props.data.recordTotal}
          current={this.state.page}
          style={{textAlign: 'center', marginTop: 30}}>
        </Pagination>
        <Modal
              title='证据校验'
              visible={this.state.visible}
              footer={<Button type="primary" onClick={this.onModalCanle.bind(this)}>确定</Button>}
              onCancel={this.oncheckModalCanle.bind(this)}
            >
              <div className='evidcheck'>
                <ul>
                  <li>
                      <div><span></span><h4 className="info">证据包信息</h4></div>
                      <ul>
                        <li><span>文件名：</span><span>{this.state.modalstate.fileName}</span></li>
                        <li><span>编号：</span><span>{this.state.modalstate.id}</span></li>
                        <li><span>校验值：</span><span>{this.state.modalstate.verifydata}</span></li>
                        <li><span>算法：</span><span>{this.state.modalstate.category}</span></li>
                      </ul>
                    </li>
                  <li className='two'>
                    <div><span></span><h4 className="info">证据包信息</h4></div>
                    <ul>
                      <li>一、连接校验服务器<span><IconFont type="icon-duihao" style={{color: 'green', marginLeft: 10}}></IconFont></span></li>
                      <li>二、检查快照<IconFont type="icon-duihao" style={{color: 'green', marginLeft: 10}}></IconFont></li>
                      <li>三、检查路由信息<IconFont type="icon-duihao" style={{color: 'green', marginLeft: 10}}></IconFont></li>
                      <li>四、检查底层协议信息<IconFont type="icon-duihao" style={{color: 'green', marginLeft: 10}}></IconFont></li>
                      <li>五、检查底证据包<IconFont type="icon-duihao" style={{color: 'green', marginLeft: 10}}></IconFont></li>
                    </ul>
                  </li>
                </ul>
                <div className="footer">
                  <h5>校验结果</h5>
                  {this.state.modalstate.isSuccess ? <span className='adopt'><IconFont type="icon-duihao"></IconFont>'校验通过'</span> : ''}
                  <Button type="primary" className={this.state.btn ? 'btn btnanimation' : 'btn'} onClick={this.downloadCertificate.bind(this, this.state.modalstate.fileName)}>下载存证证书</Button>
                </div>
              </div>
        </Modal>
        <Modal 
          visible={this.state.edittypevisible}
          title="案件类型修改"
          onCancel={this.onedittypecancel.bind(this)}
          onOk={this.onedittypeok.bind(this)}
        >
            <h4 style={{textAlign: 'center', fontSize:14}}>请选择案件类型</h4>
            <h5 style={{textAlign: 'center', margin: '10px 0',}}>您也可以输入案件类型</h5>
            <Select key='0' list={this.state.typeList} style={{width: 488}} onOk={this.ondatachange.bind(this)} valueclear="true"></Select>
        </Modal>
        <Modal
          visible={this.state.editnamevisible}
          title="证据包名称修改"
          onCancel={this.onEditNameCancel.bind(this)}
          onOk={this.onEditNameOk.bind(this)}
        >
            <h3 style={{textAlign: 'center', fontSize:14, marginBottom: 10}}>请输入证据包名称</h3>
            <Input style={{marginBottom:10}} value={this.state.allname} onChange={this.onNameChange.bind(this)}></Input>
        </Modal>
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
const mapStateToProps = state => {
  return {
    data: state.getevidListSucceeded.data.data
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(componentName)
