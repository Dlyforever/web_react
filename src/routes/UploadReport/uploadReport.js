import React from 'react';
import './uploadReport.less';
import {Input,Button,message,Modal,Icon,Radio,Upload} from 'antd';
 import { api_uploadReport, } from '../../services/api';
import request from '../../utils/request';
import IconFont from '../../components/IconFont';
// import {getSecondTime,templateTypeSort} from '../../utils/format';
import {history} from '../../utils/history';


const RadioGroup = Radio.Group;
class UploadReport extends React.Component{
	constructor(props){
			super(props);
			this.state = {
				fileList: [],
				uploading: false,
			  reportName: '',
				reportType: 10,
				buttonShow: '',
				fileName: '',
				fileSize: '',
				fileSizeNum: '',
				formData: '',
				file: ''
		
			
		}
	}



	// 报告名输入change 事件
	reportNameChange = (e) => {
		this.setState({
			reportName: e.target.value
		})

	}
 
	// 报告名输入blur事件 
	reportNameBlur = ()=> {
    if (   this.state.reportName == '' ) {
			message.error('报告名不能为空')
			return
		}
	}

	// 报告类型选择事件 
	reportTypeChange = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			reportType: e.target.value,
		});
	}

	// 保存报告事件
	saveReport = () => {
		if (true) {

		}
		alert('保存')
	}
	
	
	//  上传状态改变 回调函数会返回   {file: { /* ... */ },fileList: [ /* ... */ ],event: { /* ... */ },}
	// 传入的对象是解构赋值 

	uploadStateChange = ({file,fileList}) =>  {
		if (file.status !== 'uploading') {
			console.log('文件',file)
			this.setState({
				file: file,
				fileName: file.name,	
				fileSizeNum: Math.ceil(file.size/1024 ),
				fileSize: '('+ Math.ceil(file.size/1024 ) + 'K' + ')',
				fileList: fileList
			})
		} 
		if (file.status === 'done') {
	
			this.setState({
				fileList: [],
				uploading: false,
			});
			message.success('upload successfully.');
		}
		if (file.status === 'error') {
			this.setState({
				uploading: false,
			});
			message.error('upload failed.');
		}
	}

	// 手动上传文件
	
  handleUpload = () => {
		const { fileList } = this.state;
	 
    const formData = new FormData();
		// fileList.forEach((file) => {
      formData.append('files[]', this.state.file);
		// });
		this.setState({
			formData: formData
		})
		console.log('表单',formData)

   // console.dir(FormData)
		// formData.set('aa', fileList[0])

	 console.log('表单数据',formData)
  	//  debugger
    this.setState({
			uploading: true,
		});
		 
 		request(api_uploadReport,{
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			processData: false,
			processData: false,
			body: `&reportName=${this.state.reportName}&reportType=${this.state.reportType}&report=${this.state.formData}`,

		}).then(res => { 
				console.log('上传返回值',res)
			
				// this.setState({
				// 	fileList: [],
				// 	uploading: false,
				// });
				// message.success('上传成功');

				// this.setState({
				// 	uploading: false,
				// });
				// message.error('上传失败');
			})

 }
 

	render(){
		const { uploading} = this.state;

    const props = {
		
			action :`api_uploadReport&reportName=${this.state.reportName}&reportType=${this.state.reportType}&report=${this.state.formData}`,
			onChange: ({file, fileList}) => {
				if (file.status !== 'uploading') {
					console.log('文件',file)
					this.setState({
						file: file,
						fileName: file.name,	
						fileSizeNum: Math.ceil(file.size/1024 ),
						fileSize: '('+ Math.ceil(file.size/1024 ) + 'K' + ')',
					})
				} 
				if (file.status === 'done') {
					this.setState({
						fileList: [],
						uploading: false,
					});
					message.success('upload successfully.');
				}
				if (file.status === 'error') {
					this.setState({
						uploading: false,
					});
					message.error('upload failed.');
				}
			},
			onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState( ({ fileList }) => ({
          fileList: [...fileList, file]
				}));
				console.log('列表', this.state.fileList)
        return false;
      },
       
			  fileList: this.state.fileList
	
    };  



		// 解构赋值 
		let {fileName,fileSize,fileSizeNum,reportName,reportType} = this.state
		return (
			<div className="upload-report" >

				<div className="upload-report-top">
						<span >&nbsp;&nbsp;报告上传</span>
						<span ></span>
				</div>

				<div className = "upload-report-content">
					<div className="reportName">
							<span>报告名称</span>
							<Input className = "reportNameInput" onChange = {this.reportNameChange} onBlur = {this.reportNameBlur}  maxLength = {'15'}  value = {reportName} placeholder='限制输入15字以内'/>
					</div>  

					<div  className="reportType">
						<span className = "typeText">报告类型 </span>
						<RadioGroup className = "radioGroup" onChange={this.reportTypeChange} value={reportType}>
							<Radio className = "radio" value={1}>简报</Radio>
							<Radio className = "radio" value={2}>专报</Radio>
							<Radio className = "radio" value={3}>日报</Radio>
							<Radio className = "radio" value={4}>周报</Radio>
							<Radio className = "radio" value={5}>半月报</Radio>
							<Radio className = "radio" value={6}>月报</Radio>
							<Radio id = "marginLeft" className = "radio" value={7}>季报</Radio>
							<Radio className = "radio" value={8}>半年报</Radio>
							<Radio className = "radio" value={9}>年报</Radio>
							<Radio className = "radio" value={10}>其他</Radio>
						</RadioGroup>
						<p className = "noticeText">仅支持文件大小在5M以内的doc、docx、xls、ppt、pptx、pdf格式的报告上传</p>
					</div>
					<div className = "reportFileContainer">
						<span className = "reportFileText">
							报告文件
						</span>
						<Upload 
							  {...props}
					     
								showUploadList= {false} 
								accept="application/msword,	application/vnd.ms-excel, application/vnd.ms-powerpoint,
												application/vnd.openxmlformats-officedocument.wordprocessingml.document,
												application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
												application/vnd.openxmlformats-officedocument.presentationml.presentation" 
						> 

								{ 
									fileSizeNum < 5120 ? <span style ={{marginRight: '30px'}}>{fileName}{fileSize}</span> : message.error('文件过大') 
								}
						
							<Button   className = "uploadButton">
								选择
							</Button>
						</Upload>
						<Button style ={{ display : 'block', marginTop: 120}}
								className="upload-demo-start"
								type="primary"
								onClick={this.handleUpload}
								disabled={this.state.fileList.length === 0}
								loading = {uploading}
						>
          			{ uploading ? '上传' : '开始上传' }
        		</Button>
					</div>
					{/* <div className = 'footer'>
						{
							fileSizeNum !== ""	&& fileSizeNum < 5120 ? <Button  onClick = { this.saveReport } className = "footerButton">保存</Button> : ''
			
						}
					
					</div> */}
				</div>
					
			</div>
		)
	}
}
export default UploadReport;