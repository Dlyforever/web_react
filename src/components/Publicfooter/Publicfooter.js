import React from 'react'
import './Publicfooter.less'
class Publicfooter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logoinfo: {}
    }
  }
  componentDidMount() {
    let jsonlogoinfo = window.sessionStorage.getItem('logoinfo')
    if(jsonlogoinfo) {
      this.setState({
        logoinfo: JSON.parse(jsonlogoinfo)
      })
    }
    const _this = this
    window.addEventListener("setItemEvent", function (e) {
        _this.setState({
            logoinfo: JSON.parse(e.newValue)
        })
    });
  }
  istrue(data) {
    if(data === '' || data === undefined) {
      return false
    }else{
      return true
    }
  }
  render() {
    const {
      wx_servimg,
      iosimg,
      androidimg,
      comname,
      cushotline,
      officialweb,
      rightinfo
    } = this.state.logoinfo
    return (
      <div className="publicfooter" style={this.props.style}>
        <div className="top">
          <div className="contact">
            <h3 className="title">{this.props.login ? '知云网 | 北京软云神州科技有限公司' :  this.istrue(comname) ? comname : '知云网 | 北京软云神州科技有限公司'}</h3>
            <ul>
              <li>客服热线 ：{this.props.login ? '400-618-1863' : this.istrue(cushotline) ? cushotline : '400-618-1863'}</li>
              <li>官方网站 ：{this.props.login ? 'www.ryc360.com    www.is8.com.cn' : this.istrue(officialweb) ? officialweb : 'www.ryc360.com    www.is8.com.cn'}</li>
            </ul>
          </div>
          <div className="erweima">
            <ul>
              <li><img src={this.props.login ? this.props.wechart : this.istrue(wx_servimg) ? '../../' + wx_servimg : this.props.wechart} alt="服务号" /><span>微信服务号</span></li>
              <li><img src={this.props.login ? this.props.ios : this.istrue(iosimg) ? '../../' + iosimg : this.props.ios} alt="IOS" /><span>IOS版APP </span></li>
              <li><img src={this.props.login ? this.props.android : this.istrue(androidimg) ? '../../' +  androidimg : this.props.android} alt="安卓" /><span>安卓版APP</span></li>
            </ul>
          </div>
        </div>
        <div className="bottom"><span>{this.istrue(rightinfo) ? rightinfo : '版权所有 © 2018 软云神州'}</span></div>
      </div>
    )
  }
}
export default  Publicfooter