import React from 'react'
import { Form, Input, Button, Menu, message} from 'antd';
import Select from '../../components/Select/Select'
import request from '../../utils/request';
import {api_evidadmin_typeList, api_interent_internetEvidence} from '../../services/api'
import './Evidadmin.less'
const FormItem = Form.Item;
 class Evidadmin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nameValue: '',
            typeValue: '',
            option: []
        }
    }
    componentDidMount() {
        request(api_evidadmin_typeList).then(res => {
            if(parseInt(res.data.code, 10) === 1) {
                this.setState({
                    option: res.data.data
                })
            }
        })
    }
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
              return message.error('请把表单填写完整')
            }
            request(api_interent_internetEvidence + `&url=${values.url}&packageName=${this.state.nameValue}&caseType=${this.state.typeValue}`).then(res => {
                if(res.data.code === 1) {
                    message.success('取证成功,请到证据管理页查看')
                }else{
                    message.error(res.data.msg)
                }
            })
        });
    }
    onNameChange(e) {
        this.setState({
            nameValue: e.target.value
        })
    }
    onTypeOk(value) {
        this.setState({
            typeValue: value
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 300 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 3000 },
                sm: { span: 14 },
            },
        };
        const { getFieldDecorator } = this.props.form;
      
        return (
        <div className="evidadmin">
            <div className="title">
                <Menu 
                        selectedKeys={['alone']}
                        style={{lineHeight:'26px',backgroundColor: '#f0f2fb',border:'none'}}
                >
                    <Menu.Item key="alone" style={{fontSize:'16px'}}>
                        互联网单次取证
                    </Menu.Item>
                </Menu>
            </div>
            <div className="content">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem
                            {...formItemLayout}
                            label="证据名称"
                            className="label"
                        >
                        <Input placeholder="证据名称" onChange={this.onNameChange.bind(this)} style={{marginLeft:'30px'}}/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="案件类型"
                            className="case-type"
                        >
                            <Select style={{marginLeft:'30px',width:'100%'}} list={this.state.option} onOk={this.onTypeOk.bind(this)} valueclear={true}></Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="证据URL"
                            className="label"
                        >
                        {getFieldDecorator('url', {rules: [{required: true, whitespace: true, message: '请输入证据URL',}, {pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '请输入正确的URL地址'}]})(<Input placeholder="证据URL" style={{marginLeft:'30px'}}/>)}
                        </FormItem>
                        <div className="submit">
                            <Button type="primary" htmlType="submit" className="button">
                                提交
                            </Button>
                        </div>
                    </Form>
            </div>
        </div>
        )
    }
}
Evidadmin = Form.create()(Evidadmin);
export default Evidadmin