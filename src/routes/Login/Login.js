import React from 'react'
import { Form, Input, Button, Checkbox, message, Modal, Dropdown, menu, Avatar} from 'antd';
import Publicfooter from '../../components/Publicfooter/Publicfooter'
import IconFont from '../../components/IconFont'
import { connect } from 'react-redux';
import { getItem, setItem, setInformTime, getPasswordItem } from '../../utils/localStorage'
import { api_login, api_get_userinfo, api_logo_customize } from '../../services/api'
import request from '../../utils/request'
import { history } from '../../utils/history'
import './Login.less'
import logo from '../../assets/icon-img/loginlogo.png'
import zhiyunLOGO from '../../assets/icon-img/zhiyunLOGO.png'
import loginbg from '../../assets/icon-img/loginbg.png'
import ios from '../../assets/img/ios.png'
import android from '../../assets/img/android.png'
import fwh from '../../assets/img/fwh.jpg'
import user from '../../assets/icon-img/user.png';
import { LIGHT, DARKER } from '../../utils/colors';
import { informsState, logoinfoRequested } from '../../redux/actions/createActions'
import { changeTheme, userFetchSuccess } from '../../redux/actions/actions';
const FormItem = Form.Item;
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      passWord: '',
      userName: '',
      iosvisible: false,
      androidvisible: false,
      innerHeight: 700
    }
  }
  componentDidMount() {
    this.setState({
      innerHeight: window.innerHeight - 60
    })
    const userInfo = getPasswordItem('userPassword');
    if (userInfo !== null) {
      this.setState({
        userName: userInfo.username,
        password: userInfo.password,
        checked: true,
      })
    }
    let colors = {
      topColor: {
        backgroundColor: LIGHT
      },
      bottomColor: {
        backgroundColor: DARKER
      },
      textColor: {
        color: '#b5b5b5'
      },
      grounding: {
        color: '#181b2b'
      },
      borderColor: {
        color: '#35394f'
      },
      leftColor: {
        backgroundColor: DARKER
      },
      confimColor: {
        backgroundColor: '#FFB584'
      }
    };
    setItem('theme', colors);
    this.props.changeTheme(colors)
    const _this = this
    document.querySelector('.login').addEventListener('click', function(e) {
      if((e.target.className === '' && e.target.nodeName === 'SPAN') || e.target.nodeName === 'SVG' || e.target.nodeName === 'use') {
        return
      }
      _this.setState({
        iosvisible: false,
        androidvisible: false
      })
    })
  }
  changeNav() {
    message.error('请登录')
  }
  onavater() {
    message.error('请登录')
  }
  oniosclick() {
    this.setState({
      androidvisible: true
    })
  }
  onanzhuo() {
    this.setState({
      iosvisible: true
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        request(api_login + `?userName=${values.userName}&password=${values.password}`).then(res => {
          if(res.data.code === 1) {
            message.success('登录成功')
            history.push('/home');
            // request(api_get_userinfo)
            // .then( res => {
            //     if(res.data){
            //         this.props.userFetchSuccess(res.data)
            //         if(res.data.alerMsg === ''){
            //             setInformTime('isShowTime',false);
            //             this.props.informsState(false)
            //         }else{
            //             setInformTime('isShowTime',true);
            //             this.props.informsState(true)
            //         }
                    
            //     }
            // })
            if(values.remember) {
              delete values.remember
              setItem('userinfo', values)
            } else {
              localStorage.removeItem('userinfo')
            }
          } else {
            message.error(res.data.msg)
          }
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="loginbox">
        <div className="z-header" style={{ backgroundColor: '#35394f' }}>
          <div className="top">
            <div className="left">
              <img src={zhiyunLOGO} style={{ width: 100, height: 32 }} alt="logo" className="logo"/>
              {/* <span className="name" style={{ color: '#fff', marginLeft: 10 }}>{userInfo.sysname}</span> */}
            </div>
            <div className="right">
              <ul className="nav-bar">
                <li className={this.state.type !== 'home' ? 'normal' : 'active'}><a target="_blank" href="http://www.ryc360.com/">官方网站</a></li>
                {/* <li onClick={this.changeNav.bind(this, 'allopinion')} className={this.state.type !== 'allopinion' ? 'normal' : 'active'}><Link to="/allopinion/allopiniondetail">舆情监测</Link></li> */}
                <li onClick={this.changeNav.bind(this, 'appcenter')} className={this.state.type !== 'appcenter' ? 'normal' : 'active'}> <a>应用中心</a></li>
                {/* <li onClick={this.changeNav.bind(this, 'message')} className={this.state.type !== 'message' ? 'normal' : 'active'}><a>消息</a></li> */}
              </ul>
              <div className="user-info">
               
                  <div className="avatar" onClick={this.onavater.bind(this)}>
                    <Avatar src={user} />
                  </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
        <div className="login">
          <div className="logo">
            <div className="img">
              <img src={loginbg} alt=""/>
            </div>
            <div className="form">
              <div className="logoipt">
                <div className="loginlogo">
                  <img src={logo} alt=""/>
                  <span>知云网大数据云平台</span>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <FormItem>
                    {getFieldDecorator('userName', {
                      rules: [{ required: true, message: '请输入账户' }],
                      initialValue: getItem('userinfo') ? getItem('userinfo').userName : ''
                    })(
                      <Input  prefix={<IconFont type="icon-ren" style={{ color: '#3f74e8', width: 15, height: 15}} />} style={{height: 40}} placeholder="请输入账户" />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码' }],
                      initialValue: getItem('userinfo') ? getItem('userinfo').password : ''
                    })(
                      <Input  prefix={<IconFont type="icon-suo" style={{ color: '#3f74e8', width: 15, height: 15}} />} type='password' style={{height: 40}} placeholder="请输入密码" />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked'
                    })(
                      <div>
                        <Checkbox defaultChecked={getItem('userinfo') ? true : false}>记住密码</Checkbox>
                        <span
                          style={{display: 'inline-block',textAlign: 'center', width: 30, height: 30, backgroundColor: '#3f74e8', borderRadius: 5, float: 'right', marginLeft: 20, cursor: 'pointer'}}
                          onClick={this.oniosclick.bind(this)}
                        >
                          <IconFont type="icon-pingguo" style={{ color: '#fff' }} />
                        </span>
                        <span
                          style={{display: 'inline-block',textAlign: 'center', width: 30, height: 30, backgroundColor: '#3f74e8',  borderRadius: 5, float: 'right', cursor: 'pointer'}}
                          onClick={this.onanzhuo.bind(this)}
                        >
                          <IconFont type="icon-anzhuo" style={{ color: '#fff' }} />
                        </span>
                        <div className="anzhuo-download" style={{position: 'relative'}}></div>
                      </div>
                    )}
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{margin: '20px auto 0 auto', display: 'block',backgroundColor: '#3f74e8', width: 100}}>
                      登录
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
          <Publicfooter login wechart={fwh} ios={ios} android={android} style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}></Publicfooter>
        </div>
        <Modal
            visible={this.state.iosvisible}
            footer={null}
            style={{ width: 100 }}
            className="download-modal"
            closable={false}
            onCancel={() => { this.setState({ iosvisible: false }) }}
            getContainer={() => document.querySelector('.anzhuo-download')}
          >
            <span style={{ textAlign: 'center', display: 'block', fontSize: 16, marginBottom: 20, fontFamily: 'Microsoft Yahei', color: '#000', backgroundColor: '#fff', width: 190}} className="appdownload">安卓版APP下载</span>
            <img src={android} style={{ width: 140, right: 0, position: 'inherit'}} alt='安卓二维码' />
          </Modal>
          <Modal
            visible={this.state.androidvisible}
            footer={null}
            style={{ width: 100 }}
            className="download-modal"
            closable={false}
            onCancel={() => { this.setState({ androidvisible: false }) }}
            getContainer={() => document.querySelector('.anzhuo-download')}
          >
            <span style={{ textAlign: 'center', display: 'block', fontSize: 16, marginBottom: 20, fontFamily: 'Microsoft Yahei', color: '#000', backgroundColor: '#fff', width: 190 }} className="appdownload">ios版APP下载</span>
            <img src={ios} style={{ width: 140, right: 0, position: 'inherit' }} alt='iphone二维码' />
          </Modal>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changeTheme: req => {
      dispatch(changeTheme(req));
    },
    informsState: data => {
      dispatch(informsState(data))
    },
    userFetchSuccess: data => {
      dispatch(userFetchSuccess(data))
    },
    logoinfoRequested: data => {
      dispatch(logoinfoRequested(data))
    }
  }
};
export default connect(null, mapDispatchToProps)(Form.create()(Login));