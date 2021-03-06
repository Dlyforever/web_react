import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Icon, Tooltip, Pagination, Input, Menu, Dropdown, Modal, Form, message, Select } from 'antd';
import request from '../../utils/request';
import {history} from '../../utils/history';
import {
    api_add_material_opinion,
    api_delete_material_opinion,
    api_edit_material_opinion,
    api_del_doc_from_cat,
    api_put_into_report,
    api_add_doc_from_top,
    api_material_opinion_list,
    api_res_fav_cat,
    api_push_material
} from '../../services/api';
import { opinionTrend, opinionColor } from '../../utils/format';
import AllOpinion from '../AllOpinionDetail/AllOpinionDetail'
import Briefing from '../../components/Briefing/Briefing'
import TopicEditOpinionDetail from '../SystemSetting/TopicEditOpinionDetail/TopicEditOpinionDetail'
import {
    opinionSearchRequested,
    getMaterialOpinionListRequested,
    getMaterialOpinionDetailRequested,
    getReportListRequested,
    searchKeywordSync,
    paginationPage,
    getCollectionOpinionListRequested,
    briefingSwitch    
} from '../../redux/actions/createActions';
import weixin from '../../assets/icon-img/weixin.png';
import news from '../../assets/icon-img/news.png';
import weibo from '../../assets/icon-img/weibo.png';
import talk from '../../assets/icon-img/talk.png';
import video from '../../assets/icon-img/video.png';
import all from '../../assets/icon-img/other.png';
import media from '../../assets/icon-img/new.png';
import boke from '../../assets/icon-img/boke.png';
import app from '../../assets/icon-img/app.png';
import twitter from '../../assets/icon-img/twitter.png';
import './MaterialOpinion.less';
import BlankPage from '../../base/Exception/BlankPage';
import { GRAY } from '../../utils/colors';
import Iconfont from '../../components/IconFont'
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const InputGroup = Input.Group;
 
class MaterialOpinion extends React.Component {
    constructor() {
        super();
        this.state = {
            current: 1,
            currentPage: 1,
            pageSize: 20,   
            removeModalVisible: false,
            outputModalVisible: false,
            addMaterialVisible: false,
            materialCurrent: 0,
            materialListItemId: 0,
            renameMaterialVisible: false,
            materialName: '',
            checked: false,
            checkedAll: false,
            checkedLength: 0,
            arr: new Array(30).fill(false),
            MaterialValue: '',
            browserHeight: 300,
            addModalVisible: false,
            opinionVisible: false,
            topId: null,
            materialList: [],
            carryAll: {
        '新闻': news,
        '微博': weibo,
        '论坛': talk,
        '视频': video,
        '综合': all,
        '微信': weixin,
        '平媒': media,
        '博客': boke,
        'APP': app,
        'pjljkm': twitter
            },
            seltype: 'content',
            searchInputValue: '',
            visibleFile: false,
            checkedArray: new Array(40).fill(false),
            type: 0,
            array: [],
            indeterminate: true,
            brieVisible: false,
            isSearch:false
        };
    }
 
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps);
    //     if (nextProps.docList === []) {
    //         message.warning("没有选择分类");
    //     }
    // }
    // 拖拽
    handleSort(data) {
        this.setState({
            result: data.join(' ')
        });
    }
    // 点击标题跳转
    clickItemTitle(sid) {
        window.open(window.location.origin + window.location.pathname + '#/detail/' + sid);
    }
 
    // -----------新增素材库
    showAddMaterial() {
        this.setState({
            addMaterialVisible: true
        })
    }
    handleAddMaterialOk() {
        this.handleAddMaterialSubmit();
    }
    handleAddMaterialCancel() {
        this.setState({
            addMaterialVisible: false
        })
    }
    handleAddMaterialSubmit() {
        const _that = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.MaterialValue.length >= 14) {
                    message.error('素材夹名称请不要超过14个字符');
                    return;
                }
                request(api_add_material_opinion + '&catname=' + values.materialName, {}).then(res => {
                    if (res.data.code === 1) {
                        message.success(res.data.msg);
                        request(api_material_opinion_list)
                            .then(datas => {
                                if (datas.data) {
                                    _that.setState({
                                        materialList: datas.data.reportCatList
                                    })
                                }
                            })
                    } else if (res.data.code === 2) {
                        message.warning(res.data.msg);
                    } else {
                        message.error(res.data.msg);
                    }
                    this.setState({
                        addMaterialVisible: false
                    });
                    // this.props.getMaterialOpinionListRequested();
                });
            }
        });
    }
 
 
    // --------------在素材库内搜索
    handleSearchBtn(keyword) {
        this.setState({
            searchInputValue: keyword,
            isSearch:true,
            currentPage:1,
            pageSize:20
        })
        if (keyword !== '') {
            this.props.getMaterialOpinionDetailRequested(`pagesize=${this.state.pageSize}&q=${keyword}`);
        }else{
            this.props.getMaterialOpinionDetailRequested(`catid=${this.state.current}`);
        }
    }
 
 
    // 单项加入简报
    handleAddReportMenu(e) {
        const sid = this.state.materialSid;
        const reportId = e.key;
        request(api_put_into_report + '&reportid=' + reportId + '&sid=["' + sid + '"]', {}).then((res) => {
            if (res.data.code === 1) {
                message.success(res.data.msg);
            }
        });
    }
    // 删除单项
    deleteThisFormMaterial(itemId) {
        const getDetail = this.props.getMaterialOpinionDetailRequested;
        const {isSearch} = this.state;
        const _this = this;
        confirm({
            title: '确定将这条舆情移出素材库?',
            content: '移出素材库',
            onOk() {
                request(api_del_doc_from_cat + '&id=[' + itemId + ']', {}).then((res) => {
                    if (res.data.code === 1) {
                        message.success(res.data.msg);
                        let str = isSearch?`page=${_this.state.currentPage}&pagesize=${_this.state.pageSize}&q=${_this.state.searchInputValue}`:`catid=${_this.state.current}&page=${_this.state.currentPage}&pagesize=${_this.state.pageSize}`
                        getDetail(str);
                        _this.setState({
                            arr:new Array(_this.state.pageSize).fill(false)
                        })
                    }
                });
            },
            onCancel() {
                console.log('取消');
            },
        });
    }
 
    checkedIdTrue() {
        const arr = [];
        this.props.datelist.map(item => 
            item.datelist.map(items => 
                items.doclist.forEach((i, index) => {
                    if (this.state.array[i.sid] === true && i.id) {
                        arr.push(i.id);
                    }
                })
            )
        )
        return arr;
    }
    // -----------------移除多项
    checkedTrue() {
        const arr = [];
        this.props.datelist.map(item => 
            item.datelist.map(items => 
                items.doclist.forEach((i, index) => {
                    if (this.state.array[i.sid] === true && i.sid) {
                        arr.push(i.sid);
                    }                
                })
            )
        )
        return arr;
    }
    showRemoveModal() {
        const arr = this.checkedTrue();
        const length = arr.length;
        this.setState({
            checkedLength: length,
            removeModalVisible: true
        })
    }
    showAddModal() {
        this.setState({
            addModalVisible: true,
            visibleFile: true
        })
    }
    handleRemoveOk() {
        const arr = this.checkedIdTrue();
        const size = arr.length;
        const getMaterialDetail = this.props.getMaterialOpinionDetailRequested;
        const {isSearch} = this.state;
        if (size === 0) {
            message.warning("至少选择一项！");
        } else {
            const sidList = JSON.stringify(arr);
            request(api_del_doc_from_cat + '&id=' + sidList, {}).then((res) => {
                if (res.data.code === 1) {
                    let str = isSearch?`page=${this.state.currentPage}&pagesize=${this.state.pageSize}&q=${this.state.searchInputValue}`:`catid=${this.state.current}&page=${this.state.currentPage}&pagesize=${this.state.pageSize}`
                    getMaterialDetail(str);
                    message.success(res.data.msg);
                    this.setState({
                        checkedAll: false,
                        arr: new Array(40).fill(false),
                        array:[]
                    });
                }
            });
        }
        this.setState({
            removeModalVisible: false
        })
    }
    handleRemoveCancel() {
        this.setState({
            removeModalVisible: false
        })
    }
 
    // -----------------多项加入简报
    handleAddMultipleReportMenu(e) {
        const arr = this.checkedTrue();
        const size = arr.length;
        const reportid = e.key;
        if (size === 0) {
            message.warning("至少选择一项！");
        } else {
            const sidList = JSON.stringify(arr);
            request(api_put_into_report + '&reportid=' + reportid + '&sid=' + sidList, {}).then((res) => {
                if (res.data.code === 1) {
                    message.success(res.data.msg);
                    this.setState({
                        checkedAll: false,
                        arr: new Array(40).fill(false)
                    });
                }
            });
        }
    }
 
 
    // ----------------多项加入收藏
 
 
 
    // 左侧素材库选项
    handleMeterialNavigation(itemId, index) {
        this.setState({
            current: itemId,
            materialCurrent: index,
            currentPage: 1
        });
        this.props.getMaterialOpinionDetailRequested(`catid=${itemId}`);
    }
 
    // 分页
    onPaginationChange(page) {
            if (page !== '') {
                this.props.getMaterialOpinionDetailRequested(`catid=${this.state.current}&page=${page}&pagesize=${this.state.pageSize}`);
                this.setState({
                    currentPage: page,
                    arr: new Array(40).fill(false),
                    checkedAll: false
                })
            }
        }
 
    // 每页显示数量
    // 每页显示数量
    onShowSizeChange(current, pageSize) {
        this.props.getMaterialOpinionDetailRequested(`catid=${this.state.current}&page=${this.state.currentPage}&pagesize=${pageSize}`);
        this.setState({ pageSize: pageSize })
    }
 
    componentWillMount() {
        request(api_material_opinion_list)
            .then(res => {
                if (res.data) {
                    this.setState({
                        materialList: res.data.reportCatList,
                        current: res.data.reportCatList[0]['id']
                    })
                    this.props.getMaterialOpinionDetailRequested(`catid=${res.data.reportCatList[0]['id']}`);
                 }
            })
        this.setState({
            browserHeight: window.innerHeight - 140
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.checkboxState !== undefined) {
            if (prevProps.checkboxState.num !== this.props.checkboxState.num) {
                this.setState({
                    arr: new Array(40).fill(false),
                    checkedAll: false
                })
            }
        }
    }
 
    // ---------单选与全选
    onChange(index, e) {
        const arr = this.state.array;
        arr[index] = e.target.checked;
        this.setState({
            array: arr,
            checkedAll: false
        });
        if (this.props.getSids !== undefined) {
            this.props.getSids(this.checkedTrue())
        }
    }
    onAllChange(e) {
        const arr = [];
        this.props.datelist.map(item => 
            item.datelist.map(items => 
                items.doclist.forEach((i, index) => {
                    return arr.push(i.sid);
                })
            )
        )
        arr.every((item, index) => 
        arr[item] = e.target.checked
        )
        this.setState({
            array: e.target.checked ? arr : [],
            checkedAll: e.target.checked
        });
    }
 
    // -------------列表项编辑和删除
    onClickMaterialListItem(id) {
        this.setState({
            materialListItemId: id,
            topId: id
        })
    }
    onClickMaterialListItemDelete({ key }) {
        if (key === 'delete') {
            this.deleteMaterial(this.state.materialListItemId);
        } else if (key === 'rename') {
            this.setState({ renameMaterialVisible: true })
        } else if (key === 'top') {
            this.onClickTopList(this.state.topId)
        }
    }
    deleteMaterial(id) {
        const _that = this;
        confirm({
            title: '您确定要删除本素材库吗?',
            content: '删除素材库，里面的舆情也会一并移除。',
            onOk() {
                request(api_delete_material_opinion + '&catid=' + id, {}).then(res => {
                    if (res.data.code === 1) {
                        message.success(res.data.msg);
                        request(api_material_opinion_list)
                            .then(datas => {
                                if (datas.data) {
                                    _that.setState({
                                        materialList: datas.data.reportCatList
                                    })
                                }
                            })
                    } else {
                        message.error(res.data.msg);
                    }
                });
            },
            onCancel() {
                message.info('您取消了删除操作。')
            },
        });
    }
    handleRenameMaterialOk() {
        if (this.state.materialName.length >= 15) {
            message.error('素材库名称请不要大于14个字符');
            return;    
        }
        const getMaterialOpinionListRequested = this.props.getMaterialOpinionListRequested;
        const id = this.state.materialListItemId;
        const name = this.state.materialName;
        request(api_edit_material_opinion + '&id=' + id + '&catname=' + name, {}).then(res => {
            if (res.data.code === 1) {
                message.success(res.data.msg);
                getMaterialOpinionListRequested();
                this.setState({
                    renameMaterialVisible: false,
 
                });
            } else {
                message.error(res.data.msg);
            }
        });
    }
    handleRenameMaterialCancel() {
        this.setState({ renameMaterialVisible: false })
    }
    onChangeMaterialName(e) {
        this.setState({ materialName: e.target.value });
    }
 
    getReportListRequested() {
        if(this.checkedTrue().length !== 0) {
            this.props.briefingSwitch(this.checkedTrue());
            history.push('/allopinion/choosetemplate?reportType=01')   
       }else{
            history.push('/allopinion/choosetemplate')   
       }
    }
 
    MaterialChange(e) {
        const { value } = e.target;
        this.setState({
            MaterialValue: value
        })
    }
 
     // 搜索内容
    handleSearchChange(value) {
    this.setState({
      seltype: value
        });
    }
 
    onPaginationChangeOpinion(pagenumber) {
    this.props.paginationPage(pagenumber);
    this.setState({
      page: pagenumber,
      checkedArray:this.state.checkedArray.fill(false)
    });
    const param = this.props.param;
    param.page = pagenumber;
    if (this.props.type === 1) {
      this.props.opinionSearchRequest({
        seltype: 'content', keyword: this.props.searchKeyword.keyword,
        page: pagenumber
      });
    } else if (this.props.searchKeyword.type === 1) {
      this.props.opinionSearchRequest({
        seltype: 'content', keyword: this.props.searchKeyword.keyword,
        page: pagenumber
      });
    }
    else if (this.props.propsType === 'AllopinionList') {
      this.props.opinionSearchRequest(param);
    } else {
      this.props.onDataChange(pagenumber);
    }
  }
 
    searchInput(e) {
    const {value} = e.target;
    if (value === '') {
      this.searchType(0);
      this.props.searchKeywordSync({
        seltype: this.state.seltype,
                keyword: '',
                type: 0
      });
    }
    this.setState({
      searchInputValue: value
    })
  }
    
    keyDown(e){
        if(e.keyCode === 13){
            this.setState({
                opinionVisible: true
            })
            const param = {
                seltype: this.state.seltype,
                keyword: this.state.searchInputValue,
                datetag:'all',
                neg:'all',
                order:'timedown',
                carry:'全部',
                page:1
            };
            this.props.opinionSearchRequest(param);
            this.props.searchKeywordSync({
                seltype: this.state.seltype,
                keyword: this.state.searchInputValue,
                type: 0
            });
          this.props.paginationPage(1);
          if (this.props.propsType === 'AllopinionList') {
              this.searchType(1);
            }
        }
 }
 
    onClickTopList(id) {
        request(api_add_doc_from_top + '&catid=' + id, {}).then((res) => {
            if (res.data.code === "2") {
                message.success(res.data.msg);
                request(api_material_opinion_list)
                .then(res => {
                    if (res.data) {
                        this.setState({
                            materialList: res.data.reportCatList
                        })
                        this.props.getMaterialOpinionDetailRequested(`catid=${id}`);
                    }
                })
            } else if (res.data.cade === "1") {
                message.error('置顶失败');
            }
        });
    }
    // 舆情录入弹框控制    
    handleAddOk() {
        this.setState({
            addModalVisible: false
        })
    }
    // 舆情录入弹框控制
    handleAddCancel = flag => {
        this.setState({
            addModalVisible: flag
        })
    };
  // 控制舆情监测弹框
    opinionHandleAddOk = () => {
        this.setState({
            opinionVisible: false
        })
    };
  // 控制舆情监测弹框
    opinionHandleAddCancel = () => {
        this.setState({
            opinionVisible: false
        })
    }
    //单条加入收藏
    collectionlConfirm(sid, e) {
        request(api_res_fav_cat + '&newcatid=' + e.key + '&id=["' + sid + '"]').then((res) => {
            if (res.data.code === "2") {
                message.success(res.data.msg);
            } else if (res.data.code === "1") {
                message.error(res.data.msg);            
            } else {
                message.warning(res.data.msg);                
            }
        });
    }
    // 推送到收藏夹
    putIntoCollection(e) {
        const collectionId = e.key;
        const array = this.checkedIdTrue();
        const size = array.length;
        if (size === 0) {
            message.warning("至少选择一项！");
        } else {
            const sidList = JSON.stringify(array);
            request(api_res_fav_cat + '&newcatid=' + collectionId + '&id=' + sidList, {}).then((res) => {
                if (res.data.code === "2") {
                    message.success(res.data.msg);
                    this.setState({
                        checkedAll: false,
                        checkedArray: new Array(40).fill(false),
                        array:[]
                    });
                } else if (res.data.code === "1") {
                    message.error(res.data.msg);    
                } else {
                    message.warning(res.data.msg);                
                }
            });
        }
    }
    searchType(data) {
    this.setState({
      type: data
    })
    }
    // 拖拽
    dragstart(sid, e) {
        e.dataTransfer.setData("sid", sid);
        if(this.checkedTrue().length === 0) {
            e.dataTransfer.setData('briefingsid', sid)
            e.dataTransfer.setData('a', 'drop')
          }else {
            e.dataTransfer.setData('briefingsid', this.checkedTrue())
            e.dataTransfer.setData('a', 'drop')
          }
    }
    dragenter(e) {
        e.preventDefault()
    }
    dragover(e) {
        e.preventDefault()
    }
 
    drop(materialId, e) {
        e.preventDefault()
        const sid = e.dataTransfer.getData("sid");
        const array = [];
        array.push(sid);
        const arrays = JSON.stringify(array);
        const arr = this.checkedTrue();
        const sidList = JSON.stringify(arr);
        if (arr.length > 1) {
            request(api_push_material + '&catid=' + materialId + '&sid=' + sidList, {}).then((res) => {
                if (res.data.code === 1) {
                    message.success(res.data.msg);
                } else {
                    message.warning(res.data.msg);
                }
            });
        } else if(array.length === 1) {
            request(api_push_material + '&catid=' + materialId + '&sid=' + arrays, {}).then((res) => {
                if (res.data.code === 1) {
                    message.success(res.data.msg);
                } else {
                    message.warning(res.data.msg);
                }
            });
        }
    }
    briefingCancel() {
        this.setState({
            brieVisible: false
        })
    }
    addbriefing() {
        this.setState({
            brieVisible: true
        })
    }
    render() {
        const { pageInfo, reportData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        // 单条舆情加入简报
        // const addReportMenu = (
        //     <Menu onClick={this.handleAddReportMenu.bind(this)}>
        //         {
        //             reportData ? reportData.map(item =>
        //                 <Menu.Item key={item.id}>{item.name}</Menu.Item>
        //             ) : <Menu.Item key="0">默认简报</Menu.Item>
        //         }
        //     </Menu>
        // );
 
        // 收藏夹的目录
        // const collectionMenu = (
        //     <Menu onClick={this.putIntoCollection.bind(this)}>
        //         {
        //             this.props.favCatList.map(item =>
        //                 <Menu.Item key={item.id}>
        //                     <Icon type="folder"/>
        //                     <span>{item.catname}</span>
        //                 </Menu.Item>
        //             )
        //         }
        //     </Menu>
        // );
 
 
        // 多项加入简报
        const addMultipleReportMenu = (
            <Menu onClick={this.handleAddMultipleReportMenu.bind(this)}>
                {
                    reportData ? reportData.map(item =>
                        <Menu.Item key={item.id}>{item.name}</Menu.Item>
                    ) : <Menu.Item key="0">默认简报</Menu.Item>
                }
            </Menu>
        );
        const datelist = this.props.datelist ? this.props.datelist : [{ carry: '新闻' ,datelist:[]}];
        const OpinionDetailItems = datelist.length !== 0 ? datelist.map((item, index) => 
            <div key={index}>
                <div className="item_file" style={{paddingLeft: 12, borderBottom: "1px solid #fff" }}>
                    <Iconfont type="icon-wenjianjia" style={{ width: 15, height: 15, marginRight: 30 }} />
                  {item.catname}
                </div>
              {
                    item.datelist.map((i, indexdate) => {
                        if (i.datetime !== "0000-00-00") {
                            return (
                                <div className="item_time" key={indexdate}>
                                    <span className="time_text">{i.datetime}</span>
                                    <ul className="opinion-detail-wrapper">
                                        {  
                                            i.doclist.map((items, indexDoc) => 
                                                <li key={items.sid}
                                                    className="opinion-detail-item"
                                                    ref="opinionItem"
                                                    onDragStart={this.dragstart.bind(this, items.sid)}
                                                    draggable="true"
                                                >
                                                    <Checkbox
                                                        checked={this.state.array[items.sid]}
                                                        onChange={this.onChange.bind(this, items.sid)}
                                                    />
                                                    <div className="item-top">
                                                        <div className="content">
                                                            <div className="negative">
                                                                <div className="inner-type" style={opinionColor(items.negative)}>
                                                                    {opinionTrend(items.negative)}
                                                                </div>
                                                            </div>
                                                            <div className="title" title={items.title} onClick={this.clickItemTitle.bind(this, items.sid)}>
                                                                {items.title !== undefined && items.title.length > 58 ? items.title.slice(0, 58) + '...' : items.title}
                                                            </div>
                                                        </div>
                                                        <div className="icon" style={{ cursor: "pointer", width: 38, height: 38, margin: "10px 15px" }}>
                                                            <img src={this.state.carryAll[items.carry]}
                                                                alt=""
                                                                className="carryImg"
                                                                style={{ cursor: "pointer", width: 38, height: 38, display: "block" }}
                                                                draggable="false"/>
                                                        </div>
                                                        <p className="docsummary" style={{ marginLeft: 67, marginTop: -50, height: 45, overflow: "hidden" }}>{items.docsummary}</p>                        
                                                        <div className="item-bottom">
                                                            <div className="time" style={{ color: "#ccc", marginLeft: 25 }}>
                                                                {items.pubdate}
                                                            </div>
                                                            <div className="resource">
                                                                <a href="" draggable="false">
                                                                    <span className="source">{items.source}</span>
                                                                </a>
                                                            </div>
                                                            <div className="keywords" style={{ paddingLeft: 25, color: "#ccc" }}>
                                                                关键词: <span className="source" style={{ color: "red" }}>{items.dockeywords}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-middle">
                                                        <div className="right">
                                                            <div className="base-operate">
                                                                <Tooltip title="从素材库移除">
                                                                    <i
                                                                        aria-hidden="true"
                                                                        onClick={this.deleteThisFormMaterial.bind(this, items.id)}
                                                                    >
                                                                        < Iconfont type="icon-shanchu1-copy-copy" style={{ width: 17, height: 17 }} />
                                                                    </i>
                                                                </Tooltip>
                                                                <Tooltip title='收藏'>
                                                                    <Dropdown
                                                                        overlay={
                                                                            <Menu onClick={this.collectionlConfirm.bind(this, items.id)}>
                                                                                {
                                                                                    this.props.favCatList.map(iq =>
                                                                                        <Menu.Item key={iq.id}>
                                                                                            <Icon type="folder"/>
                                                                                            <span>{iq.catname}</span>
                                                                                        </Menu.Item>
                                                                                    )
                                                                                }
                                                                            </Menu>
                                                                        }
                                                                        trigger={['click']}
                                                                        getPopupContainer={() => document.querySelector('.opinion-detail-item')}
                                                                    >
                                                                        <i
                                                                            aria-hidden="true"
                                                                            onClick={this.props.getCollectionOpinionListRequested.bind(this)}
                                                                        >
                                                                            < Iconfont type="icon-shoucang-copy" style={{ width: 17, height: 17, marginBottom: 2, marginLeft: 20 }} />
                                                                        </i>
                                                                    </Dropdown>
                                                                </Tooltip>
                                                                {/* <Tooltip title="加入简报">
                                                                    <i
                                                                        aria-hidden="true"
                                                                        onClick={this.addbriefing.bind(this)}
                                                                    >
                                                                        < Iconfont type="icon-qingbaogongzuojianbao" style={{ width: 20, height: 20, marginLeft: 20 }} />
                                                                    </i>
                                                                </Tooltip> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            )
                        } else {
                            return (
                                <div className="item_time" key={indexdate}>
                                    <ul className="opinion-detail-wrapper">
                                        {  
                                            i.doclist.map((items, indexDoc) => 
                                                <li key={items.sid} className="opinion-detail-item">
                                                    <Checkbox
                                                        checked={this.state.array[items.sid]}
                                                        onChange={this.onChange.bind(this, items.sid)}
                                                    />
                                                    <div className="item-top">
                                                        <div className="content">
                                                            <div className="negative">
                                                                <div className="inner-type" style={opinionColor(items.negative)}>
                                                                    {opinionTrend(items.negative)}
                                                                </div>
                                                            </div>
                                                            <div className="title" title={items.title} onClick={this.clickItemTitle.bind(this, items.sid)}>
                                                                {items.title !== undefined && items.title.length > 58 ? items.title.slice(0, 58) + '...' : items.title}
                                                            </div>
                                                        </div>
                                                        <div className="icon" style={{ cursor: "pointer", width: 38, height: 38, margin: "10px 15px" }}>
                                                            <img src={this.state.carryAll[items.carry]}
                                                                alt=""
                                                                className="carryImg"
                                                                style={{ cursor: "pointer", width: 38, height: 38, display: "block" }}/>
                                                        </div>
                                                        <p className="docsummary" style={{ marginLeft: 67, marginTop: -50, height: 45, overflow: "hidden" }}>{items.docsummary}</p>                        
                                                        <div className="item-bottom">
                                                            <div className="time" style={{ color: "#ccc", marginLeft: 25 }}>
                                                                {items.pubdate}
                                                            </div>
                                                            <div className="resource">
                                                                <a href="">
                                                                    <span className="source">{items.source}</span>
                                                                </a>
                                                            </div>
                                                            <div className="keywords" style={{ paddingLeft: 25, color: "#ccc" }}>
                                                                关键词: <span className="source" style={{ color: "red" }}>{items.dockeywords}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-middle">
                                                        <div className="right">
                                                            <div className="base-operate">
                                                                <Tooltip title="从素材库移除">
                                                                    <i
                                                                        aria-hidden="true"
                                                                        onClick={this.deleteThisFormMaterial.bind(this, items.id)}
                                                                    >
                                                                        < Iconfont type="icon-shanchu1-copy-copy" style={{ width: 17, height: 17 }} />
                                                                    </i>
                                                                </Tooltip>
                                                                <Tooltip title='收藏'>
                                                                    <Dropdown
                                                                        overlay={
                                                                            <Menu onClick={this.collectionlConfirm.bind(this, items. id)}>
                                                                                {
                                                                                    this.props.favCatList.map(iq =>
                                                                                        <Menu.Item key={iq.id}>
                                                                                            <Icon type="folder"/>
                                                                                            <span>{iq.catname}</span>
                                                                                        </Menu.Item>
                                                                                    )
                                                                                }
                                                                            </Menu>
                                                                        }
                                                                        trigger={['click']}
                                                                        getPopupContainer={() => document.querySelector('.opinion-detail-item')}
                                                                    >
                                                                        <i
                                                                            aria-hidden="true"
                                                                            onClick={this.props.getCollectionOpinionListRequested.bind(this)}
                                                                        >
                                                                            < Iconfont type="icon-shoucang-copy" style={{ width: 17, height: 17, marginBottom: 2, marginLeft: 20 }} />
                                                                        </i>
                                                                    </Dropdown>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    })
                }
            </div>                
        ) : <BlankPage desc='暂无信息，请在汇总舆情内加入相应信息' />;
 
        const materialSetMenu = (
            <Menu onClick={this.onClickMaterialListItemDelete.bind(this)}>
                <Menu.Item key="rename">
                    <span>重命名</span>
                </Menu.Item>
                <Menu.Item key="delete">
                    <span>删除</span>
                </Menu.Item>
                <Menu.Item key="top">
                    <span>置顶</span>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="materia-opinion-wrapper">
                <div className="materia-opinion">
                    <div className="opinion-list">
                        <div className="top" style={{ background: GRAY }}>
                            <div className="left">
                                <div className="choose-all">
                                    <Checkbox
                                        // indeterminate={this.state.indeterminate}
                                        checked={this.state.checkedAll}
                                        onChange={this.onAllChange.bind(this)}
                                        className="colors"
                                        style={{ fontSize: 16 }}
                                    >全选</Checkbox>
                                </div>
                                <div className="operate-all">
                                    <Tooltip title="从素材库移除">
                                        <i
                                            aria-hidden="true"
                                            onClick={this.showRemoveModal.bind(this)}
                                        >
                                            <Iconfont type="icon-shanchu1-copy-copy" style={{ width: 17, height: 17 }} />
                                        </i>
                                    </Tooltip>
                                    <Modal
                                        title="移出素材库"
                                        visible={this.state.removeModalVisible}
                                        onOk={this.handleRemoveOk.bind(this)}
                                        onCancel={this.handleRemoveCancel.bind(this)}
                                    >
                                        <div>确定将这 <b>{this.state.checkedLength}</b> 项从素材库移出吗？</div>
                                    </Modal>
                                </div>
                                <Tooltip title="生成报告">
                                <div className="operate-all" onClick={this.getReportListRequested.bind(this)}>
                                    <Dropdown overlay={addMultipleReportMenu} trigger={['click']}
                                        getPopupContainer={() => document.querySelector('.materia-opinion-wrapper')}
                                    >
                                        <Iconfont type="icon-shengchengbaogao1" style={{ width: 16, height: 16 }} />
                                    </Dropdown>
                                </div>
                                </Tooltip>
                                <div className="operate-all">
                                    <Tooltip title="舆情录入">
                                        <i
                                            aria-hidden="true"
                                            onClick={this.showAddModal.bind(this, true)}
                                        >
                                        <Iconfont type="icon-zongliangluru" style={{ width: 17, height: 17 }} />
                                        </i>
                                    </Tooltip>
                                    <Modal
                                        width={1100}
                                        footer={null}
                                        title="舆情录入"
                                        visible={this.state.addModalVisible}
                                        onOk={() => this.handleAddOk(false)}
                                        onCancel={() => this.handleAddCancel(false)}
                                    >
                                        <TopicEditOpinionDetail visible={this.state.visibleFile} file={this.state.materialList} handle={this.handleAddCancel}/>
                                    </Modal>
                                </div>
                                <div className="shoucang">
                                    <Tooltip title='收藏'>
                                        <Dropdown
                                            overlay={
                                                <Menu onClick={this.putIntoCollection.bind(this)}>
                                                    {
                                                        this.props.favCatList.map(i =>
                                                            <Menu.Item key={i.id}>
                                                                <Icon type="folder"/>
                                                                <span>{i.catname}</span>
                                                            </Menu.Item>
                                                        )
                                                    }
                                                </Menu>
                                            }
                                            trigger={['click']}
                                            getPopupContainer={() => document.querySelector('.materia-opinion-wrapper')}
                                        >
                                            <i
                                                aria-hidden="true"
                                                onClick={this.props.getCollectionOpinionListRequested.bind(this)}
                                            >
                                                < Iconfont type="icon-shoucang-copy" style={{ width: 17, height: 17, marginLeft: 20 }} />
                                            </i>
                                        </Dropdown>
                                    </Tooltip>
                                    {/* <Tooltip title="加入简报">
                                        <i
                                            aria-hidden="true"
                                            onClick={this.addbriefing.bind(this)}
                                        >
                                            <Iconfont type="icon-qingbaogongzuojianbao" style={{ width: 17, height: 17, marginLeft: 20 }} />
                                        </i>
                                    </Tooltip> */}
                                </div>
                            </div>
                            <div className="inputSearch">
                                <div className="right">
                                    <InputGroup compact>
                                        <Select defaultValue="content" onChange={this.handleSearchChange.bind(this)}>
                                            <Option value="content" className="selectFont">全站搜索</Option>
                                            <Option value="title" className="selectFont">素材库</Option>
                                        </Select>
                                            <div>
                                                {
                                                this.state.seltype === "content" ? (
                                                <Input
                                                    style={{width: '150px'}}
                                                    // placeholder="搜索标题，文章内容"
                                                    onChange={this.searchInput.bind(this)}
                                                    onKeyDown = {this.keyDown.bind(this)}
                                                />
                                                ) : (
                                                        <Search
                                                            style={{ width: '150px' }}
                                                            placeholder="搜索标题，文章内容"
                                                            onSearch={this.handleSearchBtn.bind(this)}
                                                        />
                                                  )
                                                }
                                            </div>
 
                                        <Modal
                                            width={1100}
                                            footer={null}
                                            title="舆情监测"
                                            visible={this.state.opinionVisible}
                                            onOk={this.opinionHandleAddOk.bind(this)}
                                            onCancel={this.opinionHandleAddCancel.bind(this)}
                                            className="report-modal"
                                        >
                                            <AllOpinion
                                             searchType={this.searchType.bind(this)}                                              
                                            />
                                        </Modal>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className="bottom" >
                            {this.props.datelist ? OpinionDetailItems : <div>暂无数据！</div>}
                        </div>
                        <div className="pagintion-wrapper">
                            <Pagination showSizeChanger
                                className="pagintion"
                                defaultCurrent={1}
                                defaultPageSize={20}
                                onChange={this.onPaginationChange.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                total={pageInfo === undefined ? 0 : pageInfo.rowcount}
                                current={this.state.currentPage}
                                getPopupContainer={() => document.querySelector('.materia-opinion-wrapper')}
                            />
                        </div>
                    </div>
                    <div className="left-boxes" style={this.props.getSids ? { left: '76%' } : { left: '85.6%' }}>
                        <div className="first-box">
                            <div className="top" style={{ background: GRAY }}>
                                <div className="sucai">
                                    <div style={{ textAlign: "left", color: "#000" }}>&nbsp;&nbsp;素材文件夹</div>
                                    <div onClick={this.showAddMaterial.bind(this)} style={{ marginTop: -40, textAlign: "right", marginRight: 7 }}>
                                        <Iconfont type="icon-tianjiawenjianjia" style={{ width: 18, height: 18 }} />
                                    </div>
                                </div>
                                <Modal
                                    title="新增素材库"
                                    visible={this.state.addMaterialVisible}
                                    onOk={this.handleAddMaterialOk.bind(this)}
                                    onCancel={this.handleAddMaterialCancel.bind(this)}
                                >
                                    <Form onSubmit={this.handleAddMaterialSubmit.bind(this)}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="素材夹名称">
                                            {getFieldDecorator('materialName', {
                                                rules: [{
                                                    required: true, message: '名称不能为空！',
                                                }],
                                                initialValue: this.state.MaterialValue
                                            })(
                                                <Input
                                                    maxLength={'14'}
                                                    onChange={this.MaterialChange.bind(this)}
                                                />
                                            )}
                                        </FormItem>
                                    </Form>
                                </Modal>
                            </div>
                            <div className="bottom" style={{ maxHeight: this.state.browserHeight + 'px' }} >
                                <ul className="material-list">
                                    {
                                        this.state.materialList.map((item, index) =>
                                            <li
                                                key={index}
                                                className={this.state.materialCurrent === index ? 'material-list-item-active' : 'material-list-item'}
                                                onDragEnter={this.dragenter.bind(this)}
                                                onDragOver={this.dragover.bind(this)}
                                                onDrop={this.drop.bind(this, item.id)}
                                            >
                                                <span className="material-name"
                                                    onClick={this.handleMeterialNavigation.bind(this, item.id, index)}
                                                    title={item.catname}
                                                >{item.catname}</span>
                                                <span>
                                                <Dropdown overlay={materialSetMenu} trigger={['click']} 
                                                    getPopupContainer={() => document.querySelector('.material-list')}
                                                >
                                                    <i onClick={this.onClickMaterialListItem.bind(this, item.id)}>< Iconfont type="icon-icon02" style={{ color: '#000' }} /></i>
                                                </Dropdown> 
                                                </span>
                                            </li>
                                        )
                                    }
                                </ul>
                                <Modal
                                    title="素材库重命名"
                                    visible={this.state.renameMaterialVisible}
                                    onOk={this.handleRenameMaterialOk.bind(this)}
                                    onCancel={this.handleRenameMaterialCancel.bind(this)}
                                >
                                    <Input
                                        placeholder="给素材库起一个新的名字吧"
                                        prefix={<Icon type="folder-open" />}
                                        value={this.state.materialName}
                                        onChange={this.onChangeMaterialName.bind(this)}
                                        maxLength={'15'}
                                    />
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
                <Briefing visible={this.state.brieVisible} onCancel={this.briefingCancel.bind(this)}></Briefing>
            </div>
        )
    }
}
 
const mapStateToProps = state => {
    return {
        datelist: state.getMaterialOpinionDetailSucceededReducer.data.result,
        pageInfo: state.getMaterialOpinionDetailSucceededReducer.data.pageinfo,
        materialList: state.getMaterialOpinionListSucceededReducer.data.reportCatList,
        reportData: state.getReportListSucceeded.data,
        searchKeyword: state.searchKeywordSyncReducer.ks,
        favCatList: state.getCollectionOpinionListSucceeded.data.favCatList        
    }
};
 
const mapDispatchToProps = dispatch => {
    return {
        opinionSearchRequest: req => {
            dispatch(opinionSearchRequested(req));
        },
        searchKeywordSync: ks => {
      dispatch(searchKeywordSync(ks));
    },
        getMaterialOpinionListRequested: () => {
            dispatch(getMaterialOpinionListRequested());
        },
        getMaterialOpinionDetailRequested: req => {
            dispatch(getMaterialOpinionDetailRequested(req));
        },
        getReportListRequested: (req) => {
            dispatch(getReportListRequested(req));
        },
        paginationPage: req => {
      dispatch(paginationPage(req));
        },
        getCollectionOpinionListRequested: () => {
        dispatch(getCollectionOpinionListRequested());
        },
        briefingSwitch: req => {
            dispatch(briefingSwitch(req))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MaterialOpinion))