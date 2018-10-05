import React from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  message
} from 'antd'
import ReportHeader from '../../components/reportHeader/reportHeader'
import request from '../../utils/request'
import {
  api_rebuild_report,
  api_new_preview_report,
  api_add_brief_report
} from '../../services/api'
import './Briefingtemplate.less'
class Briefingtemplate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      dataID: '',
      reportId: '',
      type: '',
      typeId: ''
    }
  }
  componentWillMount() {
    let search = this.props.location.search.split('&');
		let templateType = search[0].split('=')[1];
		let templateId = parseInt(search[1].split('=')[1],10);
        if(search.length === 3){
            request(api_rebuild_report + `&reportId=${templateId}&reportType=${templateType}`)
            .then(res => {
				if(res.data.code === 1){
				this.setState({
					date: res.data.data,
					dataID: res.data.component[0],
					reportId: templateId,
					type:templateType
				})
			  }else{
				message.error('该报告暂无数据，请添加')
			  }
            })    
		}else{
			this.setState({
				type: templateType,
				typeId: templateId
			})
		if (this.props.briefingData.length === 0) {
			request(api_new_preview_report + '&reportFormId=' + templateId).then((res) => {
				// 遍历对象Object.keys()
				// Object.values(）对象转数组
				this.setState({
					date: res.data.data,
					dataID: res.data.component[0]
				})
			});
		} else if (this.props.briefingData.length > 0) {
			const sidList = JSON.stringify(this.props.briefingData);
			request(api_add_brief_report + '&reportFormId=' + templateId + '&reportType=' + templateType + '&sids=' + sidList).then((res) => {
				// 遍历对象Object.keys()
				// Object.values(）对象转数组
				if(res.data.code === 1){
				this.setState({
					date: res.data.data,
					dataID: res.data.component[0],
					reportId: res.data.reportId
				})
			  }else{
				  message.error(res.data.msg)
			  }
			});
		}
	 }
  }
  refreshBrief() {
    console.log(arguments)
  }
  render() {
    return (
      <div className="briefingtemplate">
        <div className="col">
          <Row>
            <Col span={12} offset={6}>
              <ReportHeader
                briefingData={this.props.briefingData}
                type={this.state.type}
                reportId={this.state.reportId}
                refreshBrief={this.refreshBrief}
                typeId={this.state.typeId}
              >
              </ReportHeader>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
	return {
		briefingData:state.briefingSwitchDataReducer.data
	}
 };
export default connect(mapStateToProps)(Briefingtemplate)
