import React from 'react';
import './MyReport.less';
import {Input,DatePicker,Button,message,Pagination,Tooltip,Popconfirm,Popover,Modal,Affix,Icon,Radio} from 'antd';
import {api_get_all_report,api_update_report_name,api_search_report,
        api_new_delete_report,api_download_report,api_app_report,api_download_OldDoc,api_downLoadReport,api_reportDetail} from '../../services/api';
import request from '../../utils/request';
import IconFont from '../../components/IconFont';
import {getSecondTime,templateTypeSort} from '../../utils/format';
import {history} from '../../utils/history';
const RadioGroup = Radio.Group;
class MyReport extends React.Component{
     constructor(props){
         super(props);
         this.state = {
            typeList:[],
            contentList:[],
            typeKeyList:{
                '00':'全部报告',
                '01':'简报',
                '02':'专报',
                '03':'日报',
                '04':'周报',
                '05':'半月报',
                '06':'月报',
                '07':'季报',
                '08':'年报'
            },
            type:'00',
            checkId:'1',
            editReprotName:'1',
            inputSearchValue:'',
            startTime:'',
            endTime:'',
            recordTotal:0,
            current:1,
            flag:false,
            visible:false,
            hmtlUrl:'',
            previewVisible:false,
            popoverVisible:false,
            reportType:'00',
            reportFormId:2,
            isSearch:false,
            isnew:'1',
            reportName:'',
            updateTime:'',
            isShow:false,
            deleteModal2: false,
            reportDetailModal2: false,
            reportDetailReportName: '',
            reportDetailReportType: '',
            reportDetailFileName: '',
            reportDetailuploadTime: '',
            reportDetailOperator: ''
            
         }
     }
     componentWillMount(){
        request(api_get_all_report)
        .then( res => {
            if(res.data.code === 1){
            let typeList = [] ;    
            templateTypeSort(res.data.data.reportTypeList).forEach(item => {
                typeList.push({type:item,name:this.state.typeKeyList[item]}) 
            });
            this.setState({
                contentList: res.data.data.pageBean.content,
                typeList:typeList,
                recordTotal: res.data.data.pageBean.recordTotal
            })  
   
        }
        })
    }
    changeType(type){ 
       this.setState({
           type:type,
           current:1,
           isSearch:false,
           reportName:''
       })
       request(api_search_report + `&reportType=${type}`)
       .then( res => {
            if(res.data.code === 1){
            this.setState({
                contentList:res.data.data.content,
                recordTotal: res.data.data.recordTotal
            })        
           }else{
            this.setState({
                contentList:[]
            })
           }
       })
    }
    changeReport(id,status,reportType,reportFormId,isnew,reportName,updateTime){
            this.setState({
                checkId:id,
                flag:true,
                reportType:reportType,
                reportFormId: reportFormId,
                isnew:isnew,
                reportName:reportName,
                updateTime:updateTime,
                visible:false,
                isShow: status === '2' ?true :false

            })
    }
    editReportName(reportid,reportname){
        this.setState({
            editReprotName:reportid,
            inputValue:reportname
        })
    }
    //失去焦点，修改名字
    blur(reportid,e){
        if(this.state.inputValue === ''){
            message.success('报告名称不可为空')
            return;
        }
        let {type,current} = this.state;
        request(api_update_report_name + `&reportId=${reportid}&reportName=${this.state.inputValue}`)
        .then( res => {
              if(res.data.code === 1){
                request(api_search_report +`&reportType=${type}&page=${current}&reportName=${this.state.inputSearchValue}&starttime=${this.state.startTime}&endtime=${this.state.endTime}`)
                .then( res => {
                    if(res.data.code === 1){
                    this.setState({
                        contentList: res.data.data.content,
                        editReprotName:''
                    })  
                 }
                })
              }else{
                message.error(res.data.msg)
              }
        })
    }
    changeReportName(e){
        let {value} = e.target;
        this.setState({
            inputValue:value
        })
    }
    changeSearchName = (e) => { 
        let {value} = e.target;
        this.setState({
            inputSearchValue:value
        })
    }
    //搜索报告
    searchReport = () => {
         if(getSecondTime(this.state.startTime)>=getSecondTime(this.state.endTime)){
             message.error('开始时间请不要大于或等于结束时间');
             return;
         }
         if (this.state.inputSearchValue === '' && this.state.startTime === '' && this.state.endTime === '' ){
             message.error('请输入报告名称或类型或时间区间');
             return;
         }
         let str = '';
         if(this.state.inputSearchValue === ''){
             str = `&reportType=${this.state.type}&starttime=${this.state.startTime}&endtime=${this.state.endTime}`
         }else{
             str = `&reportType=${this.state.type}&reportName=${this.state.inputSearchValue}&starttime=${this.state.startTime}&endtime=${this.state.endTime}`
         }
         request(api_search_report + str)
         .then( res => {
              if(res.data.code === 1){ 
                  this.setState({
                    contentList:res.data.data.content,
                    recordTotal:res.data.data.recordTotal,
                    current:1,
                    isSearch:true
                  })
              }else{
                  message.error('未搜索到该报告，请换个条件试试')
              }
         })
    }
    //开始时间
    changeStartTime = (date, dateString) => {
         this.setState({
             startTime:dateString
         })
    }
    //结束时间 
    changeEndTime = (date, dateString) => {
        this.setState({
            endTime:dateString
        })
    } 
    //翻页
    paginationChange = (current) => {
        this.setState({
             current:current,
             visible:false,
             isShow:false,
             reportType:'00'
        })
        let str = this.state.isSearch?`&reportType=${this.state.type}&page=${current}&reportName=${this.state.inputSearchValue}&starttime=${this.state.startTime}&endtime=${this.state.endTime}`:`&reportType=${this.state.type}&page=${current}`;
        request(api_search_report + str )
        .then( res => {
             if(res.data.code === 1){
             this.setState({
                 contentList:res.data.data.content,
                 flag:false
             })        
            }else{
                this.setState({
                    contentList:[],
                    flag:false,
                    visible:false
                })   
            }
        })
    }
    //预览
    preview = () => {
        this.setState({
            visible:false
        })
        if(this.state.isnew === '0'){
            request(api_app_report+`&reportid=${this.state.checkId}`)
            .then(res => {
                 if(res.data.code === 1){
                    this.setState({
                        hmtlUrl:res.data.downloadUrl,
                        previewVisible:true
                    })
                 }else{
                    message.error(res.data.msg) 
                 }
            })
        }else{
            if(this.state.isShow){
                request(api_download_report +`&reportId=${this.state.checkId}&dType=html`)
                .then(res =>{
                     if(res.data.code ===1){
                       this.setState({
                           hmtlUrl:res.data.fileAddress,
                           previewVisible:true
                       })
                     }else{
                       message.error(res.data.msg)
                     }
                 } )
               
            }else{
                this.state.reportFormId === 1?history.push(`/allopinion/briefing?type=${this.state.reportType}&id=${this.state.checkId}&type=rebuild`):
                history.push(`/allopinion/briefingsecond?type=${this.state.reportType}&id=${this.state.checkId}&type=rebuild`)
            }
        }
    }
    //删除
    delete = () => {
        if(this.state.checkId === ''){
            message.error('请选择报告');
        }else{
            request(api_new_delete_report + `&reportId=${this.state.checkId}`)
            .then( res => {
               if(res.data.code === 1){
                    message.success('删除成功');
                    this.setState({
                        checkId:'',
                        flag:false,
                        isShow:false,
                        reportType:'00'
                    })
                    request(api_search_report + `&reportName=${this.state.inputSearchValue}&starttime=${this.state.startTime}&endtime=${this.state.endTime}&reportType=${this.state.type}&page=${this.state.current}`)
                    .then( res => {
                        if(res.data.code === 1){
                            this.setState({
                                contentList:res.data.data.content
                            })
                        }else{
                            this.changeType('00')
                        }
                    })
               }
            })
        }
    }
    //下载   
    // 不是  箭头函数  render里不用bind 改变指向会死循环
    downLoad(api,type){
            request(api+`&reportId=${this.state.checkId}&dType=${type}`)
            .then(res =>{
                console.log('下载', res)
                 if(res.data.code ===1){
                    window.location.href = './../../'+res.data.fileAddress;
                 }else{
                   message.error(res.data.msg)
                 }
            })
         this.setState({
            visible:false
         })
    }     
    //复制 
    copy = () => {
        
    }
    //隐藏预览弹窗
    onCancel = () => {
        this.setState({
            previewVisible:false
        })
    }
    //新建报告
    addReport = () => {
        history.push('/allopinion/choosetemplate');
    }
    //报告预览
    // reportPreview = (type) => {
    //      this.setState({
    //         popoverVisible:false
    //      })
    //      if(type==='preview'){
    //         request(api_download_report +`&reportId=${this.state.checkId}&dType=html`)
    //         .then(res =>{
    //              if(res.data.code ===1){
    //                this.setState({
    //                    hmtlUrl:res.data.fileAddress,
    //                    previewVisible:true
    //                })
    //              }else{
    //                message.error(res.data.msg)
    //              }
    //          } )
    //      }else{

    //      }
    // }
    cancel = () => {
        message.warning('已取消当前操作')
    }
    hidden = () => {
        this.setState({
            visible:false
        })
    }
    doubleClick =  (status) => {
        if(parseInt(status, 10) !== 2) return
        this.preview()
    }

    // 上传报告点击事件 
    uploadReportPageShow = () => {
        history.push('/allopinion/uploadReport')
    }


    // 删除弹窗确认按钮点击事件
    deleteReport = () => {
        
    }

    // 删除弹窗取消按钮点击事件
    cancelDelete = () => {
        this.setState({
            deleteModal2: false,
        })
    }

    // 报告详情 cancel事件
    cancel = () => {
        this.setState({
            reportDetailModal2: false,
        })
    }


    //  预览点击事件
    preview = () => {
        this.setState({
           reportDetailModal2: true,
        })
    }
    

    // 查看报告详情
    showReportDetail = ()=> {
        this.setState({
            reportDetailModal2: true
        })
        request(api_reportDetail, {
            method: 'POST',
            headers: {
                 "Content-Type": "application/x-www-form-urlencoded"
           }, 
           body: `&reportId=144`   //${this.state.checkId}
        
        }).then(res => {
            console.log('报告Id', this.state.checkId)
            console.log('报告详情',res)
            if(res.data.code === 2) {
                this.setState({
                    reportDetailFileName: res.data.fileName,
                    reportDetailOperator: res.data.operator,
                    reportDetailReportType: res.data.reportType,
                    reportDetailuploadTime: res.data.uploadTime,
                    reportDetailReportName: res.data.reportName
                })
            }
        })
    }

    //  查看报告详情 保存事件 
    viewReportDetailSave = () => {
        this.setState({
            reportDetailModal2: false
        })
    }

    // 报告下载
    // downloadReport = () => {
    //     request(api_downLoadReport,{
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         }, 
    //         body: `&reportId=144`   //${this.state.checkId}
    //     }).then( res => {
    //         console.log('下载',res)
    //         if (res.data.code === 1 ) {
    //             message.success(res.data.msg)
    //         }
    //         if (res.data.code === 2 ) {
    //             message.error(res.data.msg)
    //         }
    //     })
    // }


     render(){
         let {reportDetailReportName,reportDetailReportType,reportDetailFileName,reportDetailuploadTime,reportDetailOperator} = this.state 
         const typeList = this.state.typeList.map( (item,index) => {
             return <li key = {index} 
             style={this.state.type === item.type ?{color:'#6893ff'}:{color:'#000'}}
             onClick = {this.changeType.bind(this,item.type)}
             >{item.name}</li>
         })
         const contentList = this.state.contentList.map( (item,index) => {
             return <li key = {index} 
             className={this.state.checkId === item.id ?'cont active':'cont normal'}> 
             <img src={'./../..'+item.imagepath} alt="" onDoubleClick={this.doubleClick.bind(this, item.status)} onClick = {this.changeReport.bind(this,item.id,item.status,item.reportType,item.reportFormId,item.new,item.reportName,item.updateTime)}/>
             {
             this.state.editReprotName === item.id ? <Input  value={this.state.inputValue} onChange={this.changeReportName.bind(this)} onBlur = {this.blur.bind(this,item.id)}/>:
             <p title="双击可修改名称" onDoubleClick={this.editReportName.bind(this,item.id,item.reportName)} style={{userSelect:'none',height:'28px'}} >{item.reportName}</p>
             }
             {  
                item.new === '1' ?
                <p style={{marginBottom:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>{item.updateTime}
                    {
                        item.status === '2' ?
                        "" : <IconFont className="status" type="icon-weiwancheng" style={{width: 14, height: 14}}/>
                    }
                </p>
                :
                <p style={{marginBottom:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>{item.updateTime}
                </p>
             }
             </li> 
         })
         const {isShow,flag,reportType} = this.state;
         return (
             <div className="my-report" onScroll={this.onScroll}>
             <div className="my-report-top">
             <div className="my-add-report">
                 <span onClick={this.addReport}>+&nbsp;&nbsp;新建报告</span>
                 {/* <span>导入报告</span> */}
                 <Icon type="arrow-up" theme="outlined" /><span onClick = {this. uploadReportPageShow}>&nbsp;&nbsp;已有报告上传</span>
             </div>
             <div className="my-search-report">
                 <Input placeholder="请输入报告名称" className="input-search"
                 onChange = {this.changeSearchName} value={this.state.inputSearchValue}
                 />
                 <span className="time">生成时间</span>
                 <DatePicker onChange={ this.changeStartTime }/>
                 <span className="time">一</span>
                 <DatePicker onChange={ this.changeEndTime }/>
                 <Button style={{marginLeft:'18px'}} onClick={this.searchReport}>搜索</Button>
             </div>
             </div>
             <div className="my-report-type">
              <ul className="my-report-type-list" >
                  <li>报告类型:</li> 
                  {typeList}
              </ul>
             </div>
             <div className="my-report-content">
             <Affix offsetTop={60}>
             <p>
             {/* <Tooltip title="复制" placement="bottom">
                <Popconfirm title="确定要复制该报告吗？" onConfirm={this.copy} okText="是" cancelText="否"
                getPopupContainer={() => document.querySelector('.my-report')}  placement="topLeft"
                >
                <i> <IconFont type="icon-fuzhi1"/></i>
                </Popconfirm>
             </Tooltip> */}
             <Tooltip  title="下载" placement="bottom">
                 <i style={flag && isShow? {opacity:1,transition:'all 0.5s ease-in 0.5s', color: '#6893ff'}:{display:'none',opacity:0, color: '#6893ff'}}><IconFont onClick ={this.downLoad.bind(this, api_downLoadReport)} type="icon-msnui-download"/></i>
             </Tooltip>
             <Tooltip title="删除" placement="bottom">
                <Popconfirm title="确定要删除该报告吗？" onCancel={this.cancel} onConfirm={this.delete} okText="是" cancelText="否"
                getPopupContainer={() => document.querySelector('.my-report')}  placement="topLeft"
                >
                <i onClick = {this.hidden} style={flag ? {opacity:1,transition:'all 0.5s ease-in 0.5s'}:{display:'none',opacity:0}}><IconFont type="icon-shanchu1-copy-copy"/></i>
                </Popconfirm>
             </Tooltip>  
             <Tooltip title="预览" placement="bottom">
             <i  onClick = {this.showReportDetail} style={ reportType ==='01'|| isShow? {opacity:1,transition:'all 0.5s ease-in 0.5s'}:{display:'none',opacity:0}}><IconFont  type="icon-Dashboard-card-SQLchakan"/></i>
             </Tooltip>
             </p>
             </Affix>
             <div className="content">
              <ul>
                  {contentList}
              </ul>
              <div className="pagination">      
              <Pagination total={this.state.recordTotal} onChange={this.paginationChange}
               current={this.state.current} pageSize={12}/>    
              </div>
             </div>
             </div>
             <Modal visible={this.state.previewVisible} footer={null} onCancel={this.onCancel}
             width="60%" className="preview-modal"
             >
                <iframe  title="模板预览" frameBorder="0"  width="100%" height="98%"
                style={{marginTop:'26px'}}
                src={"./../.." + this.state.hmtlUrl} />  
             </Modal>

             	{/* 是否删除弹框 */}
			    {/* <Modal  width = "31%" className = "deleteReportModal2" title='确认信息'  visible={this.state.deleteModal2} footer={null} >
                  <div className="report-delete" style={{width:'50%',margin:'0 auto'}}>
                      <div className="button-option2">
                         <div onClick={this.deleteReport2}>删除</div>
                         <div onClick={this.cancelDelete2}>取消</div>
                      </div>
                  </div> 
              </Modal> */}

                {/* 报告详情 弹窗*/}
                <Modal  width = "42%" visible={this.state.reportDetailModal2} onCancel={this.cancel} footer={null} > 
                    <div className = "reportDetail2">
                        <div className="upload-report-top2">
                            <p >&nbsp;&nbsp;上传报告详情<span ></span></p>
                            
                        </div>

                        <div className = "upload-report-content2">
                            <div className="reportName2">
                                <span className="span1">报告名称</span>
                                <span>{reportDetailReportName}</span>
                                
                            </div>  

                            <div  className="reportType2">
                                <span className = "span2">报告类型 </span>
                                <span>{reportDetailReportType} </span>
                               
                            </div>

                            <div className = "reportFileContainer2">
                                <span className = "span3">
                                    报告文件
                                </span>
                                <span style ={{color: 'rgb(28,150,212)'}}>
                                    {reportDetailFileName}
                                </span>
                                <Button onClick ={this.downLoad.bind(this,api_downLoadReport)} style = {{backgroundColor: 'rgb(28,150,212)', color: '#fff',width:"65px",height: "30px",marginLeft: "30px"}} className = "downloadButton2">
                                    下载
                                </Button>
                            
                            </div>  
                            <div>
                                <span className ="span4">
                                    上传时间
                                </span>
                                <span>
                                    {reportDetailuploadTime}
                                </span>    
                                <span style = {{marginLeft: '95px',marginRight:"50px"}}>
                                    操作人
                                </span>
                                <span>
                                    {reportDetailOperator}
                                </span>
                            </div>
                          
                           
                           
                        </div> 
                        <div style={{textAlign:"center",marginBottom: "50px"}}>
                            <Button onClick ={this.viewReportDetailSave}  style = {{backgroundColor: 'rgb(28,150,212)', color: '#fff',width:"80px",height: "35px"}}>
                                保存
                            </Button>
                        </div>
                    </div>
                </Modal>




             </div>
         )
     }
}
export default MyReport;