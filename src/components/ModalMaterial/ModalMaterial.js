import React from 'react'
import {Checkbox,Input,Button,Modal,Select,message} from 'antd';
import IconFont from '../IconFont';
import './ModalMaterial.less';
import {api_material_opinion_list,api_material_opinion_detail,
        api_update_brief_item,api_refresh_brief,api_add_brief_report
} from '../../services/api';
import request from '../../utils/request';
import ReportDetailList from '../ReportDetailList/ReportDetailList';
import ModalAllOpinion from '../ModalAllOpinion/ModalAllOpinion';
import {checkedTrueSid} from '../../utils/format';
const Option = Select.Option;
const InputGroup = Input.Group;
class ModalMaterial extends React.Component{
     constructor(){
         super();
         this.state={
           checkedAll:false,
           checkedArray:new Array(20).fill(false),
           type:'material',
           reportCatList:[],
           docList:[],
           catId:0,
           page:1,
           flag:false,
           visible:false,
           searchType:'material',
           q:'',
           isShowBlank:false,
           isChange:false,
           id:''
         }
     }
     componentWillMount(){
       request(api_material_opinion_list)
       .then( res => {
            if(res.data){
               let catId = res.data.reportCatList[0]['id']; 
               this.setState({
                 reportCatList:res.data.reportCatList,
                 catId:catId
               }) 
               request(api_material_opinion_detail +`&catid=${catId}`)
               .then( res => {
                   this.setState({
                     docList:res.data.result[0]['datelist']
                   })
               })
            }
       })
     }
     //全选
     checkAll(e){
          if(e.target.checked){
            this.setState({
                checkedArray:this.checkedTrue(),
                checkedAll:e.target.checked
              })
        }else{
            this.setState({
                checkedArray:this.state.checkedArray.fill(false),
                checkedAll:e.target.checked
              })
        }
     }
     //确定按钮
     confirm = () => {
       const _this = this;
       const {type,typeId} = this.props;
       if(this.props.type){
         request(api_add_brief_report,{
          method: 'POST',
          headers: {
                "Content-Type": "application/x-www-form-urlencoded"
          },
          body:`reportFormId=${typeId}&reportType=${type}&sids=${JSON.stringify(checkedTrueSid(_this.state.checkedArray))}`
          }).then(res => {
             if(res.data.code === 1){
               this.props.checkReport(res.data,true); 
             }else{
               message.error(res.data.msg)
             }
          })
       }else{
              request(api_update_brief_item ,{
                method: 'POST',
                headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                },
                body:`reportId=${this.props.reportId}&code=1&sids=${JSON.stringify(checkedTrueSid(_this.state.checkedArray))}`
                }).then(res => {
                if(res.data.code === 1){
                  if(this.props.checkMaterial){
                      this.props.checkMaterial(res.data.data)
                  }else{
                    request(api_refresh_brief + `&reportId=${this.props.reportId}`)
                    .then(res => {
                        if(res.data.code === 1){
                          this.props.checkReport(res.data.data,false); 
                        }
                    }) 
                  }
                }
            })
       }
       this.setState({
        checkedArray:this.state.checkedArray.fill(false),
        checkedAll:false,
        q:''
       })
     }
    //获取sid
    checkedTrue() {
      const arr = [];
      this.state.docList.forEach(item => {
          item.doclist.forEach(items => {
             arr.push(items.sid);
          })
      });
      return arr;
      }
     //单选
     checkItem(sids){
        this.setState({
          checkedArray:sids
        })
     }
     //素材库，全站搜索
     handleChange(value){
        this.setState({
          searchType:value
        })
     }
     //下拉加载
     dropDown(e){
      let {catId,page,docList,checkedArray,q} = this.state;
      var bScrollH = e.target.scrollHeight; 
      if(e.target.scrollTop + 600 >= bScrollH){
        request(api_material_opinion_detail +`&catid=${catId}&page=${page+1}&q=${q}`)
        .then( res => {
            if(res.data.result.length !== 0){
            this.setState({
              docList:docList.concat(res.data.result[0]['datelist']),
              page:page+1,
              checkedArray:checkedArray.concat(new Array(20).fill(false))
            })
           }
        })
      }
 
     }

     //展开按钮
     showMaterial(id){
        let {catId,checkedArray,checkedAll} = this.state;
        this.setState({
          checkedAll:false,
          checkedArray:[]
        })
        if(checkedAll ||checkedArray.length!==0){
           this.setState({
               isChange:true,
               id:id
           })
        }
        if(catId === id){
          this.setState({
            catId:''
          })
        }else{
          this.setState({
            catId:id,
            isShowBlank:false
          })
          request(api_material_opinion_detail +`&catid=${id}`)
          .then( res => {
            if(res.data.result.length !== 0){
              this.setState({
                docList:res.data.result[0]['datelist'],
                checkedArray:checkedArray.concat(new Array(20).fill(false)),
                flag:false
              })
            }else{
              this.setState({
                flag:true,
                docList:[],
                isShowBlank:true
              })
            }
          })
        }
     }
     //输入框 回车事件
     keyDown = (e) => {
          let code = e.keyCode;
          let value = e.target.value
          if(code === 13 && this.state.searchType === 'all'){
            this.setState({
                visible:true,
                q:value
            })
           }else if(code === 13 && this.state.searchType === 'material'){
           request(api_material_opinion_detail +`&catid=${this.state.catId}&q=${value}`)
             //request(api_material_opinion_detail +`&q=${value}`)
             .then(res => {
                  if(res.data.result.length!==0){
                    this.setState({
                      docList:res.data.result[0]['datelist'],
                      q:value,
                      isShowBlank:false
                    })
                  }else{
                    this.setState({
                      isShowBlank:true,
                      q:value
                    }) 
                  }
             })
           }
     }
     //关闭监测弹窗
     cancel = () => {
        this.setState({
          visible:false,
          q:' '
        })
     }
     //监测弹窗数据回调
     checkAllOpinion = (data,status) => {
       if(status){
         this.props.checkMaterial(data)
       }else{
         this.props.checkReport(data,true)
       }  
       this.setState({
          visible:false
       })
     }
     render(){
         const docList = this.state.docList.map((item,index) => {
               return <div key={index}>
                      <div className="cat-date">{item.datetime}</div>
                      <ReportDetailList 
                        checkedArray={this.state.checkedArray}
                        docList={item.doclist}
                        checkItem = {this.checkItem.bind(this)}
                        typr='material'
                      />
                      </div>
         })
         const catList = this.state.reportCatList.map((item,index) => {
            return <div key={index} className="cat-cell"> 
                   <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid #f0f2fb',justifyContent:'space-between',paddingRight:'30px'}}>
                   <div style={{display:'flex',width:'90%',alignItems:'center'}}>
                   <span style={this.state.catId === item.id ?{display:'inline-block'}:{display:'none'}}>
                   <Checkbox onChange={this.checkAll.bind(this)} checked={this.state.checkedAll}/>
                   <span>全选</span>
                   </span> 
                   <div className="cat-name" onClick={this.showMaterial.bind(this,item.id)}>
                   <span >
                   {this.state.isChange && this.state.id === item.id?<IconFont type="icon-wenjianjia1" style={{marginRight:"12px",color:'#4EC9B0'}}/>:<IconFont type="icon-wenjianjia1" style={{marginRight:"12px",color:'#108EE9'}}/>}
                   {item.catname}</span>
                   </div>
                   </div>
                   <IconFont type="icon-jiantou2"
                    style={this.state.catId === item.id ?
                      {transform:'rotate(0deg)',transition:'all 0.5s'}
                      :{transform:'rotate(-90deg)',transition:'all 0.5s'}
                      }
                   />
                   </div>
                   {this.state.isShowBlank && this.state.catId === item.id?<div style={{textAlign:'center'}}>文件夹下无该关键词相关内容，请换一个</div>:
                   this.state.catId === item.id ?<div className="loading-cell" onScroll = {this.dropDown.bind(this)}>
                   {docList}
                   </div>: null } 
                   </div> 
        })
         return (
             <div className="modal-material opinion-detail">
                <div className="modal-material-top">
                    <div>
                    <InputGroup compact>
                    <Select defaultValue="material" onChange={this.handleChange.bind(this)} 
                      getPopupContainer={() => document.querySelector('.briefingWapper')}
                     className="select"
                     >
                    <Option value="material">素材库</Option>
                    <Option value="all" >全站搜索</Option>
                    </Select>
                    <Input onKeyDown={this.keyDown}/>
                    </InputGroup>
                    </div>
                    <Button type="primary" onClick={this.confirm}>确定</Button>
                </div> 
                <div className="modal-material-content bottom">
                   {catList}
                </div>
                <Modal visible={this.state.visible} footer={null} onCancel={this.cancel}
                width="70%" maskClosable={false} className="report-modal"
                >
                <ModalAllOpinion 
                seltype='title' 
                keyword={this.state.q}
                checkAllOpinion ={this.checkAllOpinion}
                reportId = {this.props.reportId}
                type={this.props.type}
                typeId={this.props.typeId}
                />
                </Modal>
             </div>
         )
     }
}

export default ModalMaterial;

