// host
const host = 'http://119.90.61.155/om3new/webpart/';   
//const host = 'http://web.is8.com.cn/om/webpart/';
//const host = './';

// const host = './';
 const host1 =  'http://119.90.61.155/portal/'
// const host1 =  'http://192.168.6.144:8080/portal/'

 const host2 = 'http://192.168.6.133:8080/muom/webpart/Report'
//-------------------登录
//export const api_login = 'http://web.is8.com.cn/om/common/login/loginDo?action=login2';
export const api_login = 'http://119.90.61.155/portal/login2';
//export const api_login = '../common/login/loginDo?action=login2';
// 建刚
 //export const api_login = 'http://192.168.6.144:8080/portal/login2';

//export const api_logout = 'http://web.is8.com.cn/om/common/login/loginDo?action=loginOut';
//export const api_logout = 'http://119.90.61.155/om31/common/login/loginDo?action=loginOut';
export const api_logout ='../common/login/loginDo?action=loginOut';
/**
 * 首页模块
 */
//修改用户信息
const api_revise_userinfo=host1+'servlet/OrgTreeServlet2?flag=updateUserInfo';

const api_get_userinfo = host + 'self/myInfo?action=getUserInfo';
// 最新预警舆情
const api_newest_warning_opinion = host + 'main/DocSearchDo?action=mainAlert';
//首页模块信息
const api_homepage_message= host+'main/DocSearchDo?action=widget';
//新首页模块保存
const api_save_widget = host+'main/DocSearchDo?action=saveWidget';
//首页左侧导航栏
const api_get_channel = host +'homePage/oMainDo?action=getChannel';

//新首页舆情走势
const api_new_total = host + 'echart/echartDo?action=yqzc';
//新首页相关热词
const api_hot_word = host+'echart/echartDo?action=getHotJson';
// 昨日和今日舆情
const api_today_opinion = host + 'main/DocSearchDo?action=mainCountDay';
// 热搜媒体排行，对应折线图
const api_media_opinion = host + 'echart/echartDo?action=yqzc_month_Chart';
// 热搜媒体排行旁边的舆情统计
const api_media_count = host + 'echart/echartDo?action=zfmtjChart';
//新首页载体分布饼图
const api_carrier_pie = host + 'echart/echartDo?action=ztfb';
// 最新舆情
const api_newest_opinion = host + 'homePage/docSearchListDo?action=getDocListEchart';
// 最新负面舆情
const api_newest_negative_opinion = host + 'main/DocSearchDo?action=mainNegation';
// 微博舆情
const api_weibo_opinion = host + 'main/DocSearchDo?action=mainWeibo';

// 人物舆情
const api_people_opinion = host + 'main/DocSearchDo?action=mainLeader';

// 舆情统计
const api_count_opinion = host + 'main/DocSearchDo?action=mainCount';

// 专题舆情
const api_topic_opinion = host + 'oTopic/TopicEchartDo?action=getTopicMenu';

// 新专题舆情
const api_main_topic_opinion = host + 'oTopic/TopicEchartDo?action=mainTopic';

// 舆情总览
const api_total_opinion = host + 'main/DocSearchDo?action=docList';

// 设置舆情类型
const api_edit_doc_neg = host + 'docDetail/docDetailDo?action=editDocNeg';

// 删除舆情
const api_del_doc = host + 'docDetail/docDetailDo?action=docDel';

// 获取详细舆情
const api_get_doc_detail = host + 'docDetail/docDetailDo?action=getDetail';

// 获取相似舆情
const api_get_doc_similar = host + 'docDetail/docDetailDo?action=getSimiler';

// 主题添加

const api_topic_add=host+'oTopic/TopicDo?action=addTopic';

//专题列表接口
const api_topic_showlist=host+'oTopic/TopicDo?action=docList';
// 分类及专题左侧导航
const api_top_nav=host+'oTopic/TopicDo?action=getTopicMemu';

//专题分类列表
const api_topic_typeList=host+'oTopic/TopicDo?action=topicCatList';

//专题删除
const api_topic_del=host+'oTopic/TopicDo?action=delTopic';

//专题分类添加

const api_topic_typeAdd=host+'oTopic/TopicDo?action=addTopicCat';

//专题分类删除
const api_topic_typeDel=host+'oTopic/TopicDo?action=delCat';

//专题统计表
const api_topic_table=host+'oTopic/TopicDo?action=topicCarryCount';

//专题时间轴

const api_topic_timeline=host+'oTopic/oTopicDo?action=topicLineTime';

//专题整体分析
const api_topic_global=host+'oTopic/TopicEchartDo?action=tqxxfxChart';

//专题报告图表负面舆情日增趋势
const api_negtive_global=host+'oTopic/TopicEchartDo?action=tfmyqqsChart';

//专题倾向分析
const api_topic_trendOption=host+'oTopic/TopicEchartDo?action=tqxxfxbChart';

//专题媒体类型

const api_topic_mediaType=host+'oTopic/TopicEchartDo?action=tmtlxChart';

//专题媒体网站分布
const api_topic_mediaSite=host+'oTopic/TopicEchartDo?action=twzphChart';

//专题媒体类型倾向性分析
const api_topic_mediaTypeTrend=host+'oTopic/TopicEchartDo?action=tmtqxxChart';

//负面载体分布

const api_topic_negativeCarry=host+'oTopic/TopicEchartDo?action=tfmmtlxChart';

//负面媒体分布
const api_topic_negativeMedia=host+'oTopic/TopicEchartDo?action=tfmmtChart';

//专题文章趋势分析
const api_topic_essay=host+'oTopic/TopicEchartDo?action=twzqsChart';

//获取专题对应信息
const api_topic_message=host+'oTopic/TopicDo?action=getTopicAndRule';

// 获取素材库列表
const api_material_opinion_list = host + 'oWork/reportDo?action=reportCatList';
// 获取素材库素材详细信息
 //const api_material_opinion_detail = host + 'oWork/reportDo?action=getResourceInCatAll';
// const api_material_opinion_detail = host + 'oWork/reportDo?action=catDocList';
const api_material_opinion_detail = host + 'oWork/reportDo?action=getResourceInCatAll';
//const api_material_opinion_detail = host + 'oWork/reportDo?action=catDocList';


//专题修改
const api_topic_revise=host+'oTopic/TopicDo?action=editTopic';
//分类修改
const api_classify_revise=host+'oTopic/TopicDo?action=editTopicCat';

//单个规则删除
const api_topic_ruleid=host+'oTopic/TopicDo?action=delRule';

const api_clf_ruleid=host+'oClf/clfDo?action=delRule';
// 添加素材库
const api_add_material_opinion = host + 'oWork/reportDo?action=addReportCat';
// 删除素材库
const api_delete_material_opinion = host + 'oWork/reportDo?action=delCat';
// 修改素材库名称
export const api_edit_material_opinion = host + 'oWork/reportDo?action=editReportCat';
// 加入素材库
export const api_push_material = host + 'oWork/reportDo?action=putResource';
// 删除素材库中的文章内容
export const api_del_doc_from_cat = host + 'oWork/reportDo?action=delDocFromCat';
// 文件置顶
export const api_add_doc_from_top = host + 'oWork/reportDo?action=catMoveToTop';
// 素材库舆情录入
export const api_add_doc_from_mat = host + 'oWork/reportDo?action=oDataAdd';
// 素材库收藏
export const api_res_fav_cat= host + 'oWork/reportDo?action=resAddFavCat';

export {
    api_newest_warning_opinion,
    api_today_opinion,
    api_media_opinion,
    api_newest_opinion,
    api_media_count,
    api_newest_negative_opinion,
    api_weibo_opinion,
    api_main_topic_opinion,
    api_people_opinion,
    api_count_opinion,
    api_topic_opinion,
    api_topic_add,
    api_total_opinion,
    api_top_nav,
    api_edit_doc_neg,
    api_del_doc,
    api_get_doc_detail,
    api_get_doc_similar,
    api_topic_typeList,
    api_topic_typeAdd,
    api_topic_del,
    api_topic_typeDel,
    api_topic_table,
    api_topic_timeline,
    api_topic_global,
    api_topic_trendOption,
    api_topic_mediaType,
    api_topic_mediaSite,
    api_topic_mediaTypeTrend,
    api_topic_negativeCarry,
    api_topic_negativeMedia,
    api_topic_message,
    api_material_opinion_list,
    api_topic_revise,
    api_classify_revise,
    api_topic_ruleid,
    api_material_opinion_detail,
    api_add_material_opinion,
    api_delete_material_opinion,
    api_topic_showlist,
    api_negtive_global,
    api_topic_essay,
    api_revise_userinfo,
    api_get_userinfo,
    api_clf_ruleid,
    api_new_total,
    api_carrier_pie,
    api_hot_word,
    api_homepage_message,
    api_save_widget,
    api_get_channel
}

// 获取收藏夹列表
export const api_collection_opinion_list = host + 'oWork/reportDo?action=favCatList';
// 获取收藏夹素材详细信息
export const api_collection_opinion_detail = host + 'oWork/reportDo?action=catDocList';
// 添加收藏夹
export const api_add_collection_opinion = host + 'oWork/reportDo?action=addFavCat';
// 删除收藏夹
export const api_delete_collection_opinion = host + 'oWork/reportDo?action=delCat';
// 修改收藏夹名称
export const api_edit_collection_opinion = host + 'oWork/reportDo?action=editFavCat';
// 获取收藏分类下的收藏内容
export const api_edit_collection_cat_list = host + 'oWork/reportDo?action=catDocList';
// 加入收藏夹
export const api_push_collection = host + 'oWork/reportDo?action=putResource';
// 删除素材库中的文章内容
export const api_del_doc_from_collection = host + 'oWork/reportDo?action=delDocFromCat';


// 报告列表
export const api_report_list = host + 'oWork/reportDo?action=reportList';
// 添加报告
export const api_add_report = host + 'oWork/reportDo?action=addReport';
// 删除报告
export const api_delete_report = host + 'oWork/reportDo?action=delReport';
// 修改报告
export const api_edit_report = host + 'oWork/reportDo?action=editReport';
// 加入报告
export const api_put_into_report = host + 'oWork/reportDo?action=putDocToReport';
// 报告详细信息
export const api_get_report_detail = host + 'oWork/reportDo?action=getReport';
// 删除报告内的某项内容
export const api_delete_report_item = host + 'oWork/reportDo?action=delDocItem';
//汇总舆情页面导出功能
export const api_allopinion_exportskip=host+'exp/ExportData?action=exportDataList';
// 分类左侧导航栏
export const api_sorted_menu = host + 'oClf/clfDo?action=getGradeMemu';
//汇总舆情页面展示
export const api_allopinion_showlist=host+'exp/ExportData?action=showTaskList';
//下载报告
export const download_report=host+'exp/DownloadDoc';
//删除报告
export const del_report=host+'exp/ExportData?action=deleteTask';
//再次生成报告
export const regenerate_report=host+'exp/ExportData?action=reToBeDocument';
//修改标题
export const api_removetitle_report=host+'exp/ExportData?action=renameTask';

//--------------------分类舆情
// 分类列表
export const api_sorted_cat_list = host + 'oClf/clfDo?action=gradeCatList';
// 分类文件夹添加
export const api_sorted_cat_add = host + 'oClf/clfDo?action=addGradeCat';
// 分类文件夹修改
export const api_sorted_cat_edit = host + 'oClf/clfDo?action=editGradeCat';
// 分类文件夹添加
export const api_sorted_cat_delete = host + 'oClf/clfDo?action=delCat';
// 左侧导航
export const api_sorted_menu_list = host + 'oClf/clfDo?action=getGradeMemu';
// 获取分类及规则
export const api_sorted_rule_list = host + 'oClf/clfDo?action=getGradeAndRule';
// 分类及规则修改
export const api_sorted_rule_edit = host + 'oClf/clfDo?action=editGrade';
// 分类添加
export const api_sorted_rule_add = host + 'oClf/clfDo?action=addGrade';
// 单个规则删除
export const api_sorted_rule_delete = host + 'oClf/clfDo?action=delRule';
// 删除分类
export const api_sorted_grade_delete = host + 'oClf/clfDo?action=delGrade';
// 分类下的内容接口
export const api_sorted_doclist = host + 'oClf/clfDo?action=docList';
//专题下面的导出为word
export const api_topic_export_word=host+'exp/ExportData?action=exportDataList';
//通知设置用户信息
export const user_message=host+'mail/EmailDo?action=showEmailConfig';
//新增邮箱通知
export const save_mail_Config=host+'mail/EmailDo?action=saveEmailConfig';
//删除邮箱地址
export const del_email_Config=host+'mail/EmailDo?action=removeEmailAddress';
//系统设置里面的预警设置
export const system_warning_setting=host+'setting/NorWExtendDo?action=showNegativeOrWarningExtend';
//系统设置里面的保存预警设置
export const save_negative_orWarning_extend=host+'setting/NorWExtendDo?action=saveNegativeOrWarningExtend';
//系统设置里面的预警设置的关键词修改
export const edit_negative_orWarning_extend=host+'setting/NorWExtendDo?action=editNegativeOrWarningExtend';
//系统设置里面的排除停用
export const exclude_discontinuation=host+'setting/DisuseExtendDo?action=showDisuseExtend';
//系统设置里面的排除停用的关键词修改
export const  edit_disuse_extend=host+'setting/DisuseExtendDo?action=editDisuseExtend';
//舆情报告
export const public_sentiment_report=host+'exp/ExportData?action=getDocByDocument';
//预览报告
export const preview_report=host+'exp/PreviewAction';

//报告搜索
export const report_search=host+'exp/ExportData?action=search';

//舆情录入
export const public_opinion_entry=host+'appMan/appManDo?action=oDataAddSave';
//单条舆情查询
export const docdetail_remove=host+'docDetail/docDetailDo?action=docEdit' ;
//单条舆情修改
export const api_docedit_save=host+'docDetail/docDetailDo?action=docEditSave';

//排除停用添加规则
export const api_save_disuse_extend =host+'setting/DisuseExtendDo?action=saveDisuseExtend' ;
//内容页邮件获取
export const api_email_push=host+'docDetail/docDetailDo?action=docPush';
//内容页邮件推送
export const api_docsend_push =host+'docDetail/docDetailDo?action=docSendPush'
//报告历史列表
export const api_show_taskList=host+'exp/ExportData?action=showTaskList';
//系统设置消息通知 预警设置
export const api_deleteNegativeOr_WarningExtend=host+'setting/NorWExtendDo?action=deleteNegativeOrWarningExtend';
//系统设置消息通知 负面设置
export const api_delete_DisuseExtend=host+'setting/DisuseExtendDo?action=deleteDisuseExtend';
//专题舆情
export const api_topic_News=host+'oTopic/TopicEchartDo?action=topicNews';
//报告批量删除
export const api_batch_del_report=host+'exp/ExportData?action=batchDelete';
//专题报告向后台发送图片
export const api_saveimg_serives=host+'echart/echartDo?action=saveImg';
//专题舆情信息列表
export const api_topic_message_list=host+'oTopic/TopicDo?action=docList';
//舆情报告条数信息
export const api_check_report=host+'exp/ExportData?action=checkReport';
//系统设置 通知设置  打开状态
export const api_update_eamil_push_state=host+'mail/EmailDo?action=updateEamilPushState' ;
//舆情报告批量删除
export const api_del_report=host+'oWork/reportDo?action=delReport' ;
//导出细分接口
export const api_export_small=host+'exp/ExportData?action=getListBySource';
//报告列表页
export const api_get_all_report = host + 'Report?action=getAllReport';
//报告模板
export const api_get_template_report = host + 'Report?action=getAllForm';
//预览模板
export const api_get_template_report_preview = host + 'Report?action=previewTemplate';
//修改报告名称
export const api_update_report_name = host + 'Report?action=updateReportName';
//搜索报告
export const api_search_report = host + 'Report?action=searchReport';
//删除报告
export const api_new_delete_report = host + 'Report?action=deleteReport'; 
//查询模板
export const api_search_template = host +'Report?action=getFormByReportType';
//删除报告
export const api_new_preview_report = host + 'Report?action=previewTemplate'; 
//预览模板的hmtl
export const api_get_preview_html = host + 'Report?action=previewHtml';
//报告下载
export const api_download_report = host +'report/exportReport?action=downloadReport';         

// 修改报告标题
export const api_update_report = host + 'Report?action=updateTitle';
// 简报分析数据预览
export const api_add_brief_report = host + 'Report?action=briefReport';
//获取简报素材修改页面数据
export const api_get_brief_item = host + 'Report?action=getBriefItem';
//修改简报素材
export const api_update_brief_item = host + 'Report?action=updateBriefItem'; 
//简报编辑素材后刷新列表
export const api_refresh_brief = host +'Report?action=refreshBrief';
// 日期选择
export const api_get_data_daily_preview = host +'Report?action=dailyPreview';
//日报50条编辑
export const api_edit_excerpt = host +'Report?action=editExcerpt';
//日报刷新数据
export const api_get_excerpt = host +'Report?action=getExcerpt';
// 专题请求
export const api_get_special_preview = host +'Report?action=specialReport';
// 生成报告
export const api_get_generate_report = host +'report/exportReport?action=generateReport';
//简报再编辑
export const api_rebuild_report = host +'Report?action=reBuildReport'; 
//首页舆情统计图表 
export const api_count_charts= host +'main/DocSearchDo?action=mainCountPic';
// export const api_get_template_report = host + 'reportDo?action=getAllForm';
// 多语种删除
export const api_delete_multilingual= host+'docDetail/docDetailDo?action=docDel'
// 多语种详情
export const api_get_DetailForeign= host+'docDetail/docDetailDo?action=getDetailForeign'
// 招投标主题文件文件夹列表
export const api_get_BiddingFolderList = host+ 'oClf/BidDo?action=getGradeMemu'
// 招投标主题文件夹添加
export const api_get_BiddingddGradeC = host+ 'oClf/BidDo?action=addGradeCat'
// 招投标主题文件夹重命名
export const api_get_BiddingeditGradeCat = host+ 'oClf/BidDo?action=editGradeCat'
// 招投标主题文件夹删除
export const api_get_BiddingdelCat = host+ 'oClf/BidDo?action=delCat'
// 招投标分类及规则
export const api_get_BiddingetGradeAndRule = host+ 'oClf/BidDo?action=getGradeAndRule'
// 招投标类型文件夹列表
export const api_get_BiddingetgradeCatList = host+ 'oClf/BidDo?action=gradeCatList'
// 招投标分类添加
export const api_get_BiddingaddGrade = host+ 'oClf/BidDo?action=addGrade'
// 招投标主题删除
export const api_get_BiddingdelGrade = host+ 'oClf/BidDo?action=delGrade'
// 招投标主题获取分类及规则
export const api_get_BiddinggetGradeAndRule = host+ 'oClf/BidDo?action=getGradeAndRule'
// 招投标规则修改
export const api_get_BiddinggetEditRule = host + 'oClf/BidDo?action=editGrade'
// 招投标删除
export const api_get_BiddinggetDelRule = host + 'oClf/BidDo?action=delRule'
// 招投标文章列表
export const api_bidding_message_list = host + 'oClf/BidDo?action=docList'
// 招投标文章删除
export const api_bidding_message_del = host + 'oClf/BidDo?action=docDel'
// 招投标导出
export const api_bidding_export = host + 'exp/ExportData?action=exportDataList'
//重点网站首页展示模块
export const api_show_key_website = host +'keyWebsite?action=showKeyWebsite';
//获取所有重点网站的标签
export const api_list_key_website_tag = host +'keyWebsite?action=listKeyWebsiteTag';
//保存重点网站标签
export const api_save_key_website_tag = host +'keyWebsite?action=saveKeyWebsiteTag';
//修改重点网站标签
export const api_update_key_website_tag = host +'keyWebsite?action=updateKeyWebsiteTag';
//删除重点网站标签
export const api_remove_key_website_tag = host +'keyWebsite?action=removeKeyWebsiteTag';
//根据标签ID，获取标签下的所有网站
export const api_list_key_website_name = host+'keyWebsite?action=listKeyWebsiteName';
//根据标签ID，添加网站名称
export const api_save_key_website_name = host +'keyWebsite?action=saveKeyWebsiteName';
//根据网站名称ID，修改网站名称
export const api_update_key_website_name = host +'keyWebsite?action=updateKeyWebsiteName';
//根据网站名称ID，删除网站名称
export const api_remove_key_website_name = host +'keyWebsite?action=removeKeyWebsiteName';
//调整标签顺序
export const api_key_website_sort = host +'keyWebsite?action=keyWebsiteSort';
// 加入简报 列表
export const api_briefing_list = host + 'Report?action=getReportByUid'
// 加入简报 列表
export const api_briefing_add = host + 'Report?action=addToReport'
//app预览报告
export const api_app_report = './../mpart/exp/PreviewAction?action=previewWorkApp'
//下载app老版报告接口
export const api_download_OldDoc = host+ 'Report?action=downloadOldDoc'
// 取证 案件类型列表
export const api_evidadmin_typeList = host + 'Evidence?action=getAllCaseType'
// 取证 互联网取证搜索
export const api_interent_evidList = host + 'Evidence?action=searchEvidence'
// 取证 校验证据
export const api_interent_check = host + 'Evidence?action=verifyEvidence'
// 取证 证据删除
export const api_interent_delete = host + 'Evidence?action=deleteEvidence'
// 取证 修改案件性质
export const api_interent_deitcasetype = host + 'Evidence?action=updateCaseType'
// 取证 修改证据包名
export const api_interent_deitPackage = host + 'Evidence?action=updatePackage'
// 取证详情 底层数据
export const api_interent_info_http = host + 'Evidence?action=showHttp'
// 取证详情 路由
export const api_interent_info_route = host + 'Evidence?action=showRoute'
// 取证 舆情取证 
export const api_interent_oponionEvid = host + 'Evidence?action=oponionEvidence'
// 取证 重新取证
export const api_interent_reObtainEvidence = host + 'Evidence?action=reObtainEvidence'
// 取证 单次取证
export const api_interent_internetEvidence = host + 'Evidence?action=internetEvidence'
// 阿里数据接口
export const api_ali_doclist = host + 'AliDO?action=docList'

// 搜索弹出舆情
export const api_searchejct_yuqin = host + 'main/DocSearchDo?action=searchDoc'
// 搜索弹出分类
export const api_searchejct_classify = host + 'oClf/clfDo?action=clfSearchDoc'
// 搜索弹出专题
export const api_searchejct_special = host + 'oTopic/TopicDo?action=topicSearchDoc'
// 搜索弹出导出
export const api_search_exportReport = host + 'report/exportReport?action=exportData'
// 保存人员详情  添加人员
 export const api_save_personnelInfo = host1 + 'servlet/OrgTreeServlet2?flag=addPerson'
// http://119.90.61.155/portal/servlet/OrgTreeServlet2?flag=PersonInfo&personuuid=f7dabd1e6435eade0164360238590018
// 组织架构下树结构挂载后函数
export const api_treeShow = host1 + 'servlet/OrgTreeServlet2?flag=toJson'
// 组织架构下添加组织   验证组织名是否重复
export const api_isExistOrganizationName  = host1 + 'servlet/OrgTreeServlet2'
// 组织架构 添加组织
export const api_addOrganization = host1 + 'servlet/OrgTreeServlet2?flag=addOrg'
// 角色及角色下的权限列表
export const api_get_role = host1 + 'right/RoleServlet2?flag=tojason' 
//组织人员列表区
export const api_person_list = host1 + 'servlet/OrgTreeServlet2?flag=personList'
//人员详情
export const api_person_Info = host1 + 'servlet/OrgTreeServlet2?flag=PersonInfo'
//组织详情
export const api_get_orgInfo = host1 + 'servlet/OrgTreeServlet2?flag=getOrgInfo'
//岗位详情
export const api_get_jobsInfo = host1 + 'servlet/OrgTreeServlet2?flag=getJobsInfo'
//删除人员
export const api_del_person = host1 + 'servlet/OrgTreeServlet2?flag=delPerson'
//获取当前子系统信息
export const api_sub_sys = host1 + 'right/RightServlet2?flag=subSys'
//保存角色授权
export const api_save_subRight = host1 + 'right/RightServlet2?flag=subRight'
// 组织架构  添加岗位前验证岗位名是否重复
export const api_testJobName = host1 + 'servlet/OrgTreeServlet2?flag=checkJobName'
// 组织架构  添加岗位
export const api_addJob = host1 + 'servlet/OrgTreeServlet2?flag=addJobs'
// 组织架构 删除岗位前提示
export const api_delJobTip = host1 + 'servlet/OrgTreeServlet2?flag=beforeDelJobs'
// 组织架构  删除岗位    
export const api_delJob = host1 + 'servlet/OrgTreeServlet2?flag=delJobs'
// 组织架构  删除组织
export const api_delOrg = host1 + 'servlet/OrgTreeServlet2?flag=delOrg'
// 组织架构  组织详情下  选择负责人
export const api_selectPrincipal = host1 + 'servlet/OrgTreeServlet2?flag=personList'
//重置密码
export const api_reset_pass = host1 + 'servlet/OrgTreeServlet2?flag=resetPass'
//选择组织负责人
export const api_choose_leader = host1 + 'servlet/OrgTreeServlet2?flag=chooseLeader' 
// 组织架构 重命名
export const api_reName = host1 + 'servlet/OrgTreeServlet2?flag=reOrgName'
// 选择组织弹窗搜索
export const api_find_orgname = host1 + 'servlet/OrgTreeServlet2?flag=findByOrgName'
// 组织架构  岗位编辑
export const api_editJobName = host1 + 'servlet/OrgTreeServlet2?flag=reJobName'
//岗位搜索
export const api_find_byJobName = host1 + 'servlet/OrgTreeServlet2?flag=findByJobName' 
//组织信息更新
export const api_update_orginfo = host1 +'servlet/OrgTreeServlet2?flag=updateOrgInfo'
// 验证人员编码
export const  api_testPersonalCode = host1 + 'servlet/OrgTreeServlet2?flag=isExitPersonCode'
// 组织架构  校验手机号唯一
export const  api_testPhoneNumUnique = host1 + 'servlet/OrgTreeServlet2?flag=isExitTel'
// 组织架构  校验邮箱唯一
export const  api_testEmailUnique = host1 +  'servlet/OrgTreeServlet2?flag=isExitEmail'

// 报告上传下载部分
// 报告上传
export const  api_uploadReport = host2 + '?action=uploadReport'
// 报告下载
export const  api_downLoadReport = host2 + '?action=downloadReport'
// 报告详情
export const  api_reportDetail = host2 + '?action=showReportDetail'
