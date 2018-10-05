import React from 'react';
import './Organizational.less';
import { Container, Draggable } from 'react-smooth-dnd';
import {Input,Button,Table,Tree,Icon,Menu,Dropdown,Modal,Radio,message,Select} from 'antd';
import Iconfont from '../../components/IconFont';
import { api_save_personnelInfo,api_treeShow,api_isExistOrganizationName,api_addOrganization,
         api_get_role,api_person_list,api_person_Info,api_get_orgInfo,api_del_person,
         api_sub_sys,api_save_subRight,api_get_jobsInfo,api_addJob,api_selectPrincipal,
         api_delJobTip,api_delJob,api_testJobName,api_reset_pass,api_choose_leader,api_testEmailUnique,api_testPhoneNumUnique
         ,api_find_orgname,api_reName,api_editJobName,api_find_byJobName,api_update_orginfo,api_delOrg,api_testPersonalCode
} from '../../services/api';
import request from '../../utils/request';
import {objectToURL} from '../../utils/format'
const { TextArea } = Input;
// const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Confirm = Modal.confirm;

const Option = Select.Option;
// 人员详情保存按钮点击事件弹出框组件
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
class Organizational extends React.Component{
      constructor(){
          super()
          this.state = {
            organizationModal:false,
            postModal:false,
            personnelModal:false,
            renameModal:false,
            deleteModal: false,
            authorize:false,
            chooseOrganization:false,
            statusValue:1,
            sixValue:0,
            reNameValue:'',
            organizationName:'',
            person:'',
            organizationCode:'',
            described:'',
            jobName: '',
            jobDescription: '',
            personalCode: '',
            personalName: '',
            phoneNumber: '',
            personalEmail: '',
            QQNumber: '',
            weChatNumber: '',
            personalDescription: '',
            authorizeList:['仅本人数据','仅本部门数据','仅本部门及下级数据','全部'],
            authorizeKey:0,
            saveClickModal: false,
            canUse1: true, 
            canUse2: true,
            canUse3: true,
            treeList: '',
            treeData: '',
            treeResData: '',
            flag1 : false,
            // expandedKeys: ['0-0', '0-0-0', '0-0-0-0','0-0-0-0-0','0-0-0-0-0-0'],
            orguuid: '',
            roleTableList:[],
            personList:[],
            checkedRole:[],
            personuuid:'',
            fullName:'',
            parentCnName:'',
            selectJobModal: false,
            selectOrgModal: false,
            cnname: '',
            treeList2: '',
            selectedJobName: '',
            jobsuuid: '',
            addJobFlag: false,
            orgFlag: false,
            isShowAuthorize:false,
            initialCode:'',
            initialName:'',
            initialLeader:'',
            initialDescription:'',
            initialParentCnName:'',
            leaderList:[],
            checkOrguuidList:[],
            selectedJobName:'',
            checkJobsuuidList:'',
            item: '',
            menuListKey0: '',
            menuListKey1: '',
            flagInfo: 0,
            findByOrgNameValue:'',
            testlist:[false,true],
            findByJobNameValue:''
          } 
      }  

  //操作区菜单
  menuList = () => {
    return  <Menu onClick={this.operateMenu} >
      <Menu.Item key="0">
        添加下级
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        添加岗位
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        添加人员
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        重命名
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">
        删除
      </Menu.Item>
    </Menu>
  }



  // 操作区岗位菜单

  jobsMenuList = () => {
    return  <Menu onClick={this.jobsOperateMenu} >
        <Menu.Item key="0">
          编辑
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          删除
        </Menu.Item>
        <Menu.Divider />
    </Menu>
  }
    // 删除岗位前提示会话框
  
 
    showDeleteConfirm  = (res) => {
      // 改变this指向为  当前组件   confirm 也是一个组件
      let that = this    
      Confirm({
        title: res.data.msg,
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          request(api_delJob + `&jobsuuid=${that.state.item.jobsuuid}`)
          .then(res => {  
            console.log('删除确认',res)
           if(res.data.code == 0 ) {
             message.success('岗位删除成功')
             that.updateTree()
           } else {
            message.error("岗位删除失败")
           }
          })
        },
        onCancel() {     
        },
      });
    }

  //操作区菜单点击事件
  jobsOperateMenu = ({key}) => {
    if(key === '0')  {
       this.setState({
         postModal:true,
         menuListKey0 : 0,
         jobName: this.state.item.jobsName
        }) 
    }   
    // 如果 key 为 1 删除当前项
    if(key === '1')  {
      this.setState({
        menuListKey1: 1
      })
      request(api_delJobTip + `&jobsuuid=${this.state.jobsuuid}`)
      .then(res => {
       this.showDeleteConfirm(res)
      })
    }
  }  
  // 删除岗位事件

  showDeleteConfirm  = (res) => {
    // 改变this指向
    let that = this    
    Confirm({
      title: res.data.msg,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        request(api_delJob + `&jobsuuid=${that.state.item.jobsuuid}`)
        .then(res => {  
          console.log('删除岗位',res)
         if(res.data.code === 0 ) {
           message.success('删除岗位成功')
           that.updateTree()
         } else {
          message.error("删除岗位失败")
         }
        })
      },
      onCancel() {
        
      },
    });
  }

  // 获得uuid
  getuuid2 = (item) => {
    this.setState({
      // 勿删   有用
      item: item,
      isShowAuthorize:false
    }) 
    if(item.jobsName) {
      this.setState({
        jobsuuid: item.jobsuuid,
        selectedJobName: item.jobsName,
      })
    } else if (item.cnname) {
      this.setState({
        orguuid: item.orguuid,
        cnname: item.cnname,
        reNameValue: item.cnname,
        checkOrguuidList:[item.orguuid]
      })
    }
  }
// 获取树节点的 orguuid    
getUuid = (item)=> {
    request(api_get_orgInfo + `&orguuid=${item.orguuid}`).then(res => {
      this.setState({
          initialParentCnName:res.data.parentCnName,
          initialCode:res.data.orgCode,
          initialName:res.data.cnName,
          initialLeader:res.data.orgLeader,
          initialDescription:res.data.description
      }) 
    }) 
   }


  // 组件挂载前
  componentWillMount() {
    request(api_treeShow)
    .then(res => {
      if(res.data){
      this.setState({
        treeData: res.data.rows
      })
      request(api_get_orgInfo + `&orguuid=${res.data.rows[0]['orguuid']}`).then(res => {
         this.setState({
             initialParentCnName:res.data.parentCnName,
             initialCode:res.data.orgCode,
             initialName:res.data.cnName,
             initialLeader:res.data.orgLeader,
             initialDescription:res.data.description
         })  
         request(api_choose_leader).then(res => { 
                console.log('负责人', res)
             this.setState({
                 leaderList:res.data.rows
             })
          request(api_person_list).then(res => {
            if(res.data){
              let personList =res.data.rows;
              personList.forEach((item,index) => {
                  item.key = index  
              })
              this.setState({
                  personList:personList
              })
            }
           })
         }) 
       })
      }
    })
  }

  // 刷新树结构 
  updateTree = ()=> {
    request(api_treeShow)
    .then(res => {
      this.setState({
        treeData: res.data.rows
      })
    })
  }

    //操作区菜单点击事件
    operateMenu = ({key}) => {
        if(key === '0') this.setState({organizationModal:true,parentCnName:this.state.cnname})
        if(key === '1') this.setState({postModal:true})
        if(key === '2') this.setState({personnelModal:true})
        if(key === '3') this.setState({renameModal:true})
        if(key === '4') {
          if(this.state.item.jobs === undefined && this.state.item.nodes === undefined) {
            this.deleteOrgConfirm() 
          } else {
            this.deleteOrgConfirm2() 
          }
        }
    }

    // 删除组织会话框    组织下无下级

    deleteOrgConfirm  = () => {
      // 改变this指向
      let that = this    
      Confirm({
        title: '此操作将删除所选组织，是否确认删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          request(api_delOrg,{
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `&orguuid=${that.state.item.orguuid}`
          })
          .then(res => {  
            console.log('删除组织',res.data)
          if(res.data.code === 0 ) {
            message.success('删除组织成功')
            that.updateTree()
          } else {
            message.error("删除组织失败")
          }
          })
        },
        onCancel() {
        },
      });
    }
    

     // 删除组织会话框   组织下有下级

      deleteOrgConfirm2 = () => {
        Modal.info({
          title: '请先删除下级组织和人员。',
          onText: '确认',
        });
      }

    //  操作区菜单弹框取消事件
    cancel = () => {
        this.setState({
            organizationModal:false,
            personnelModal:false,
            renameModal:false,
            authorize:false,

            // 组织详情 表单值
            organizationCode:'',
            organizationName:'',
            person:'',
            described: '',
            canUse1: true,

            // 添加岗位 表单值
            jobName: '',
            jobDescription: '',
            canUse2: true,

            // 添加人员 表单值
            canUse3: true,
            personalCode: '',
            personalName: '',
            phoneNumber: '',
            personalEmail: '',
            weChatNumber: '',
            QQNumber: '',
            statusValue: 1,
            sixValue: '',
            personalDescription: '',
            personnelModal:false,
            saveClickModal: true,

        })
    }
    
    //状态选择
    onstatusChange = (e) => {
          this.setState({
            statusValue: e.target.value
          })
    }
    //性别选择
    onsixChange = (e) => {
      this.setState({
        sixValue: e.target.value
      })
    }
   
  // 重命名部分
   //重命名取消按钮
    cancelName = () => {
      this.setState({
        renameModal:false,
        reNameValue:''
      })
    }

    //重命名输入框
    reNameChange = (e) => {
      this.setState({
        reNameValue: e.target.value
      })
    }

      //重命名确定按钮
      reName = () => {
        let {reNameValue} = this.state;
        if(reNameValue.length>50) { 
            message.error('组织名称请不要超过50个字符')
            return
        }else if(reNameValue.replace(/(^\s*)|(\s*$)/g,'') === ''){
            message.error('组织名称请不要为空')
            return
        }else if (/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(reNameValue)){
            message.error('组织名称请不要带有特殊字符')
            return
        }
        if(this.state.item.orguuid) {
          console.log('重命名',this.state.item.orguuid )
          request( api_reName, {
            method: 'POST',
            headers:  {"Content-Type": "application/x-www-form-urlencoded"},
            body: `&orguuid=${this.state.item.orguuid}&orgName=${this.state.reNameValue}`

          })
          .then(res => {
            console.log('重命名',res)
            if(res.data.code == 1 ) {
              message.success('重命名成功')
              this.setState({
                reNameValue: '' , 
                renameModal: false
              })
              this.updateTree()
            }   
          })
        }
        this.setState({
          renameModal:false
        })
      }
    
    // 组织详情部分
    //组织名称change事件
    organizationNameChange = (e) => {
         let {value} = e.target;
         if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
            message.error('请不要带有特殊字符')
            return;
          }
         this.setState({
            organizationName:value,
            flag1 : true
         })
    }

    //组织名称 blur 事件 验证组织名是否重复
    organizationNameBlur = (e) => {
      var {value} = e.target;
      if (value.length > 0) {
        request(api_isExistOrganizationName + `?flag=checkOrgName&orguuid=${this.state.orguuid}&orgName=${value}`)
        .then(res => {
          if(res.data.code == 0) {
           message.error(res.data.msg)
          } else {
            this.setState({
              flag1:true,
              canUse1:false
            })
          }
        })
      }
    }

    // 组织编码验证
    organizationCodeChange = (e)=> {
      let {value} = e.target
      if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
        message.error('请不要带有特殊字符')
        return;
      }
      this.setState({
       organizationCode:value,
       flag1: true
      })
    }

    //负责人 change事件
    personChange = (e) => {
          let {value} = e.target;   // 结构赋值
          if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
            message.error('请不要带有特殊字符')
            return;
          }
          this.setState({
            person:value,
            flag1: true

          }) 
          if (this.state.flag1 === true) {
            this.setState({
              canUse1: false
            })
          }
          request(api_selectPrincipal)
          .then( res => {
            console.log('负责人', res)
          })
    }

    //描述change事件
    describedChange = (e) => {
          let {value} = e.target;
          if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
            message.error('请不要带有特殊字符')
            return;
          }
          this.setState({
            described:value,
            canUse1: false
          })
    }

     //组织详情保存
     saveOrganization = (e) => {
         let formInfo = this.state
         let {organizationName,person,described} = this.state;
         if (organizationName.replace(/(^\s*)|(\s*$)/g,'') === ''){
            message.error('组织名称请不要为空')
            return;
         }else if (person.replace(/(^\s*)|(\s*$)/g,'') === ''){
            message.error('负责人请不要为空')
            return;
         }
         this.setState({
           organizationModal:false, 
           flag1 : true,
           canUse1: false
         })
         if (this.state.flag1) { 
           // 发送提交请求
           request(api_addOrganization, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, 
            body: `parentorguuid=${formInfo.orguuid}&selectLeaderUuid=${this.state.personuuid}&selectLeaderName=${formInfo.person}&cnname=${formInfo.organizationName}&orgCode=${formInfo.organizationCode}&memo=${formInfo.described}`
          }).then( res=> {
            if(res.data.code == 1) {
              message.success('保存成功')
               this.updateTree()
               this.setState({
                organizationModal: false,
                person: '',
                organizationName: '',
                described: '',
                orguuid: '',
                personuuid: '',
                organizationCode: '',
                canUse1: true,

              })
            } 
          })
         }
    }


    // 添加岗位部分
    // 输入岗位名事件
    inputJobName = (e) => {
      let {value} = e.target;
      this.setState({
        jobName: value,
      })
      if (/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
          message.error('岗位名称请不要带有特殊字符')
          return
      } 
       if (value.length === 0 ) {
        message.error('岗位名称不能为空')
        this.setState({
          canUse2: true
        })
        return
      }
    }

    // 验证当前组织下  岗位名是否重复 blur事件
    inputJobNameBlur = (e) => {
      
      let {value} = e.target;
      if (value == '') {
        message.error('岗位名不能为空')
        this.setState({
          canUse2: true
        })
        return
      }
      if(value !== '') {
        request( api_testJobName + `&orguuid=${this.state.orguuid}&jobsname=${value}`)
        .then(res => {
          console.log('岗位',res)
          if(res.data.code == 0) {
            message.error('岗位名重复')
          } 
          if(res.data.code == 1) {
            this.setState({
              canUse2: false
            })
          }
        })
      }
    }

 
    // 岗位描述
    jobDescriptionChange = (e) => {
      let {value} = e.target;
      if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|（|）|%|【|】|\{|\}|%|？|《|》|\./.test(value)){
        message.error('请不要带有特殊字符')
        return;
      }
      this.setState({
        jobDescription: value
      })
    }

    // 添加岗位保存事件

    saveJob = () => {
      if(this.state.item.jobsName && this.state.menuListKey0 === 0) {
        
         request(api_editJobName,{
           method: 'POST',
           headers: {
            "Content-Type": "application/x-www-form-urlencoded"
           },
           body: `&jobsuuid=${this.state.item.jobsuuid}&jobsName=${this.state.jobName}`
         }).then(res => {
           console.log('编辑岗位', res)
           if (res.data.code === 1) {
              this.setState({
                jobName: '',
                jobDescription: '',
                orguuid: '',
                postModal: false,
              }) 
              this.updateTree()
           }
         })       
      } else {
        let {jobName,jobDescription,orguuid} = this.state;
          request(api_addJob,{
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }, 
            body: `&orguuid=${orguuid}&jobsName=${jobName}&description=${jobDescription}`
          }).then(res => {
            console.log('添加岗位',res)
            if (res.data.code == 0) {
              message.success('岗位添加成功')
              this.setState({
                jobName: '',
                jobDescription: '',
                orguuid: '',
                postModal: false,
              })
              this.updateTree()
            } else {
              message.error('岗位添加失败')
            }
          }) 
      }
      
    }

    // 人员详情部分

    // 人员编码输入change事件
    personalCodeInput = (e) => {
      this.setState({
        personalCode: e.target.value
      })
    }
    
    // 验证人员编码  blur 事件
    personalCodeBlur = () => {
      if(this.state.personalCode !== '') {
        request(api_testPersonalCode, {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
            body: `&orguuid=${this.state.orguuid}&personCode=${this.state.personalCode}`
        }).then(res => {
          console.log( '人员编码',res)
          if(res.data.code === 1) {
            message.error('人员编码重复')
          } 
          if (res.data.code === 0) {
            this.setState({
              flagInfo: this.state.flagInfo + 1
            })
          }
        })
      }
    }

    // 人员姓名输入事件
    personalNameInput = (e) => {
      this.setState({
        personalName: e.target.value
      })
    }
    
    // 人员手机号输入事件
    personalPhoneNumberInput = (e) => {
      let {phoneNumber} = this.state
      this.setState({
          phoneNumber: e.target.value
        })
    }
    
  
    // 手机号码输入 blur 事件
    onPersonalPhoneNumberInput = (e) => {
      let {phoneNumber} = this.state
      let {value} = e.target
      if (phoneNumber.replace(/(^\s*)|(\s*$)/g,'') === ''){
        message.error('手机号码请不要为空')
        return;
      }
      if (/^1\d{10}$/.test(value) !== true) {
        message.error('请输入正确的手机号码')
        return
      }
      request(api_testPhoneNumUnique, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        body: `&tel=${phoneNumber}`
      }).then(res => {
        if (res.data.code === 1) {
          message.error('手机号重复')
          return
        }
      })
      this.setState({
        flagInfo: this.state.flagInfo + 1
      })
    }
        
    // 人员邮箱输入change事件    用change事件设置值 用 blur 事件判断
    personalEmailInput = (e) => {
      this.setState({
          personalEmail: e.target.value
        })
    }

    // 人员邮箱输入blur事件   
    onPersonalEmailInput = (e) => {
      let {personalEmail} = this.state
      let {value} = e.target
      if (personalEmail.replace(/(^\s*)|(\s*$)/g,'') === ''){
        message.error('邮箱请不要为空')
        return;
      }
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) !== true) {
        message.error('请输入正确的邮箱地址')
        return
      } 
      request(api_testEmailUnique, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        body: `&email=${personalEmail}`
      }).then(res => {
        if (res.data.code === 1) {
          message.error('邮箱号重复')
          return
        }
      })

      // 人员编码 与手机号 都没问题则 falgInfo === 2
      if (this.state.flagInfo === 2) {
        console.log('flagInfo值', this.state.flagInfo)
        this.setState({
          canUse3: false
        })
      }
    }

    // 人员微信输入事件
    personalWeChatInput = (e) => {
      this.setState({
          weChatNumber: e.target.value
        })
    }
    
     // 人员QQ输入事件
     personalQQInput = (e) => {
      this.setState({
          QQNumber: e.target.value
        })
    }

    // 人员状态选择事件
     onstatusChange = (e) => {
      this.setState({
          statusValue: e.target.value
        })
    }
    
    // 人员性别选择事件
    onsixChange = (e) => {
      this.setState({
         sixValue: e.target.value
        })
    }

    // 人员描述输入事件
    personalDescriptionInput = (e) => {
      let {value} = e.target;
      if(/~|!|@|#|\$|\^|&|\*|=|\?|！|￥|-|（|）|%|【|】|\{|\}|；|;|%|,|，|。|？|《|》|\./.test(value)){
        message.error('请不要带有特殊字符')
        return;
      }
      this.setState({
        personalDescription: value
      })
    }
     
    // 添加人员  人员详情保存事件
    personalInformationSave = () => {
      let {phoneNumber,personalEmail,canUse3} = this.state;
      let userInfo = this.state;
      let that = this
        // 调用弹框函数 
        Confirm({
          title: 'Confirm',
          content: '是否保存人员信息?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            request(api_save_personnelInfo, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
              }, 
              body:`personcode=${userInfo.personalCode}&fullName=${userInfo.personalName}&tel=${userInfo.phoneNumber}&email=${userInfo.personalEmail}&qq=${userInfo.QQNumber}&weChat=${userInfo.weChatNumber}&accountstat=${userInfo.statusValue}&sex=${userInfo.sixValue}&description=${userInfo.personalDescription}&orguuid=${userInfo.orguuid}&jobsuuid=${userInfo.jobsuuid}`
            }).then( res=> {
              console.log('人员详情保存',res)
                if (res.data.code === 1) {
                  message.success('人员添加成功')
                  that.setState({
                    canUse3: true,
                    personalCode: '',
                    personalName: '',
                    phoneNumber: '',
                    personalEmail: '',
                    weChatNumber: '',
                    QQNumber: '',
                    statusValue: 1,
                    sixValue: '',
                    personalDescription: '',
                    personnelModal:false,
                    saveClickModal: true
                   })
                   //  更新人员列表
                   request(api_person_list).then(res => {
                    if(res.data){
                      let personList =res.data.rows;
                      personList.forEach((item,index) => {
                          item.key = index  
                      })
                      that.setState({
                          personList: personList
                      })
                    }
                   })
               } else {
                 message.error('添加人员失败')
               }
            })
          },
          onCancel() {
           that.setState({
            canUse3: true,
            personalCode: '',
            personalName: '',
            phoneNumber: '',
            personalEmail: '',
            weChatNumber: '',
            QQNumber: '',
            statusValue: 1,
            sixValue: '',
            personalDescription: '',
            personnelModal:false,
            saveClickModal: true
           })
          }
        });
    }

    //角色授权
    showAuthorize = (personuuid,fullName) => {
       request(api_sub_sys)
       .then(res => {
            request(api_get_role + `&subsystemuuid=${res.data.sysid}&personuuid=${personuuid}`)
            .then(res => {
                let checkedRole = [];
                res.data.rows.forEach((item,index) => {
                    if(item.sequenceno === '1' && item.adminflag === '0') checkedRole.push(index)
                })
                let roleTableList = res.data.rows
                roleTableList.forEach((item,index) => {
                    item.key = index
                })
                this.setState({
                  roleTableList:roleTableList,
                  checkedRole:checkedRole
                })
            })
       })
       this.setState({
          isShowAuthorize:true,
          authorize:true,
          personuuid:personuuid,
          fullName:fullName
       })
    }
    //改变角色授权
    changeAuthorize(index){
        this.setState({
          authorizeKey:index
        })
    }
    //授权弹窗确认按钮
    confimAuthorize = () => {
      let {checkedRole,roleTableList} = this.state;
      let addRoles =  checkedRole.map(item => {
          return roleTableList[item]['roleid']
      });
      let addRoleNames =  checkedRole.map(item => {
          return roleTableList[item]['cnname']
      });
      let oldRole = [];
      roleTableList.forEach((item,index) => {
        if(item.sequenceno === '1' && item.adminflag === '0') oldRole.push(index)
      });
      let delRoleList = [];
        oldRole.forEach((item,index) => {
          if(!checkedRole.includes(item)){
            delRoleList.push(item)
          }
        });
      let delRoles = delRoleList.length !== 0 ? delRoleList.map(item => {
        return roleTableList[item]['roleid'] ;
      }):[]; 
      let delRoleNames = delRoleList.length !== 0 ? delRoleList.map(item => {
          return roleTableList[item]['cnname'];
      }):[]
      request(api_sub_sys)
      .then(res => {
        const params = {
          subsystemuuid:res.data.sysid,
          subsystemname:res.data.sysname,
          personuuid:this.state.personuuid,
          subPersonName:this.state.fullName,
          setAdminFlag:0,
          addRoles:addRoles.join(','),
          addRoleNames:addRoleNames.join(','),
          delRoles:delRoles.join(','),
          delRoleNames:delRoleNames.join(',')
        } 
         request(api_save_subRight,{
          method: 'POST',
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          }, 
          body: objectToURL(params)
        }).then(res => {
           if(res.data.code === 1){
               message.success(res.data.msg)
               this.setState({
                authorize:false
               })
           }
        })
      })

    }
    //选择组织弹窗搜索
    searchOrganization = (value) => {
    }
    //选择组织弹窗确认按钮
    confimChoose = () => {
      this.setState({
        chooseOrganization:false
      })
    }
     // 树结构拖拽 onDrop事件
     onDrop = ()=> {

    }
    // 树结构拖拽 onDragEnter事件
    onDragEnter =() => {

    }
    // 选择岗位弹窗显示事件
 
    selectJobShow =() => {
      this.setState({
        selectJobModal: true
      })
    }
 
 
    // 选择岗位弹窗关闭事件
    selectJobClose =() => {
      this.setState({
        selectJobModal: false
      })
    }
 
 	
  // 渲染选择组织弹窗树结构 
 
  renderTree3 = (data)=> {
    return  data.map(item => {
      if (item.nodes) {
          return (
            <TreeNode   title={<span onClick = {this.getuuid2.bind(this,item)}>
              {item.cnname}
              <Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                  <i style={{marginLeft:'16px'}}><Iconfont type="icon-icon02"/></i>
              </Dropdown> 
              </span>} key={item.orgcode} 
            >
              { this.renderTree3(item.nodes) }
 
            </TreeNode>
          ) 
        } 
      })
    }
    
    // 选择组织弹窗显示事件
    selectOrgShow = () => {
      this.setState({
        selectOrgModal: true,
        //checkOrguuidList:[this.state.orguuid]
      })
    }
     // 选择组织弹窗关闭事件dsadkkkkkk
      selectOrgClose = () => {
        this.setState({
          selectOrgModal: false,
          findByOrgNameValue:''
        })
      }
    setClassName = (record) => {
      return ( record.adminflag  === '1' ? 'hiddenRow' : 'showRow')
    }

    //点击table姓名
    showPersonnelModal (personuuid){
         request(api_person_Info + `&personuuid=${personuuid}`)
         .then(res => {
              if(res.data){
                  this.setState({
                     personnelModal:true,
                     personalCode:res.data.personCode,
                     personalName:res.data.personalName,
                     phoneNumber:res.data.officetel,
                     personalEmail:res.data.Email,
                     weChatNumber:res.data.wechat,
                     QQNumber:res.data.msnQQ,
                     statusValue:parseInt(res.data.accountStatu,10),
                     sixValue:parseInt(res.data.sex,10),
                     personalDescription:res.data.otherinfo,
                     isShowAuthorize:true,
                     personuuid:personuuid,
                     fullName:res.data.fullName
                  })   
              } 
         })
    }
    //点击table所属部门
    showOrganizationModal (orguuid){
      request(api_get_orgInfo + `&orguuid=${orguuid}`)
      .then(res => {
           if(res.data){
               this.setState({
                   parentCnName:res.data.parentCnName,
                   person:res.data.orgLeader,
                   orgCode:res.data.orgCode,
                   organizationName:res.data.cnName,
                   described:res.data.datadescription,
                   organizationModal:true
               })   
           } 
      })    
    }
   //删除人员
   delPerson(orguuid,personuuid){
       request(api_del_person + `&orguuid=${orguuid}&personuuid=${personuuid}`)
       .then(res => {
            request(api_person_list).then(res => {
              if(res.data){
                let personList =res.data.rows;
                personList.forEach((item,index) => {
                    item.key = index  
                })
                this.setState({
                    personList:personList
                })
              }
            })
       })
   }
   //点击table岗位
   showPostModal(jobsuuid){
       request(api_get_jobsInfo +`&jobsuuid=${jobsuuid}`)
       .then(res => {
            if(res.data){
              this.setState({
                postModal:true,
                cnname:res.data.cnName,
                jobName:res.data.jobsName,
                jobDescription:res.data.description,
                checkOrguuidList:[res.data.orguuid]
              })
            }
       })
   }
      
   //主页 组织编码change事件
   initialChangeCode = (e) => {
      this.setState({
        initialCode:e.target.value
      })
   }
   //主页 组织名称change事件
   initialChangeName = (e) => {
      this.setState({
        initialName:e.target.value
      })
    }
   //主页 负责人change事件
   initialChangeLeader = (e) => {
    this.setState({
      initialLeader:e.target.value
    })
   }
   //主页 描述change事件
   initialChangeDescription = (e) => {
        this.setState({
          initialDescription:e.target.value
        })
   }
   //重置密码
   resetPassword = () => {
       let {personuuid,fullName} = this.state;
       Confirm({
        title: '是否重置密码?',
        okText: '重置密码',
        cancelText: '取消',
        onOk() {
            request(api_reset_pass + `&personuuid=${personuuid}&fullName=${fullName}`)
            .then(res => {
                  
            })
        },
        onCancel() {}
      })
   }
   //选择负责人
   handleChange = (value) => {
        this.setState({
          person:value
        })
   }


  //  选择岗位弹窗关闭
  selectJobClose =(e) => {
    this.setState({
      selectJobModal: false,
      findByJobNameValue:''
    })
  }
  //选择组织弹窗勾选
  checkOrgan = (checkedKeys,e) => {
      if(checkedKeys.length === 0 ) return  
      let checkOrguuidList = e.checkedNodes.map(item => item.key)     
      let cnname = e.checkedNodes.map(item => item.ref) 
      this.setState({
          cnname:cnname.join('--'),
          checkOrguuidList:checkOrguuidList
      })    
  }
  //选择岗位弹窗勾选
  checkJob = (checkedKeys,e) => {
      if(checkedKeys.length === 0 ) return  
      let checkJobsuuidList = e.checkedNodes.map(item => item.key)     
      let selectedJobName = e.checkedNodes.map(item => item.ref) 
      this.setState({ 
          selectedJobName:selectedJobName.join('--'),
          checkJobsuuidList:checkJobsuuidList.join(',')
      })   
  }
  //选择组织弹窗搜索
  findByOrgName = (value) => {
     request(api_find_orgname + `&orgName=${value}`)
     .then(res => {
         this.setState({
             checkOrguuidList:[res.data.orguuid]
         })
     })
  }
  //选择组织弹窗树结构展开事件
  expandOrgu = (expandedKeys) => {
    this.setState({
      checkOrguuidList:expandedKeys
    })
  }
  //选择组织弹窗输入框change事件
  findByOrgNameChange = (e) => {
    this.setState({
      findByOrgNameValue:e.target.value   
    })    
  }
  //选择岗位弹窗搜索
  findByJobName = (value) => {
    request(api_find_byJobName,{
       method:'POST',
       headers: {
        "Content-Type": "application/x-www-form-urlencoded"
       },
       body:`jobName=${value}&orguuids=${this.state.checkOrguuidList.join(',')}`
    }).then(res => {
         if(res.data.rows.length ===  0){
             message.error('没有找到对应的岗位！')
         }else{
            this.setState({
                checkOrguuidList:res.data.rows.map(item => {return item.orguuid})
            })
         }
    })
  }
  //选择岗位弹窗输入框change事件
  findByJobNameChange = (e) => {
    this.setState({
      findByJobNameValue:e.target.value   
    }) 
  }
  //岗位详情弹窗关闭事件
  postModalCancel = () => {
    this.setState({
       postModal:false,
       jobName:'',
       jobDescription:''
    }) 
  }
  //右侧拖拽区
  organizationalRightDrop = (dropResult) => {
         this.setState({
              testlist:applyDrag(this.state.testlist, dropResult)
         });
  }
  //更新主页面组织信息
  updateOrginfo = () =>{
       const params = {
            orguuid:'',
            parentorguuid:'',
            cnname:'',
            selectLeaderUuid:'',
            selectLeaderName:''
       }
       request(api_update_orginfo,{
           method:'POST',
           headers:{
             "Content-Type": "application/x-www-form-urlencoded"
           },
           body:objectToURL(params)
       }).then(res => {
             
       })
  }
 
  // 双击实现组织重命名

  orgDblClick = (item) => {
    this.setState({
      orguuid: item.orguuid,
      renameModal: true,
      reNameValue: item.cnname
    })
    
  }




    render(){
        let {organizationModal,renameModal,postModal,personnelModal,reNameValue,organizationName,
            person,described,jobDescription,jobName,personalCode,personalName,
            personalEmail,phoneNumber,QQNumber,weChatNumber,personalDescription,treeData,canUse1,canUse2,canUse3
            ,authorize,authorizeList,authorizeKey,chooseOrganization,menu,roleTableList,
            personList,checkedRole,parentCnName,organizationCode,cnname,selectedJobName,selectJobModal,
            selectOrgModal,isShowAuthorize,initialCode,initialName,initialLeader,initialDescription,
            initialParentCnName,leaderList,checkOrguuidList,findByOrgNameValue,findByJobNameValue
          } = this.state;
        const list = authorizeList.map((item,index) => {
              return <li key = {index} onClick={this.changeAuthorize.bind(this,index)}
                     style={authorizeKey === index ? {color:'#5a8bff'}:{color:'#000'}}
                     >{item}</li>
        })
        const treeFunction = (data,isbelong) => {
          let nodes,jobs;
          if(data.nodes) {
           nodes =  data.nodes.map((item) => {
                 return item.nodes || item.jobs ? <TreeNode  
                       title={
                        <span onClick = {this.getuuid2.bind(this,item)}>
                        <span onClick ={this.getUuid.bind(this,item)} onDoubleClick = {this.orgDblClick.bind(this,item)} > {item.cnname}</span> 
                        {isbelong === '1' ?<Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                        <i style={{marginLeft:'16px'}}><Iconfont type="icon-icon02"/></i>
                       </Dropdown>:null} 
                        </span>}  key={item.orguuid} ref={item.cnname}>
                            {item.nodes ? treeFunction(item,isbelong === '1'?'1':'0').nodes :null}
                            {item.jobs ?treeFunction(item,isbelong === '1'?'1':'0').jobs:null}
                        </TreeNode>:
                        <TreeNode  key = {item.orguuid} 
                        title={
                          <span onClick = {this.getuuid2.bind(this,item)}>
                          <span onDoubleClick = {this.orgDblClick.bind(this,item)} onClick ={this.getUuid.bind(this,item)}  > {item.cnname}</span> 
                          {
                          isbelong === '1' ? <Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                          <i style={{marginLeft:'16px'}}><Iconfont type="icon-icon02"/></i>
                          </Dropdown> : null
                          }
                          </span>} 
                        ref={item.cnname}
                        >
                        </TreeNode>
            }) 
          }
          if(data.jobs){
           jobs = data.jobs.map((item,index) => {
                 return <TreeNode  title={<span onClick = {this.getuuid2.bind(this,item)}>
                        <span onClick ={this.getUuid.bind(this,item)}> {item.jobsName}</span> 
                        {
                        isbelong === '1' ? <Dropdown overlay={this.jobsMenuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                        <i style={{marginLeft:'16px'}}><Icon style={{marginLeft:'16px'}} type="edit"  /></i>
                        </Dropdown> : null}
                         </span>} key={item.jobsuuid}>
                        </TreeNode>
            }) 
          }
          return Object.assign({},{nodes:nodes},{jobs:jobs})
        }
        const modalTreeFunction = (data,flag) => {
          let nodes,jobs;
          if(data.nodes) {
           nodes =  data.nodes.map((item) => {
                 return <TreeNode  title={<span> {item.cnname}</span>}
                        key={item.orguuid} ref={item.cnname}>
                            { flag && item.nodes ? modalTreeFunction(item).nodes :null}
                            { !flag && item.jobs ?modalTreeFunction(item).jobs:null}
                        </TreeNode>
            }) 
          }
          if(data.jobs){
           jobs = data.jobs.map((item,index) => {
                 return <TreeNode  title={<span ref={item.jobsName}> {item.jobsName}</span>} 
                        key={item.jobsuuid} ref={item.jobsName}>
                        </TreeNode>
            }) 
          }
          return Object.assign({},{nodes:nodes},{jobs:jobs})
        }
        const columns = [{
            title: '人员编号',
            dataIndex: 'personCode',
            width: '20%'
          }, {
            title: '姓名',
            width: '20%',
            render: text => <span style={{cursor:'pointer'}} onClick={this.showPersonnelModal.bind(this,text.personuuid)}>{text.fullName}</span>
          }, {
            title: '所属部门',
            width: '20%',
            render: text => <span style={{cursor:'pointer'}} onClick={this.showOrganizationModal.bind(this,text.orguuid)}>{text.cnName}</span>
          }, { 
            title: '岗位',
            dataIndex: 'jobs',
            width: '20%',
            render: text =>{
              if(text){
                return text.map((item,index) => {
                     return <span key={index}><span style={{cursor:'pointer'}}
                            onClick = {this.showPostModal.bind(this,item.jobsuuid)} 
                           >{item.jobsName}</span>
                            <span style={index === text.length -1 ?{visibility:'hidden'}:{visibility:'visible'}}>--</span></span>
                 })
              }else{
                 return <span>暂无所属部门</span>
              }
            }
          },
            {
            title: '操作',
            width: '20%',
            render: text =><span style={{cursor:'pointer'}}>
            <span onClick={this.delPerson.bind(this,text.orguuid,text.personuuid)} style={{marginRight:'10px'}}>删除</span>
            <span onClick={this.showAuthorize.bind(this,text.personuuid,text.fullName)}>授权</span>
            </span>
            }
        ];
        //授权表格
        const authorizeColumns = [{
          title: '角色名称',
          dataIndex: 'cnname', 
          render: text => <span>{text}</span>
        }, {
          title: '权限描述',
          dataIndex: 'rolecode',
          render: text => <span>{text}</span>
        }];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({
                 checkedRole:selectedRowKeys
              })
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
            selectedRowKeys:checkedRole
        };
        //部门人员
        const personRowSelection ={
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          })
        }; 
        return(
            <div className="organizational">
              <Container groupName="1" onDrop={this.organizationalRightDrop} 
              orientation='horizontal' style={{width:'100%',display:'flex'}}>
              { this.state.testlist[0] ? <Draggable style={{width:'24%'}}>
              <div className="organizational-right">
                <p className="organizational-left-title">部门人员</p>
                <div style={{margin:'0 auto'}}>
                <Tree
                  draggable
                  onDragEnter={this.onDragEnter}
                  onDrop={this.onDrop}
                  >  
                      {
                       treeData !== '' ? treeData.map(item => {
                        return <TreeNode title={<span onClick = {this.getuuid2.bind(this,item)}>
                        {item.cnname}
                        { 
                         item.isbelong === '1' ?<Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                           <i style={{marginLeft:'16px'}}><Iconfont  type="icon-icon02"/></i>
                        </Dropdown>:null
                        }
                       </span>}>
                            {treeFunction(item,item.isbelong).nodes}
                            {treeFunction(item,item.isbelong).jobs}
                        </TreeNode> 
                       }):<TreeNode></TreeNode>
                    }
                </Tree>
                </div>
              </div>
              </Draggable>:null
              }
              <div className="organizational-left">
                   <p className="organizational-left-title">组织详情</p>
                   <div style={{background:'#fff',paddingTop:'30px'}}>   
                   <div className="organizational-left-content">
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>上级组织</span>
                          <span>{initialParentCnName}</span> 
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>组织编码</span>
                          <Input value={initialCode} onChange={this.initialChangeCode}/>
                       </div>  
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>组织名称</span>
                          <Input value={initialName} onChange={this.initialChangeName}/> 
                       </div> 
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>负责人</span>
                          {/* <Input value={initialLeader} onChange={this.initialChangeLeader}/> */}
                          <Select
                            showSearch
                            style={{ width: '260px' }}
                            allowClear
                            placeholder='输入50字符以内'
                            onChange={this.handleChange}
                          >
                            {
                               leaderList.map(item => {
                                    return <Option key={item.fullName}>{item.fullName}</Option>
                               })
                            }
                          </Select>
                       </div>
                       <div className="organizational-left-item">
                          <span></span> 
                          <span style={{height:'52px'}}>描述</span>
                          <TextArea value={initialDescription} onChange={this.initialChangeDescription}/>
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span></span>
                          <Button  type="primary" style={{marginBottom:'30px',width:'100px'}}
                          onClick = {this.updateOrginfo}
                          >保存</Button>   
                       </div>    
                   </div>
                   </div>
                   <p className="organizational-left-title">部门人员</p>
                   <div className="organizational-left-table">
                        <div className="organizational-table-search">
                            <Input/>
                            <span>搜索</span>
                        </div>
                        <Table rowSelection={personRowSelection}
                        columns={columns}
                        Column={{align:'center'}}
                        dataSource={personList}
                        bordered
                        pagination={{
                            hideOnSinglePage:true
                        }}
                        />
                   </div>    
              </div>
              { this.state.testlist[1] ? <Draggable style={{width:'24%'}}>
              <div className="organizational-right">
                <p className="organizational-left-title">部门人员</p>
                <div style={{margin:'0 auto'}}>
                <Tree
                  draggable
                  onDragEnter={this.onDragEnter}
                  onDrop={this.onDrop}
                  >  
                    {
                       treeData !== '' ? treeData.map(item => {
                        return <TreeNode title={<span onClick = {this.getuuid2.bind(this,item)}>
                        {item.cnname}
                        { 
                         item.isbelong === '1' ?<Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                           <i style={{marginLeft:'16px'}}><Iconfont  type="icon-icon02"/></i>
                        </Dropdown>:null
                        }
                       </span>}>
                            {treeFunction(item,item.isbelong).nodes}
                            {treeFunction(item,item.isbelong).jobs}
                        </TreeNode> 
                       }):<TreeNode></TreeNode>
                    }
                </Tree>
                </div>
              </div>
              </Draggable>:null
              }
              </Container> 
              <Modal visible={organizationModal} footer={null}
              title='组织详情' width="50%" onCancel={this.cancel}>
                <div className="organization-modal">
                 <div className="organizational-left-content">
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>上级组织</span>
                          <span>{parentCnName}</span> 
                          <span>{cnname}</span> 
                          <span onClick ={this.selectOrgShow} style={{color:'blue',marginLeft: '2%',cursor: 'pointer'}}>选择</span>
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>组织编码</span>
                          <Input  maxLength ={'50'}  value ={organizationCode}  onChange ={this.organizationCodeChange}/>
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>组织名称</span>
                          <Input maxLength={'51'} value={organizationName} onChange={this.organizationNameChange} onBlur ={this.organizationNameBlur} />
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>负责人</span>
                          <Select
                            showSearch
                            style={{ width: '260px' }}
                            allowClear
                            placeholder='输入50字符以内'
                            onChange={this.handleChange}
                          >
                            {
                               leaderList.map(item => {
                                    return <Option key={item.fullName}>{item.fullName}</Option>
                               })
                            }
                          </Select>
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span style={{height:'52px'}}>描述</span>
                          <TextArea maxLength={'201'} value={described} onChange={this.describedChange}/> 
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span></span>
                          <Button disabled = {canUse1} type="primary" style={{marginBottom:'30px',width:'100px'}}
                          onClick={this.saveOrganization}
                          >保存</Button>   
                       </div>      
                   </div>
                 </div>
              </Modal>
              <Modal visible={postModal} footer={null} width='36%' 
              title='岗位详情' onCancel={this.postModalCancel}> 
                <div className="organization-modal">
                 <div className="organizational-left-content">
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>所属组织</span>
                          <span>{cnname}</span> 
                          <span onClick ={this.selectOrgShow} style={{color:'blue',marginLeft: '2%',cursor: 'pointer'}}>选择</span>
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>岗位名称</span>
                          <Input maxLength={'21'}  onChange = {this.inputJobName} onBlur = {this.inputJobNameBlur}  value = {jobName} /> 
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span style={{height:'52px'}}>描述</span>    
                          <TextArea maxLength={'201'} onChange = {this.jobDescriptionChange} value = {jobDescription}  /> 
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span></span>
                          <Button type="primary" disabled = {canUse2}  onClick = {this.saveJob} style={{marginBottom:'30px',width:'100px'}}>保存</Button>   
                       </div>      
                   </div>
                 </div>
              </Modal> 

              <Modal visible={personnelModal} footer={null} width='50%'
              title='人员详情' onCancel={this.cancel}> 
                <div className="organization-modal" style={{display:'flex'}}>
                 <div className="organizational-left-content" style={{width:'50%'}}>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>人员编码</span>
                          <Input maxLength = {'12'}  onBlur = {this.personalCodeBlur} onChange = {this.personalCodeInput} value = {personalCode} placeholder='人员编码请输入12位以内的数字和字母的组合'/>
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>姓名</span>
                          <Input maxLength={'51'}  onChange = {this.personalNameInput} value = {personalName} placeholder='姓名限制输入50位字符'/> 
                       </div>
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span style={{height:'52px'}}>所属组织</span>
                          <span>{cnname}</span> <span  onClick ={this.selectOrgShow} style ={{color:'blue',marginLeft: '2%',cursor: 'pointer'}}> 选择 </span>
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span>岗位</span>
                          <span>{selectedJobName}</span>
                          <span onClick ={this.selectJobShow} style={{color:'blue',marginLeft: '2%',cursor: 'pointer'}}>选择</span>
                       </div> 
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>手机</span>
                          <Input maxLength = {'11'}  onChange = {this.personalPhoneNumberInput} onBlur = {this.onPersonalPhoneNumberInput} value = {phoneNumber} placeholder='请输入手机号'/>
                       </div> 
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>邮件</span>
                          <Input placeholder='请输入邮件地址'  onChange = {this.personalEmailInput} onBlur = {this.onPersonalEmailInput}  value = {personalEmail} />
                       </div>    
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>微信</span>
                          <Input  maxLength = {'51'} onChange = {this.personalWeChatInput} value = {weChatNumber} placeholder='请输入微信号'/>
                       </div>  
                       <div className="organizational-left-item">
                          <span>*</span>
                          <span>QQ</span>
                          <Input  maxLength = {'51'}   onChange = {this.personalQQInput} value = {QQNumber} placeholder='请输入QQ号'/>
                       </div>     
                       <div className="organizational-left-item">
                          <span></span>
                          <span>状态</span>
                          <RadioGroup onChange={this.onstatusChange} value={this.state.statusValue}>
                            <Radio value={0}>启用</Radio>
                            <Radio value={1}>停用</Radio>
                          </RadioGroup>
                       </div>
                       <div className="organizational-left-item">
                          <span></span>
                          <span>性别</span>
                          <RadioGroup onChange={this.onsixChange} value={this.state.sixValue}>
                            <Radio value={1}>男</Radio>
                            <Radio value={2}>女</Radio>
                          </RadioGroup>
                       </div>  
                       <div className="organizational-left-item">
                          <span></span>
                          <span>描述</span>
                          <TextArea maxLength={'201'} onChange = {this.personalDescriptionInput} value = {personalDescription}  />
                       </div> 
                       <div className="organizational-left-item">
                          <span></span>
                          <span></span>
                          <Button type="primary" disabled ={canUse3}  onClick = {this.personalInformationSave} style={{marginBottom:'30px',width:'100px'}}>保存</Button>
                       </div>   
                   </div> 
                   <div className='organizational-float' style={isShowAuthorize ? {display:'block',cursor:'pointer'}:{display:'none'}}>
                        <p onClick={this.resetPassword}>重置密码</p>
                        <p onClick={this.showAuthorize.bind(this,this.state.personuuid,this.state.fullName)}>角色授权</p>
                   </div>
                 </div>
              </Modal>  
              <Modal title='重命名'  visible={renameModal} footer={null} onCancel={this.cancel}>
                  <div className="organization-modal" style={{width:'50%',margin:'0 auto'}}>
                      <Input autoFocus maxLength={'51'} onChange={this.reNameChange} value={reNameValue}/> 
                      <div className="button-cell">
                         <div  onClick={this.reName}>确定</div>
                         <div onClick={this.cancelName}>取消</div>
                      </div>
                  </div> 
              </Modal>

              <Modal title='角色授权'  visible={authorize} footer={null} onCancel={this.cancel} width='50%'>
                  <div className="organization-modal">
                    <ul className="authorize-list">
                      {/* {list} */}
                    </ul>
                    <Table rowSelection={rowSelection}
                        columns={authorizeColumns}
                        dataSource={roleTableList}
                        bordered
                        pagination={{
                            hideOnSinglePage:true
                        }}
                        rowClassName={this.setClassName}
                    />
                    <Button type='primary' style={{margin:'20px auto',display:'block',width:'100px'}}
                    onClick={this.confimAuthorize}>确认</Button>
                  </div> 
              </Modal>
              <Modal title='选择组织'  visible={chooseOrganization} footer={null} onCancel={this.cancel} width='50%'>
                  <div className="organization-modal">
                  <Search
                  placeholder="输入公司名称、部门名称或用户名称"
                  onSearch={this.searchOrganization}
                  style={{ width: 200 }}
                  />
                  <div style={{margin:'20px auto',width:'50%'}}>
                  <Tree checkable>
                    <TreeNode title={<span> 第一层
                        <Dropdown overlay={menu} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                           <i style={{marginLeft:'16px'}}><Iconfont type="icon-icon02"/></i>
                        </Dropdown>
                    </span>}
                     key="0-0">
                    <TreeNode title="parent 1-0" key="0-0-0">
                        <TreeNode title="leaf" key="0-0-0-0" />
                        <TreeNode title="leaf" key="0-0-0-1" />
                        <TreeNode title="leaf" key="0-0-0-2" />
                    </TreeNode>
                    <TreeNode title="parent 1-1" key="0-0-1">
                        <TreeNode title="leaf" key="0-0-1-0" />
                    </TreeNode>
                    <TreeNode title="parent 1-2" key="0-0-2">
                        <TreeNode title="leaf" key="0-0-2-0"/>
                        <TreeNode title="leaf" key="0-0-2-1" />
                    </TreeNode>
                    </TreeNode>
                  </Tree>
                  <Button type='primary' onClick={this.confimChoose}>确认</Button>
                  </div>
                  </div> 
              </Modal>         
              <Modal width ="50%" footer={null} visible={selectJobModal} onCancel ={this.selectJobClose}>
                  <div className="selectJob-modal"  >
                      <div>
                        <p className ="top"><span>选择岗位</span>   
                        <Search placeholder="输入组织或岗位名称" 
                         style={{ width: 200,marginLeft: '67%'}}
                         onSearch = {this.findByJobName}
                         value={findByJobNameValue}
                         onChange={this.findByJobNameChange}
                        />  
                        </p>
                      </div>
                      <div>
                        <div className ="treeParent" style={{textAlign: 'center',minHeight: '500px',paddingTop:'30px'}}>
                        <Tree
                            checkable
                            draggable
                            checkStrictly
                            onCheck={this.checkJob}
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            expandedKeys={checkOrguuidList}
                            onExpand = {this.expandOrgu}
                            >  
                              {
                                treeData !== '' ? treeData.map(item => {
                                return <TreeNode title={<span onClick = {this.getuuid2.bind(this,item)}>
                                {item.cnname}
                                { 
                                item.isbelong === '1' ? <Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                                  <i style={{marginLeft:'16px'}}><Iconfont  type="icon-icon02"/></i>
                                </Dropdown>:null
                                }
                              </span>}>
                                  {modalTreeFunction(item,false).nodes}
                                  {modalTreeFunction(item,false).jobs}
                                </TreeNode> 
                              }):<TreeNode></TreeNode>
                              }
                          </Tree>
                          </div> 
                          <div className='selectJobConfirm' >
                            <Button onClick ={this.selectJobClose}  style = {{backgroundColor: 'rgb(28,150,212)', color: '#fff',width:"80px",height: "35px"}}>
                                确定
                            </Button>
                          </div>
                      </div>
                  </div> 
              </Modal>
              <Modal zIndex = {1001} width ="50%" footer={null}  visible={selectOrgModal} onCancel ={this.selectOrgClose}>
                  <div className="selectJob-modal selectOrg-modal"  >
                      <div>
                        <p className ="top"><span>选择组织</span> 
                        <Search placeholder="输入公司名称,部门名称或用户姓名" 
                         style={{ width: 200,marginLeft: '67%'}} 
                         onSearch = {this.findByOrgName}
                         value={findByOrgNameValue}
                         onChange={this.findByOrgNameChange}
                         />  
                        </p>
                      </div>
                      <div>
                        <div className ="treeParent" style={{textAlign: 'center',minHeight: '500px',paddingTop:'30px'}}>
                          <Tree
                            checkable
                            draggable
                            checkStrictly
                            onCheck={this.checkOrgan}
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            expandedKeys={checkOrguuidList}
                            onExpand = {this.expandOrgu}
                            > 
                              {
                                treeData !== '' ? treeData.map(item => {
                                return <TreeNode title={<span onClick = {this.getuuid2.bind(this,item)}>
                                {item.cnname}
                                { 
                                item.isbelong === '1' ?<Dropdown overlay={this.menuList()} trigger={['click']} getPopupContainer={() => document.querySelector('.organizational-right')}>
                                  <i style={{marginLeft:'16px'}}><Iconfont  type="icon-icon02"/></i>
                                </Dropdown>:null
                                }
                              </span>}>
                                  {modalTreeFunction(item,true).nodes}
                                </TreeNode> 
                              }):<TreeNode></TreeNode>
                              }
                          </Tree>
                        </div>
                        <div className='selectJobConfirm'  >
                          <Button onClick ={this.selectOrgClose}  style = {{backgroundColor: 'rgb(28,150,212)', color: '#fff',width:"80px",height: "35px"}}>
                            确定
                          </Button>
                        </div>
                      </div>
                  </div> 
              </Modal> 
              <Modal title='重命名'  visible={renameModal} footer={null} onCancel={this.cancel}>
                  <div className="organization-modal" style={{width:'50%',margin:'0 auto'}}>
                      <Input autoFocus maxLength={'51'} onChange={this.reNameChange} value={reNameValue}/> 
                      <div className="button-cell">
                         <div  onClick={this.reName}>确定</div>
                         <div onClick={this.cancelName}>取消</div>
                      </div>
                  </div> 
              </Modal>
          </div>
        )
      }
}
export default Organizational;