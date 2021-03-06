import React from 'react';
import './reportHeader.less';
import { Row, Col, Button, Select, DatePicker,Modal,message ,Input,Spin, Alert} from 'antd';
import ModalReport from '../../components/ModalReport/ModalReport';
import ModalMaterial from '../../components/ModalMaterial/ModalMaterial';
import {
	api_get_brief_item,
	api_get_data_daily_preview,
	api_top_nav,
	api_get_special_preview,
	api_get_generate_report,
	api_update_report_name
} from '../../services/api';
import {connect} from 'react-redux';
import {briefingSwitch} from '../../redux/actions/createActions';
import request from '../../utils/request';
import {history} from '../../utils/history';
// const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
class reportHeader extends React.Component{
	constructor(){
		super()
		this.state={
		     requestUrl:'',
		     visible:false,
		     isShowModalMaterial:false,
		     flag:true,
			 catNameArr: [],
			 topicList: [],
			 topicId: "",
			 starttime: "",
			 endtime: "",
			 reportNameValue:'',
			 reportNameVisible:false,
			 finishVisible:false,
			 repeatFlag:false,
			 charts: {
				mediaDistributionImg: "",
				emotionDistributionImg: ""
			},
			isShow:true,
			isShowLoading:false
		}
	}
	componentWillMount() {
		request(api_top_nav).then(res=>{
			this.setState({
				catNameArr: res.data
			})
		})
	}
	componentDidUpdate(prevProps){
		if(prevProps.starttime !==this.props.starttime){
			this.setState({
			  starttime:this.props.starttime,
			  endtime:this.props.endtime,
			  topicId:this.props.topicid
			})
		}
  }
	//简报编辑按钮
	editBriefing(type){
		if(type === 'have'){
			this.setState({
				requestUrl:api_get_brief_item +`&reportId=${this.props.reportId}`,
				visible:true
			})
		} else {
			this.setState({
				isShowModalMaterial:true
			})
		}
	}
	//隐藏弹窗
	hideModal = () => {
		this.setState({
			visible:false
		})
	}
	//隐藏素材库
	hideModalMaterial = () => {
		this.setState({
			isShowModalMaterial:false
		})
	}	
	//报告弹窗确定按钮回调
	checkReport = (data,status) => {
		this.props.refreshBrief(data,status);
		this.setState({
			isShowModalMaterial:false,
			flag:false,
			visible:false
		})
		//this.props.briefingSwitch(data)
	}
	disabledStartDate = (startValue) => {
		const endValue = this.state.endValue;
		if (!startValue || !endValue) {
			return false;
		}
		return startValue.valueOf() > endValue.valueOf();
	}
	
	disabledEndDate = (endValue) => {
		const startValue = this.state.startValue;
		if (!endValue || !startValue) {
			return false;
		}
		return endValue.valueOf() <= startValue.valueOf();
	}
	
	onChange = (field, value) => {
		this.setState({
			[field]: value,
		});
	}
	
	onStartChange = (value, dateString) => {
		// const starttime = dateString.replace(new RegExp("-","gm"),"/");
		const starttimeHaoMiao = (new Date(dateString)).getTime();
		this.setState({
			startMsDate: starttimeHaoMiao,
			startDate: dateString
		})
		this.onChange('startValue', value);
	}
	
	onEndChange = (value, dateString) => {
		// const starttime = dateString.replace(new RegExp("-","gm"),"/");
		const starttimeHaoMiao = (new Date(dateString)).getTime();
		this.setState({
			endMsDate: starttimeHaoMiao,
			endDate: dateString
		})
		this.onChange('endValue', value);
	}
	
	handleStartOpenChange = (open) => {
	if (!open) {
		this.setState({ endOpen: true });
	}
	}

	handleEndOpenChange = (open) => {
		this.setState({ endOpen: open });
	}
	onOkDateStart(value, dateString) {
	}
	handleChange(value) {
		this.setState({
			topicId: value,
			isShow:true
		})
	}
	specialOk () {
		this.setState({
			 isShow:false,
			 isShowLoading:true
		})
		request(api_get_special_preview + '&topicId=' + this.state.topicId + '&reportFormId=' + this.props.typeId + '&reportType=' + this.props.type).then(res=>{
			this.setState({
				isShowLoading:false
			})
			this.props.hanldle(res.data,this.state.topicId)				
			if (res.data.code === 1) {
				this.setState({
					starttime: res.data.starttime,
					endtime: res.data.endtime
				})
				message.success(res.data.msg)
			} else if (res.data.code === 0) {
				message.warning(res.data.msg)
			}				
		})
	}
	onOkDate(value) {
			const myDate = new Date();
			const starttimeHaoMiao = (new Date(myDate)).getTime();
			if (this.state.startMsDate > starttimeHaoMiao && this.state.endMsDate > starttimeHaoMiao) {
				message.warning("您的选的日期超出了当前时间，请重新选择");
			} else if (this.state.startMsDate > starttimeHaoMiao && this.state.endMsDate < starttimeHaoMiao) {
				message.warning("您的选的日期超出了当前时间，请重新选择");
			} else if (this.state.startMsDate < starttimeHaoMiao && this.state.endMsDate > starttimeHaoMiao) {
				message.warning("您的选的日期超出了当前时间，请重新选择");
			} else if (this.state.endMsDate - this.state.startMsDate > 86400000) {
				message.warning("您选择的时间超过了24个小时，请重新选择");
			} else if (this.state.startMsDate < starttimeHaoMiao && this.state.endMsDate < starttimeHaoMiao) {
				this.setState({
					isShowLoading:true
				})
				request(api_get_data_daily_preview + '&reportFormId=' + this.props.typeId + '&reportType=' + this.props.type + '&starttime=' + this.state.startDate + '&endtime=' + this.state.endDate).then((res) => {
						this.setState({
							isShowLoading:false
						})	
				    	if(res.data.code===1){
						message.success(res.data.msg);
						this.props.hanldle(res.data,this.state.startDate,this.state.endDate)				
						this.setState({
							starttime: res.data.starttime,
							endtime: res.data.endtime
						})	
					    }else{
						message.error(res.data.msg);	
						}
			  })
			}
	}
	//专报生成报告
	specialReport = () => {
		this.setState({
			reportNameVisible:true
		})
	}
	//报告名称
	reportName = (e) => {
		let {value} = e.target;
		this.setState({
			reportNameValue:value
		})
	}
	//确认名称
	confimName = () => {
		if(this.state.reportNameValue.length > 11) return message.error('报告名称请不要超出11个字符') 
		if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(this.state.reportNameValue))  return message.error('请不要带有特殊字符') 
		request(api_update_report_name +`&reportId=${this.props.reportId}&reportName=${this.state.reportNameValue}`)
		.then(res => {
			if(res.data.code === 1){
				if (this.props.type === "01") {
					request(api_get_generate_report + '&reportId=' + this.props.reportId).then(res=>{
						if (res.data.code === 1) {
							message.success(res.data.msg);
							this.setState({
								repeatFlag:false,
								reportNameVisible:false,
								finishVisible:true
							})
						} else if (res.data.code === 0) {
							message.error(res.data.msg)
						}
					})
				} else if (this.props.type === "02") {
					let emotionDistributionImg = this.props.emotionDistributionImg.getEchartsInstance();
					let emotionDistributionImgbase64 =encodeURIComponent(emotionDistributionImg.getDataURL('png'));
					let mediaDistributionImg = this.props.mediaDistributionImg.getEchartsInstance();
					let mediaDistributionImgbase64 =encodeURIComponent(mediaDistributionImg.getDataURL('png'));
					let mediaAnalysisImg = this.props.mediaAnalysisImg.getEchartsInstance();
					let mediaAnalysisImgbase64 =encodeURIComponent(mediaAnalysisImg.getDataURL('png'));
					let negativeCarrierAnalysisImg = this.props.negativeCarrierAnalysisImg;
					let negativeCarrierAnalysisImgbase64 =negativeCarrierAnalysisImg!=='1'?encodeURIComponent(negativeCarrierAnalysisImg.getEchartsInstance().getDataURL('png')):'';
					let mediaEwarningDistributionImg = this.props.mediaEwarningDistributionImg;
					let mediaEwarningDistributionImgbase64 =mediaEwarningDistributionImg!=='1'?encodeURIComponent(mediaEwarningDistributionImg.getEchartsInstance().getDataURL('png')):'';
					let charts = {
						emotionDistributionImg:emotionDistributionImgbase64,
						mediaDistributionImg:mediaDistributionImgbase64,
						mediaAnalysisImg:mediaAnalysisImgbase64,
						negativeCarrierAnalysisImg:negativeCarrierAnalysisImgbase64,
						mediaEwarningDistributionImg:mediaEwarningDistributionImgbase64
					}
					request(api_get_generate_report,{
						method: 'POST',
						headers: {
									"Content-Type": "application/x-www-form-urlencoded"
						}, 
						body:`reportId=${this.props.reportId}&charts=${JSON.stringify(charts)}`
					}).then(res => {
						if (res.data.code === 1) {
							message.success(res.data.msg);
							this.setState({
								repeatFlag:false,
								reportNameVisible:false,
								finishVisible:true
							})
						} else if (res.data.code === 0) {
							message.error(res.data.msg)
						}
					})
				} else if (this.props.type === "03") {
					if (this.props.echartsReact !== "" && this.props.echartsMediaTypeTrendOption !== "") {
						const echarts_instance = this.props.echartsReact.getEchartsInstance();
						const echartsMediaTypeTrendOption_instance = this.props.echartsMediaTypeTrendOption.getEchartsInstance();
						this.setState({
							charts: {
								emotionDistributionImg: encodeURIComponent(echarts_instance.getDataURL('png')),
								mediaDistributionImg: encodeURIComponent(echartsMediaTypeTrendOption_instance.getDataURL('png'))
							}
						}, () => {
							let chart = JSON.stringify(this.state.charts);
							request(api_get_generate_report,{
								method:'POST',
								headers: {
									"Content-Type": "application/x-www-form-urlencoded"
								},
								body:`reportId=${this.props.reportId}&charts=${chart}`    
								}).then(res=>{
								if (res.data.code === 1) {
									message.success(res.data.msg);
									this.setState({
										repeatFlag:false,
										reportNameVisible:false,
										finishVisible:true
									})
								} else if (res.data.code === 0) {
									message.error(res.data.msg)
								}
							})
						})
					}
				}
			} else {
				this.setState({
					repeatFlag:true
				})
			}
		})
	}
	//去我的报告
	goMyReport = () => {
		history.push('/allopinion/myreport');
	}
	cancel = () => {
		this.setState({
			reportNameVisible:false,
			finishVisible:false
		})
	}
	cancelhome = () => {
		history.push('/home');
	}
	render() {
		const { type, briefingData,reportId } = this.props;
		const { startValue, endValue, endOpen ,isShowLoading } = this.state;
		let haveData = reportId !== '' ?'have':'none';
		return (
			<div className="headers">
				<Row type="flex" justify="space-between" className="one">
					<Col span={3}>
						<span className="yulan"><b>报告预览</b></span>
					</Col>
						{
							(() => {
								if (type === "01") {
									if(briefingData.length > 0 || this.props.reportId !== "") {
										return (
											<Button type="primary" value="small" onClick={this.specialReport} className="report" style={{ backgroundColor: "#5a8bff" }} >生成报告</Button>
										)
									} else if (briefingData.length === 0 || this.props.reportId === "") {
										return (
											<Button type="primary" value="small" className="report" style={{ backgroundColor: "#5a8bff", display: "none" }} >生成报告</Button>
										)
									}
								} else if (type === "03") {
									if (this.state.starttime !== "" && this.state.endtime !== "") {
										return (
											<Button type="primary" value="small" onClick={this.specialReport} className="report" style={{ backgroundColor: "#5a8bff" }} >生成报告</Button>
										)
									}
								} else if (type === "02") {
									if (this.state.starttime !== "" && this.state.endtime !== "") {
										return (
											<Button type="primary" value="small" onClick={this.specialReport} className="report" style={{ backgroundColor: "#5a8bff" }} >生成报告</Button>
										)
									}
								}
							})()
						}
				</Row>
				<div className="two">
					<Row type="flex" justify="space-between">
						<Col span={3}>
						</Col>
						{
							(() => {
								if (type === "01") {
									return <div className="oneButton"><Button type="primary" style={{ backgroundColor: "#5a8bff" }} className="editReport" onClick={this.editBriefing.bind(this,haveData)}>编辑报告素材</Button></div>
								} else if (type === "02") {
									return <div>
										<div className="twoButton">
											<Select
												style={{ width: 200, marginRight: 20}}
												onChange={this.handleChange.bind(this)}
												value={this.state.topicId +''}
											>
											{
												this.state.catNameArr.map((item, index) => 
													<OptGroup label={item.catname} key={index}>
													  {
															item.topicList.map((i) => 
														    <Option key={i.topicid.toString()} value={i.topicid.toString()}>{i.topicname}</Option>
														  )
														}
													</OptGroup>
											  )
											}
											</Select>
											<Button type="primary" onClick={this.specialOk.bind(this)} style={this.state.isShow?{ display:'inline-block',backgroundColor: "#5a8bff" }:{ display:'none',backgroundColor: "#5a8bff" }}>确定</Button>
										</div>
										<span style={{ color: "#c31100" }}>*选择专题</span>
									</div>
								} else if (type === "03") {
									return <div>
										<div className="rangeData">
											<DatePicker
												disabledDate={this.disabledStartDate.bind(this)}
												showTime
												format="YYYY-MM-DD HH:mm:ss"
												value={startValue}
												placeholder="开始时间"
												onChange={this.onStartChange.bind(this)}
												onOpenChange={this.handleStartOpenChange.bind(this)}
												onOk={this.onOkDateStart.bind(this)}
												style={{marginRight: 20}}
											/>
											<DatePicker
												disabledDate={this.disabledEndDate.bind(this)}
												showTime
												format="YYYY-MM-DD HH:mm:ss"
												value={endValue}
												placeholder="结束时间"
												onChange={this.onEndChange.bind(this)}
												open={endOpen}
												onOpenChange={this.handleEndOpenChange.bind(this)}
												onOk={this.onOkDate.bind(this)}
											/>
										</div>
										<span style={{ color: "#c31100" }}>*可以通过时间范围获取素材,时间周期为24时制</span>
									</div>
								}
							})()
						}
					</Row>
				</div>
				<div style={isShowLoading?{display:'block'}:{display:'none'}}>
				<Spin tip="生成中...">
					<Alert
					message="报告正在生成中"
					description="请耐心等待"
					type="info"
					/>
				</Spin>
				</div>
				<Modal  visible={this.state.visible} footer={null} onCancel={this.hideModal}
                width="70%" maskClosable={false} className="report-modal"
        >
				<ModalReport 
				requestUrl={this.state.requestUrl} 
				reportId={this.props.reportId}
				checkReport={this.checkReport}
				/>
         </Modal>
				<Modal  visible={this.state.isShowModalMaterial} footer={null} onCancel={this.hideModalMaterial}
                width="70%" maskClosable={false} className="report-modal"
        >
         <ModalMaterial
				 checkReport={this.checkReport}
				 typeId={this.props.typeId}
				 type={this.props.type}
				 reportId={this.props.reportId}
				/>  
        </Modal>
				<Modal
					visible={this.state.reportNameVisible}
					className="report-modal"
					onOk={this.confimName}
					onCancel={this.cancel}
				>
					<div style={{textAlign:'center'}}>请输入报告名称</div>
					<div style={this.state.repeatFlag?{textAlign:'center',color:'#ff0000'}:{display:'none'}}>报告名重复，请重新输入</div>
					<Input
						onChange={this.reportName}
						value={this.state.reportNameValue}
					  style={{margin:'20px auto',width:'80%',display:'block'}}/>
				</Modal>
				<Modal
					visible={this.state.finishVisible}
					className="report-modal"
					onOk={this.goMyReport}
					onCancel={this.cancelhome}
					okText='去我的报告'
					cancelText='返回首页'
				> 
					<div style={{textAlign:'center'}}>生成报告已完成</div>
				</Modal>
			</div>							
		)
	}
}
  const mapDispatchToProps = dispatch => {
    return {
		briefingSwitch: req => {
			dispatch(briefingSwitch(req))
		}
    }
  };
  
export default connect(null, mapDispatchToProps)(reportHeader);