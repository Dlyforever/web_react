import React from 'react';
import './CustomHome.less';
import IcontFont from '../../components/IconFont';
import { Container, Draggable } from 'react-smooth-dnd';
import {Icon,message} from 'antd';
import request from '../../utils/request';
import {history} from '../../utils/history';
import {api_save_widget,api_homepage_message} from '../../services/api';
import audio from '../../assets/img/5a4c765ddd95a.mp3';
import {customHome,isRepeat} from '../../utils/format';
const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
    const result = [...arr];
    let itemToAdd = payload;
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
    return result;
  };
  
class CustomHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
         browserHeight:800,
         flag:false,
         isDragend:false,
         moduleList:[
             {name:'NewestWarningOpinionBox',defaultSize:50,size:50,type:'s',img:'NewestWarningOpinionBox.png'},
             {name:'NegativeOpinionBox',defaultSize:50,size:50,type:'s',img:'NegativeOpinionBox.png'},
             {name:'NewestOpinionBox',defaultSize:50,size:50,type:'s',img:'NewestOpinionBox.png'},
             {name:'TopicOpinionBox',defaultSize:50,size:50,type:'s',img:'TopicOpinionBox.png'},
             {name:'WeiboOpinionBox',defaultSize:50,size:50,type:'s',img:'WeiboOpinionBox.png'},
             {name:'TodayOpinionBox',defaultSize:40,size:40,type:'s',img:'TodayOpinionBox.png'},
             {name:'OpinionCountBox',defaultSize:100,size:60,type:'b',img:'OpinionCountBox.png'},
             {name:'OpinionTrendBox',defaultSize:60,size:60,type:'b',img:'OpinionTrendBox.png'},
             {name:'MediaDistribution',defaultSize:40,size:40,type:'s',img:'MediaDistribution.png'},
             {name:'HotWordBox',defaultSize:40,size:40,type:'s',img:'hotword.png'},
             {name:'Leitmedium',defaultSize:50,size:50,type:'s',img:'Leitmedium.jpg'}
         ],
         moduleCont0:[],
         moduleCont1:[],
         moduleCont2:[],
         moduleCont3:[],
         moduleCont4:[],
         moduleCont5:[],
         isDrag:true,
         firstSize:0,
         result:0,
         allList:[],
         groupName:'2',
         isEnter:false
        }
    }
    componentDidMount(){
        request(api_homepage_message)
        .then(res => {
            if(res.data){
                this.setState({
                    moduleList:isRepeat(this.state.moduleList,res.data)
                })
                customHome(res.data).forEach((item,index) => {
                    let modules = 'moduleCont'+index;
                    this.setState({
                        [modules]:item
                    })
                })
            }
        })
        this.setState({
            browserHeight:window.innerHeight-136
        })
    }
    showList = () => {
        this.setState({
            flag:!this.state.flag
        })       
    }
    drop = (e) => { 
            this.refs.audio.play();
            let {isDrag,isEnter} = this.state;
            if(isEnter){
                this.setState({
                    isDrag:true,
                    isEnter:false
                },()=>{
                    if(!isDrag){
                        return ;
                    }
                    this.setState({
                        moduleList: applyDrag(this.state.moduleList, e),
                       // allList:this.state.allList.concat(e.payload),
                        isDragend:true
                    })
                })
            }

    }
    drop1 = (type,e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum=0;let num = 0;
        let moduleCont0 =  applyDrag(this.state.moduleCont0, e);
        moduleCont0.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{
                 bNum+=1;
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont0.forEach(item => {
               item.defaultSize = 33.3;
               item.img = item.name +'33.jpg';  
          })
        }else if(moduleCont0.length === 2){
                moduleCont0[0]['defaultSize'] =  moduleCont0[0]['size'] ;
                moduleCont0[1]['defaultSize'] = 100 - moduleCont0[0]['defaultSize'] ;
        }
        if(this.state.isDrag) this.setState({moduleCont0: moduleCont0})
       }
    }
    drop2 = (e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum = 0;let num = 0;
        let moduleCont1 =  applyDrag(this.state.moduleCont1, e);
        moduleCont1.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{ 
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont1.forEach(item => {
               item.defaultSize = 33.3;   
          })
        }else if(moduleCont1.length === 2){

            moduleCont1[0]['defaultSize'] =  moduleCont1[0]['size'] ;
            moduleCont1[1]['defaultSize'] = 100 - moduleCont1[0]['defaultSize'] ;
        }
    //     this.setState({
    //         moduleCont1: moduleCont1
    //    })
       if(this.state.isDrag) this.setState({moduleCont1: moduleCont1})
      }
    }
    drop3 = (e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum = 0;let num = 0;
        let moduleCont2 =  applyDrag(this.state.moduleCont2, e);
        moduleCont2.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont2.forEach(item => {
               item.defaultSize = 33.3;   
          })
        }else if(moduleCont2.length === 2){
            moduleCont2[0]['defaultSize'] =  moduleCont2[0]['size'] ;
            moduleCont2[1]['defaultSize'] = 100 - moduleCont2[0]['defaultSize'] ;
        }
        // this.setState({
        //     moduleCont2: moduleCont2
        // })
       if(this.state.isDrag) this.setState({moduleCont2: moduleCont2})
       }
    }
    drop4 = (e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum = 0;let num = 0;
        let moduleCont3 =  applyDrag(this.state.moduleCont3, e);
        moduleCont3.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont3.forEach(item => {
               item.defaultSize = 33.3;   
          })
        }else if(moduleCont3.length === 2){
            moduleCont3[0]['defaultSize'] =  moduleCont3[0]['size'] ;
            moduleCont3[1]['defaultSize'] = 100 - moduleCont3[0]['defaultSize'] ;
        }
        // this.setState({
        //     moduleCont3: moduleCont3
        // })
       if(this.state.isDrag) this.setState({moduleCont3: moduleCont3})
    }
    }
    drop5 = (e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum = 0;let num = 0;
        let moduleCont4 =  applyDrag(this.state.moduleCont4, e);
        moduleCont4.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont4.forEach(item => {
               item.defaultSize = 33.3;   
          })
        }else if(moduleCont4.length === 2){
            moduleCont4[0]['defaultSize'] =  moduleCont4[0]['size'] ;
            moduleCont4[1]['defaultSize'] = 100 - moduleCont4[0]['defaultSize'] ;
        }
    //     this.setState({
    //         moduleCont4: moduleCont4
    //    })
        if(this.state.isDrag) this.setState({moduleCont4: moduleCont4})
      }
    }
    drop6 = (e) => {
        if(this.state.isEnter){
        let sNum = 0;let bNum = 0;let num = 0;
        let moduleCont5 =  applyDrag(this.state.moduleCont5, e);
        moduleCont5.forEach(item => {
              if(item.type === 's'){
                 sNum+=1;
                 num+=1;
              }else{
                 num+=2;
              }       
        })
        if (num>4 && bNum>=2){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }else if(num>3){
            message.error('该行已达到最多模块数量')
            this.setState({
                isDrag:false
            })
            return ;
        }
        if(sNum>=3){
            moduleCont5.forEach(item => {
               item.defaultSize = 33.3;   
          })
        }else if(moduleCont5.length === 2){

            moduleCont5[0]['defaultSize'] =  moduleCont5[0]['size'] ;
            moduleCont5[1]['defaultSize'] = 100 - moduleCont5[0]['defaultSize'] ;
        }
        // this.setState({
        //     moduleCont5: moduleCont5
        // })
        if(this.state.isDrag) this.setState({moduleCont5: moduleCont5})
      }
    }
    leave = () => {
        this.setState({
            isEnter:true
        })
    }
    remove = () => {
       const list= [
            {name:'TodayOpinionBox',defaultSize:40,size:40,type:'s',img:'TodayOpinionBox.png'},
            {name:'OpinionTrendBox',defaultSize:60,size:60,type:'b',img:'OpinionTrendBox.png'},
            {name:'OpinionCountBox',defaultSize:100,size:60,type:'b',img:'OpinionCountBox.png'},
            {name:'HotWordBox',defaultSize:50,size:40,type:'s',img:'hotword.png'},
            {name:'NewestWarningOpinionBox',defaultSize:50,size:50,type:'s',img:'NewestWarningOpinionBox.png'},
            {name:'NegativeOpinionBox',defaultSize:50,size:50,type:'s',img:'NegativeOpinionBox.png'},
            {name:'NewestOpinionBox',defaultSize:50,size:50,type:'s',img:'NewestOpinionBox.png'},
            {name:'WeiboOpinionBox',defaultSize:50,size:50,type:'s',img:'WeiboOpinionBox.png'},
            {name:'MediaDistribution',defaultSize:50,size:40,type:'s',img:'MediaDistribution.png'},
            {name:'TopicOpinionBox',defaultSize:50,size:50,type:'s',img:'TopicOpinionBox.png'},
            {name:'Leitmedium',defaultSize:50,size:50,type:'s',img:'Leitmedium.jpg'}
        ];    
        request(api_save_widget, {
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `widget=${JSON.stringify(list)}`
          }).then(res => {
              if(res.data.code === '1'){
                 history.push('/home')
              }
          })
    }
    mouseOver = () => {
        this.setState({
            isEnter:true
        })
    } 
    mouseOut = () => {
        this.setState({
            isEnter:false
        })
    }
    //删除模块
    closeModule(index,type){
        let moduleCont = this.state[type];
        let {allList} = this.state;
        this.setState({
            moduleList:this.state.moduleList.concat(moduleCont[index])
        })
        allList.forEach((item,indexs) => {
            if(item.name === moduleCont[index]['name']){
                allList.splice(indexs,1)
            }
        })
       moduleCont.splice(index,1);
       if(moduleCont.length === 2){
          moduleCont.forEach(item => {
              item.defaultSize = 50;
          })
       }else if(moduleCont.length !==0){ 
        moduleCont[0]['defaultSize'] = moduleCont[0]['size'];
       }
        this.setState({
            [type]:moduleCont,
            firstSize:moduleCont[0]?moduleCont[0]['defaultSize']:0,
            allList:allList
        })
    }
    confim = () => {
        let {moduleCont0,moduleCont1,moduleCont2,moduleCont3,moduleCont4,moduleCont5} = this.state;
        request(api_save_widget, {
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `widget=${JSON.stringify([...moduleCont0,...moduleCont1,...moduleCont2,...moduleCont3,...moduleCont4,...moduleCont5])}`
          }).then(res => {
              if(res.data.code === '1'){
                 history.push('/home')
              }
          })
    }
    render(){
        let {browserHeight,flag,moduleList,moduleCont0,moduleCont1,moduleCont2,moduleCont3,moduleCont4,moduleCont5} = this.state;
        let num = (browserHeight+110)/3;
        let moduleListItems = moduleList.map ((item,index) => {
            return  <Draggable key={index}>
                    <div>
                    <img src={require('../../assets/home-img/' + item.img)} alt='' style={{height:'210px'}}/>
                    </div>
                    </Draggable>
        });
        let moduleContItems0 = moduleCont0.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont0')}/>
                   </div>
                   </Draggable>
        })
        let moduleContItems1 = moduleCont1.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont1')}/>
                   </div>
                   </Draggable>
        })
        let moduleContItems2 = moduleCont2.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont2')}/>
                   </div>
                   </Draggable>
        })
        let moduleContItems3 = moduleCont3.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont3')}/>
                   </div>
                   </Draggable>
        })
        let moduleContItems4 = moduleCont4.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont4')}/>
                   </div>
                   </Draggable>
        })
        let moduleContItems5 = moduleCont5.map ((item,index) => {
            return <Draggable key={index} style={{width:`${item.defaultSize-2}%`,margin:'1%'}}> 
                   <div className="moduleCont">
                   <img src={require('../../assets/home-img/' + item.img)} alt='' style={{width:'100%',height:'365px'}}/>
                   <Icon type="close-circle" onClick={this.closeModule.bind(this,index,'moduleCont5')}/>
                   </div>
                   </Draggable>
        })
        return (
            <div className="custom-home" >
      <audio style={{display:'none'}} ref="audio"> 
        <source src={audio} type="audio/mpeg" />
        您的浏览器不支持 audio 元素。
      </audio>                
                <div className="custom-title">
                <span>首页布局设置</span>
                <p>
                <span onClick={this.remove}>恢复默认</span> 
                <span className="custom-confim"  onClick={this.confim}>确定</span>
                </p>
                </div>
                <div style={{height:`${browserHeight}px`,overflowY: 'auto',padding:'20px'}}
                 onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>   
                <Container groupName="1" orientation='horizontal'
                        data-id='1'
                        onDrop={ this.drop1.bind(this,'moduleCont0') }
                        getChildPayload={i => this.state.moduleCont0[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap'}}
                       >
                       {moduleContItems0}
                       </Container>
                       <Container groupName="1" orientation='horizontal'
                        onDrop={this.drop2}
                        getChildPayload={i => this.state.moduleCont1[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap'}}
                       >
                       {moduleContItems1}
                       </Container>
                       <Container groupName="1" orientation='horizontal'
                        onDrop={this.drop3}
                        getChildPayload={i => this.state.moduleCont2[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap'}}
                       >
                       {moduleContItems2}
                       </Container>
                       <Container groupName="1" orientation='horizontal'
                        onDrop={this.drop4}
                        getChildPayload={i => this.state.moduleCont3[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap'}}
                       >
                       {moduleContItems3}
                       </Container>
                       <Container groupName="1" orientation='horizontal'
                        onDrop={this.drop5}
                        getChildPayload={i => this.state.moduleCont4[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap'}}
                       >
                       {moduleContItems4}
                       </Container>
                       <Container groupName="1" orientation='horizontal'
                        onDrop={this.drop6}
                        getChildPayload={i => this.state.moduleCont5[i]}
                        style={{minHeight:'350px',whiteSpace: 'pre-wrap',marginBottom:'300px'}}
                       >
                       {moduleContItems5}
                       </Container>
                </div>  
                <div className="slider-module"
                style={ flag?{bottom:'0px',height:'20px'}:{bottom:'0px',height:num+'px'}}>
                <div className="slider-switch" onClick = {this.showList}>
                    <IcontFont type="icon-caidanshousuoicon" ></IcontFont>
                </div>
                   <Container groupName='1' orientation='horizontal'
                   onDrop={ this.drop }
                   getChildPayload={i => this.state.moduleList[i]}
                   onDragLeave = {this.leave}
                   style={{background:'#ededed'}}
                   >
                   {moduleListItems}
                   </Container>
                </div>
                
            </div>
        )
    }
}
export default CustomHome