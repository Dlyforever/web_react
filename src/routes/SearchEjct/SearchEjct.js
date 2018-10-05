import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Pagination, DatePicker, Form, Icon, message, Button, Input, Checkbox } from 'antd';
import OpinionDetail from '../../components/OpinionDetail/OpinionDetail';
import {opinionSearchRequested, searchKeywordSync, paginationPage, yvqingListRequested, classifyRequested, specialRequested} from '../../redux/actions/createActions';
import {URLToObject, getSecondTime} from '../../utils/format';
import {GRAY} from '../../utils/colors';
import './SearchEjct.less';
const FormItem = Form.Item;
class SearchEjct extends React.Component {
  constructor() {
    super();
    this.state = {
      time: [
        {
          name: '全部',
          value: 'all'
        },
        {
          name: '今天',
          value: 'today'
        },
        {
          name: '昨天',
          value: 'yestoday'
        },
        {
          name: '近7天',
          value: '7day'
        },
        {
          name: '近30天',
          value: '30day'
        },
        {
          name: '自定义',
          value: 'custom'
        }
      ],
      isTopShow: true,
      timeValue: 'all',
      trend: [
        {
          name: '全部',
          value: 'all'
        },
        {
          name: '正面',
          value: -1
        },
        {
          name: '中性',
          value: 0
        },
        {
          name: '负面',
          value: 1
        },
        {
          name: '预警',
          value: 2
        }
      ],
      trendValue: 'all',
      sort: [
        {
          name: '时间降序',
          value: 'timedown'
        },
        {
          name: '时间升序',
          value: 'timeup'
        },
        {
          name: '热搜排序',
          value: 'hot'
        },
      ],
      sortValue: 'timedown',
      filter: [
        {
          name: '不去重',
          value: 1
        },
        {
          name: '去重',
          value: 0
        }
      ],
      filterValue: 1,
      media: [
        {count: 0, value: "全部", key: "docApp"},

        {count: 0, value: "APP", key: "docApp"},

      ],
      mediaValue: '全部',
      page: 1,
      pagesize: 20,
      pageCount: 500,
      count: 0,
      docList: [],
      begin: '',
      end: '',
      timePickerShow: false,
      current: 1,
      type: 0,
      endTime: '',     
      mediaList:{
        'app':'APP',
        'blog':'博客',
        'medium':'平媒',
        'wechat':'微信',
        'weibo':'微博',
        'news':'新闻',
        'forum':'论坛'
     },
     sources:'',
     keyword: '',
     seltype: '',
     titleValue: '',
     contentValue: '',
     authorValue: '',
     sourceValue: '',
     mediaArr: [],
     trendArr: [],
     mediaCheckArr: Array(10).fill(false),
     trendCheckArr: Array(5).fill(false),
     mediaAllCheck: false,
     trendAllCheck: false,
    }
  }
  timeClick(value) {
    if (value === 'custom') {
      this.setState({
        timePickerShow: !this.state.timePickerShow,
        timeValue: 'custom'
      })
      return
    } else {
      this.setState({
        timePickerShow: false,
        timeValue: value,
        begin: '',
        end: ''
      })
    }
    // let param = {}
    // if (this.state.type !== 1) {
    //   param = {
    //     datetag: value,
    //     neg: JSON.stringify(this.state.trendArr),
    //     carry: JSON.stringify(this.state.mediaArr),
    //     pagesize: this.state.pagesize,
    //     sources:this.state.sources,
    //     order: this.state.sortValue,
    //     similer: this.state.filterValue,
    //     title: this.state.titleValue,
    //     content: this.state.contentValue,
    //     author: this.state.authorValue,
    //     source: this.state.sourceValue
    //   };
    //   // this.props.opinionSearchRequest(param);
    //   // this.props.paginationPage(1);
    //   // this.props.searchKeywordSync({keyword: "", seltype: "1", type: 0});
    // } else {
    //   param = {
    //     datetag: value,
    //     neg: JSON.stringify(this.state.trendArr),
    //     carry: JSON.stringify(this.state.mediaArr),
    //     order: this.state.sortValue,
    //     similer: this.state.filterValue,
    //     begin: this.state.begin,
    //     end: this.state.end,
    //     pagesize: this.state.pagesize,
    //     sources:this.state.sources,
    //     title: this.state.titleValue,
    //     content: this.state.contentValue,
    //     author: this.state.authorValue,
    //     source: this.state.sourceValue
    //   };
    //   // this.props.opinionSearchRequest(param);
    //   // this.props.paginationPage(1);
    // }
    // if(this.props.match.params.type === 'allopinion') {
    //   this.props.yvqingListRequest(param)
    // }else if(this.props.match.params.type === 'topic') {
    //   param.topicid = this.props.match.params.id
    //   this.props.specialRequest(param)
    // }else if (this.props.match.params.type === 'sort') {
    //   param.clfid = this.props.match.params.id
    //   this.props.classifyRequest(param)
    // }
    // this.props.paginationPage(1);
  }

  // 选择具体时间
  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let rangeTimeValue = fieldsValue['range-time-picker'];
      const rangeEndTimeValue = fieldsValue['range-endtime-picker'];
      const values = {
        ...fieldsValue,
        'range-time-picker': [
          rangeTimeValue.format('YYYY-MM-DD HH:mm:ss'),
          rangeEndTimeValue.format('YYYY-MM-DD HH:mm:ss'),
        ]
      };
      const begin = values['range-time-picker'][0];
      const end = values['range-time-picker'][1];
      if (getSecondTime(begin) > Math.round(new Date())) {
        message.error('开始时间请不要大于当前时间');
        return;
      }
      else if (getSecondTime(begin) > getSecondTime(end)) {
        message.error('开始时间请不要大于结束时间');
        return;
      }
      const timeValue = 'custom';
      this.setState({
        begin: begin,
        end: end,
        timeValue: 'custom',
      });
      let param = {}
      if (this.state.type !== 1) {
         param = {
          datetag: timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: begin,
          end: end,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
        //this.props.searchKeywordSync({keyword: "", seltype: "1", type: 0});
      } else {
        param = {
          datetag: timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: begin,
          end: end,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
      }
      if(this.props.match.params.type === 'allopinion') {
        this.props.yvqingListRequest(param)
      }else if(this.props.match.params.type === 'topic') {
        param.topicid = this.props.match.params.id
        this.props.specialRequest(param)
      }else if (this.props.match.params.type === 'sort') {
        param.clfid = this.props.match.params.id
        this.props.classifyRequest(param)
      }
      this.props.paginationPage(1);
    });
  }

  // trendClick(value) {
  //   this.setState({
  //     trendValue: value
  //   });
  //   if (this.state.type !== 1) {
  //     const param = {
  //       datetag: this.state.timeValue,
  //       neg: value,
  //       order: this.state.sortValue,
  //       similer: this.state.filterValue,
  //       carry: this.state.mediaValue,
  //       begin: this.state.begin,
  //       end: this.state.end,
  //       pagesize: this.state.pagesize,
  //       sources:this.state.sources,
  //       title: this.state.titleValue,
  //       content: this.state.contentValue,
  //       author: this.state.authorValue,
  //       source: this.state.sourceValue
  //     };
  //     this.props.opinionSearchRequest(param);
  //     this.props.paginationPage(1);
  //     //this.props.searchKeywordSync({keyword: "", seltype: "1", type: 0});
  //   } else {
  //     const param = {
  //       datetag: this.state.timeValue,
  //       seltype:  this.state.keyword.seltype,
  //       keyword: this.state.keyword.keyword,
  //       neg: value,
  //       order: this.state.sortValue,
  //       similer: this.state.filterValue,
  //       carry: this.state.mediaValue,
  //       begin: this.state.begin,
  //       end: this.state.end,
  //       pagesize: this.state.pagesize,
  //       sources:this.state.sources,
  //       title: this.state.titleValue,
  //       content: this.state.contentValue,
  //       author: this.state.authorValue,
  //       source: this.state.sourceValue
  //     };
  //     this.props.opinionSearchRequest(param);
  //     this.props.paginationPage(1);
  //   }
  // }

  sortClick() {
    this.setState({
      sortValue: this.state.sortValue === 'timedown' ?  'timeup'  : 'timedown'
    }, () => {
      if(this.state.timeValue !== 'custom') {
        let param = {
          datetag: this.state.timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: this.state.begin,
          end: this.state.end,
          page: 1,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
        if(param.datetag = 'all') param.datetag = ''
        if(this.props.match.params.type === 'allopinion') {
          this.props.yvqingListRequest(param)
        }else if(this.props.match.params.type === 'topic') {
          param.topicid = this.props.match.params.id
          this.props.specialRequest(param)
        }else if (this.props.match.params.type === 'sort') {
          param.clfid = this.props.match.params.id
          this.props.classifyRequest(param)
        }
        this.props.paginationPage(1);
      }else{
        this.props.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          let rangeTimeValue = fieldsValue['range-time-picker'];
          const rangeEndTimeValue = fieldsValue['range-endtime-picker'];
          const values = {
            ...fieldsValue,
            'range-time-picker': [
              rangeTimeValue.format('YYYY-MM-DD HH:mm:ss'),
              rangeEndTimeValue.format('YYYY-MM-DD HH:mm:ss'),
            ]
          };
          const begin = values['range-time-picker'][0];
          const end = values['range-time-picker'][1];
          if (getSecondTime(begin) > Math.round(new Date())) {
            message.error('开始时间请不要大于当前时间');
            return;
          }
          else if (getSecondTime(begin) > getSecondTime(end)) {
            message.error('开始时间请不要大于结束时间');
            return;
          }
          const timeValue = 'custom';
          this.setState({
            begin: begin,
            end: end,
            timeValue: 'custom',
          });
          let param = {}
          param = {
            datetag: timeValue,
            neg: JSON.stringify(this.state.trendArr),
            order: this.state.sortValue,
            similer: this.state.filterValue,
            carry: JSON.stringify(this.state.mediaArr),
            begin: begin,
            end: end,
            pagesize: this.state.pagesize,
            sources:this.state.sources,
            title: this.state.titleValue,
            content: this.state.contentValue,
            author: this.state.authorValue,
            source: this.state.sourceValue
          };
          if(param.datetag = 'all') param.datetag = ''
          if(this.props.match.params.type === 'allopinion') {
            this.props.yvqingListRequest(param)
          }else if(this.props.match.params.type === 'topic') {
            param.topicid = this.props.match.params.id
            this.props.specialRequest(param)
          }else if (this.props.match.params.type === 'sort') {
            param.clfid = this.props.match.params.id
            this.props.classifyRequest(param)
          }
          this.props.paginationPage(1);
        });
      }
    });
    
  }

  filterClick() {
    this.setState({
      filterValue: this.state.filterValue === 1 ? 0 : 1 
    }, () => {
      if(this.state.timeValue !== 'custom') {
        let param = {
          datetag: this.state.timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: this.state.begin,
          end: this.state.end,
          page: 1,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
        if(param.datetag = 'all') param.datetag = ''
        if(this.props.match.params.type === 'allopinion') {
          this.props.yvqingListRequest(param)
        }else if(this.props.match.params.type === 'topic') {
          param.topicid = this.props.match.params.id
          this.props.specialRequest(param)
        }else if (this.props.match.params.type === 'sort') {
          param.clfid = this.props.match.params.id
          this.props.classifyRequest(param)
        }
        this.props.paginationPage(1);
      }else{
        this.props.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          let rangeTimeValue = fieldsValue['range-time-picker'];
          const rangeEndTimeValue = fieldsValue['range-endtime-picker'];
          const values = {
            ...fieldsValue,
            'range-time-picker': [
              rangeTimeValue.format('YYYY-MM-DD HH:mm:ss'),
              rangeEndTimeValue.format('YYYY-MM-DD HH:mm:ss'),
            ]
          };
          const begin = values['range-time-picker'][0];
          const end = values['range-time-picker'][1];
          if (getSecondTime(begin) > Math.round(new Date())) {
            message.error('开始时间请不要大于当前时间');
            return;
          }
          else if (getSecondTime(begin) > getSecondTime(end)) {
            message.error('开始时间请不要大于结束时间');
            return;
          }
          const timeValue = 'custom';
          this.setState({
            begin: begin,
            end: end,
            timeValue: 'custom',
          });
          let param = {}
          param = {
            datetag: timeValue,
            neg: JSON.stringify(this.state.trendArr),
            order: this.state.sortValue,
            similer: this.state.filterValue,
            carry: JSON.stringify(this.state.mediaArr),
            begin: begin,
            end: end,
            pagesize: this.state.pagesize,
            sources:this.state.sources,
            title: this.state.titleValue,
            content: this.state.contentValue,
            author: this.state.authorValue,
            source: this.state.sourceValue
          };
          if(param.datetag = 'all') param.datetag = ''
          if(this.props.match.params.type === 'allopinion') {
            this.props.yvqingListRequest(param)
          }else if(this.props.match.params.type === 'topic') {
            param.topicid = this.props.match.params.id
            this.props.specialRequest(param)
          }else if (this.props.match.params.type === 'sort') {
            param.clfid = this.props.match.params.id
            this.props.classifyRequest(param)
          }
          this.props.paginationPage(1);
        });
      }
    });
    
  }

  // mediaClick(value) {
  //   this.setState({
  //     mediaValue: value
  //   });
  //   if (this.state.type !== 1) {
  //     const param = {
  //       datetag: this.state.timeValue,
  //       neg: this.state.trendValue,
  //       order: this.state.sortValue,
  //       similer: this.state.filterValue,
  //       carry: value,
  //       begin: this.state.begin,
  //       end: this.state.end,
  //       pagesize: this.state.pagesize,
  //       sources:this.state.sources,
  //       title: this.state.titleValue,
  //       content: this.state.contentValue,
  //       author: this.state.authorValue,
  //       source: this.state.sourceValue
  //     };
  //     this.props.opinionSearchRequest(param);
  //     this.props.paginationPage(1);
  //     //this.props.searchKeywordSync({keyword: "", seltype: "1", type: 0});
  //   } else {
  //     const param = {
  //       datetag: this.state.timeValue,
  //       seltype:  this.state.keyword.seltype,
  //       keyword: this.state.keyword.keyword,
  //       neg: this.state.trendValue,
  //       order: this.state.sortValue,
  //       similer: this.state.filterValue,
  //       carry: value,
  //       begin: this.state.begin,
  //       end: this.state.end,
  //       pagesize: this.state.pagesize,
  //       sources:this.state.sources,
  //       title: this.state.titleValue,
  //       content: this.state.contentValue,
  //       author: this.state.authorValue,
  //       source: this.state.sourceValue
  //     };
  //     this.props.opinionSearchRequest(param);
  //     this.props.paginationPage(1);
  //   }
  // }

  onShowSizeChange(current, pageSize) {
    this.setState({
      page: current,
      pagesize: pageSize
    });
    let param = {}
    if (this.state.type !== 1) {
      param = {
        datetag: this.state.timeValue,
        neg: JSON.stringify(this.state.trendArr),
        order: this.state.sortValue,
        similer: this.state.filterValue,
        carry: JSON.stringify(this.state.mediaArr),
        begin: this.state.begin,
        end: this.state.end,
        pagesize: pageSize,
        sources:this.state.sources,
        title: this.state.titleValue,
        content: this.state.contentValue,
        author: this.state.authorValue,
        source: this.state.sourceValue
      };
    } else {
      param = {
        datetag: this.state.timeValue,
        neg: JSON.stringify(this.state.trendArr),
        order: this.state.sortValue,
        similer: this.state.filterValue,
        carry: JSON.stringify(this.state.mediaArr),
        begin: this.state.begin,
        end: this.state.end,
        pagesize: pageSize,
        sources:this.state.sources,
        title: this.state.titleValue,
        content: this.state.contentValue,
        author: this.state.authorValue,
        source: this.state.sourceValue
      };
    }
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }

  onPaginationChange(pagenumber) {
    this.setState({
      page: pagenumber
    });
    let param={};
  //   if(this.props.ks.keyword===''){
  //     param = {
  //     datetag: this.state.timeValue,
  //     neg: this.state.trendValue,
  //     order: this.state.sortValue,
  //     similer: this.state.filterValue,
  //     carry: this.state.mediaValue,
  //     begin: this.state.begin,
  //     end: this.state.end,
  //     page: pagenumber,
  //     pagesize: this.state.pagesize,
  //     sources:this.state.sources
  //   };
  //  }else{
  //     param = {
  //     seltype: this.props.ks.seltype,
  //     keyword:this.props.ks.keyword,
  //     page:pagenumber,
  //     similer:1,
  //     sources:this.state.sources
  //    }
  //  }
  if(this.state.docList.keyword === '') {
    param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      page: this.state.page,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    }
  }else{
    param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      page: pagenumber,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    }
  }
  if(this.props.match.params.type === 'allopinion') {
    this.props.yvqingListRequest(param)
  }else if(this.props.match.params.type === 'topic') {
    param.topicid = this.props.match.params.id
    this.props.specialRequest(param)
  }else if (this.props.match.params.type === 'sort') {
    param.clfid = this.props.match.params.id
    this.props.classifyRequest(param)
  }
    this.props.paginationPage(pagenumber);
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  triggerTopShow() {
    this.setState({
      isTopShow: !this.state.isTopShow
    });
    this.props.searchKeywordSync({keyword: "", seltype: "1", type: 0});
  }

  dataChanged(page) {
    setTimeout(() => {
      let param = {}
      if (this.state.type !== 1) {
        param = {
          datetag: this.state.timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: this.state.begin,
          end: this.state.end,
          page: this.props.page,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
      } else {
        param = {
          similer:this.state.filterValue,
          datetag:this.state.timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order:this.state.sortValue,
          carry: JSON.stringify(this.state.mediaArr),
          page:this.props.page,
          pagesize: this.state.pagesize,
          begin: this.state.begin,
          end: this.state.end,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
      }
      if(this.props.match.params.type === 'allopinion') {
        this.props.yvqingListRequest(param)
      }else if(this.props.match.params.type === 'topic') {
        param.topicid = this.props.match.params.id
        this.props.specialRequest(param)
      }else if (this.props.match.params.type === 'sort') {
        param.clfid = this.props.match.params.id
        this.props.classifyRequest(param)
      }
    }, 1);
  }

  componentWillMount() {
    const {
      keyword,
      seltype
    } = URLToObject(window.location.hash)
    const Valuekey = seltype === 'content' ? 'contentValue' : 'titleValue'
    this.setState({
      [Valuekey]: decodeURIComponent(keyword)
    }, () =>  {
      const param = {
        datetag: this.state.timeValue,
        neg: JSON.stringify(this.state.trendArr),
        order: this.state.sortValue,
        similer: this.state.filterValue,
        carry: JSON.stringify(this.state.mediaArr),
        begin: this.state.begin,
        end: this.state.end,
        page: this.state.page,
        pagesize: this.state.pagesize,
        sources:this.state.sources,
        title: this.state.titleValue,
        content: this.state.contentValue,
        author: this.state.authorValue,
        source: this.state.sourceValue
      }
      if(param.datetag === 'all') param.datetag = ''
      if(this.props.match.params.type === 'allopinion') {
        this.props.yvqingListRequest(param)
      }else if(this.props.match.params.type === 'topic') {
        param.topicid = this.props.match.params.id
        this.props.specialRequest(param)
      }else if (this.props.match.params.type === 'sort') {
        param.clfid = this.props.match.params.id
        this.props.classifyRequest(param)
      }
    })
  }

  componentDidMount() {
    window.addEventListener("storage", function (e) {
      console.log('storage改变')
    })
    ReactDOM.findDOMNode(this).scrollIntoView();
    if(this.state.keyword !==''){
      this.setState({
          type:1
      })
    }
  }

  componentWillUnmount() {
    this.props.paginationPage(1);
    this.props.searchKeywordSync({
      seltype: '',
      keyword: '', type: 0
    });
  }
  componentWillReceiveProps(nextporps) {
    if(nextporps.carryCount.length > this.state.mediaCheckArr.length) {
      let [...arr] = this.state.mediaCheckArr
      arr.push(false, nextporps.carryCount.length - this.state.mediaCheckArr.length)
      this.setState({
        mediaCheckArr: arr 
      })
    }else if (nextporps.carryCount.length < this.state.mediaCheckArr.length){
      let arr = this.state.mediaCheckArr.slice(0, nextporps.carryCount.length)
      this.setState({
        mediaCheckArr: arr 
      })
    }
  }

  dateChange(date, dateString) {
    this.setState({
      endTime: dateString
    })
  }

  searchType(data) {
    this.setState({
      type: data
    })
  }
  remove(){
    this.setState({
       timeValue:'all', 
       trendValue:'all' ,
       filterValue:1,
       mediaValue:'全部',
       sortValue:'timedown',
       sources:'' 
    })
  }
  onInputValueChange(key, e) {
    let stateKey = key + 'Value'
    this.setState({
      [stateKey]: e.target.value
    })
  }
 
  onTitleBlur() {
    let param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }
  onContentBlur() {
    let param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }
  onSourceBlur() {
    let param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }
  onAuthorBlur() {
    let param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }
  getcheckValue(){

  }
  mediaChange(value, index, e) {
    let checkarr = []
    if(index === 0) {
      let arr = this.state.mediaCheckArr.map(item => item = e.target.checked)
      this.setState({
        mediaCheckArr: arr,
        mediaAllCheck: e.target.checked
      })
      checkarr = arr
    }else{
      let [...arr] = this.state.mediaCheckArr
      arr[index] = e.target.checked
      let mediaArr = arr.slice(1, arr.length)
      let isallcheck = mediaArr.every(item => item === true)
      this.setState({
        mediaAllCheck: isallcheck,
        mediaCheckArr: arr
      })
      checkarr = arr
    }
    let mediavalue = []
    checkarr.slice(1, checkarr.length).forEach((item, index) => {
      if(item) {
        mediavalue.push(this.props.carryCount.slice(1, this.props.carryCount.length)[index].value)
      }
    })
    mediavalue.length === this.props.carryCount.length -1 ? mediavalue = [] : ''
    this.setState({
      mediaArr: mediavalue
    })
  }
  trendChange(index, e) {
    let checkarr = []
    if(index === 0) {
      let arr = this.state.trendCheckArr.map(item => item = e.target.checked)
      this.setState({
        trendCheckArr: arr,
        trendAllCheck: e.target.checked
      })
      checkarr = arr
    }else{
      let [...arr] = this.state.trendCheckArr
      arr[index] = e.target.checked
      let trendArr = arr.slice(1, arr.length)
      let isallcheck = trendArr.every(item => item === true)
      this.setState({
        trendAllCheck: isallcheck,
        trendCheckArr: arr
      })
      checkarr = arr
    }
    let trendvalue = []
    checkarr.slice(1, checkarr.length).forEach((item, index) => {
      if(item) {
        trendvalue.push(this.state.trend.slice(1, this.state.trend.length)[index].value)
      }
    })
    trendvalue.length === this.state.trend.length-1 ? trendvalue = [] : ''
    this.setState({
      trendArr: trendvalue
    })
  }
  trendSearchClick() {
    let param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      pagesize: this.state.pagesize,
      page: 1,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'allopinion') {
      this.props.yvqingListRequest(param)
    }else if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
      this.props.specialRequest(param)
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
      this.props.classifyRequest(param)
    }
    this.props.paginationPage(1);
  }
  mediaSearchClick() {
    if(this.state.timeValue !== 'custom') {
      let param = {
        datetag: this.state.timeValue,
        neg: JSON.stringify(this.state.trendArr),
        order: this.state.sortValue,
        similer: this.state.filterValue,
        carry: JSON.stringify(this.state.mediaArr),
        begin: this.state.begin,
        end: this.state.end,
        page: 1,
        pagesize: this.state.pagesize,
        sources:this.state.sources,
        title: this.state.titleValue,
        content: this.state.contentValue,
        author: this.state.authorValue,
        source: this.state.sourceValue
      };
      if(param.datetag === 'all') param.datetag = ''
      if(this.props.match.params.type === 'allopinion') {
        this.props.yvqingListRequest(param)
      }else if(this.props.match.params.type === 'topic') {
        param.topicid = this.props.match.params.id
        this.props.specialRequest(param)
      }else if (this.props.match.params.type === 'sort') {
        param.clfid = this.props.match.params.id
        this.props.classifyRequest(param)
      }
      this.props.paginationPage(1);
    }else{
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        let rangeTimeValue = fieldsValue['range-time-picker'];
        const rangeEndTimeValue = fieldsValue['range-endtime-picker'];
        const values = {
          ...fieldsValue,
          'range-time-picker': [
            rangeTimeValue.format('YYYY-MM-DD HH:mm:ss'),
            rangeEndTimeValue.format('YYYY-MM-DD HH:mm:ss'),
          ]
        };
        const begin = values['range-time-picker'][0];
        const end = values['range-time-picker'][1];
        if (getSecondTime(begin) > Math.round(new Date())) {
          message.error('开始时间请不要大于当前时间');
          return;
        }
        else if (getSecondTime(begin) > getSecondTime(end)) {
          message.error('开始时间请不要大于结束时间');
          return;
        }
        const timeValue = 'custom';
        this.setState({
          begin: begin,
          end: end,
          timeValue: 'custom',
        });
        let param = {}
        param = {
          datetag: timeValue,
          neg: JSON.stringify(this.state.trendArr),
          order: this.state.sortValue,
          similer: this.state.filterValue,
          carry: JSON.stringify(this.state.mediaArr),
          begin: begin,
          end: end,
          pagesize: this.state.pagesize,
          sources:this.state.sources,
          title: this.state.titleValue,
          content: this.state.contentValue,
          author: this.state.authorValue,
          source: this.state.sourceValue
        };
        if(param.datetag === 'all') param.datetag = ''
        if(this.props.match.params.type === 'allopinion') {
          this.props.yvqingListRequest(param)
        }else if(this.props.match.params.type === 'topic') {
          param.topicid = this.props.match.params.id
          this.props.specialRequest(param)
        }else if (this.props.match.params.type === 'sort') {
          param.clfid = this.props.match.params.id
          this.props.classifyRequest(param)
        }
        this.props.paginationPage(1);
      });
    }
  }
  render() {
    const {docList, carryCount, pageInfo,  page} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    // 时间
    const Time = this.state.time.map((item, index) =>
      <div
        key={index}
        onClick={this.timeClick.bind(this, item.value)}
        className={item.value === this.state.timeValue ? 'item active time' : 'item time'}
      ><span className="item-inner">{item.name}</span></div>
    );

    // 倾向
    const Trend = this.state.trend.map((item, index) =>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} key={index}>
      <Checkbox checked={index === 0 ? this.state.trendAllCheck : this.state.trendCheckArr[index]} onChange={this.trendChange.bind(this, index)} style={{display: 'flex', alignItems: 'center'}}>
      <div
            key={index}
            // onClick={this.trendClick.bind(this, item.value)}
            className={item.value === this.state.trendValue ? 'item active' : 'item'}
          ><span className="item-inner">{item.name}</span></div>
      </Checkbox>
      </div>
      
    );

    // 排序
    // const Sort = this.state.sort.map((item, index) =>
    //   <div
    //     key={index}
    //     onClick={this.sortClick.bind(this, item.value)}
    //     className={item.value === this.state.sortValue ? 'fours active' : 'fours'}
    //   ><span className="item-inner">{item.name}</span></div>
    // );

    // 去重
    // const Filter = this.state.filter.map((item, index) =>
    //   <div
    //     key={index}
    //     onClick={this.filterClick.bind(this, item.value)}
    //     className={item.value === this.state.filterValue ? 'item active' : 'item'}
    //   ><span className="item-inner">{item.name}</span></div>
    // );


    // 媒体类型
    const Media = carryCount.map ? carryCount.map((item, index) =>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: index>0? 20 : 0}} key={index}>
        <Checkbox checked={index === 0 ? this.state.mediaAllCheck : this.state.mediaCheckArr[index]} onChange={this.mediaChange.bind(this, item.value, index)} style={{display: 'flex', alignItems: 'center'}}>
        <div
        key={index}
        // onClick={this.mediaClick.bind(this, item.value)}
        className={item.value === this.state.mediaValue ? 'item active' : 'item'}
      ><p className="item-inner">{item.key === 'docSearch' ? '其它' : item.value}</p>
        <p className="count">{item.count}</p>
      </div>
        </Checkbox>
      </div>
    ): '';
    // TODO:
    const param = {
      datetag: this.state.timeValue,
      neg: JSON.stringify(this.state.trendArr),
      order: this.state.sortValue,
      similer: this.state.filterValue,
      carry: JSON.stringify(this.state.mediaArr),
      begin: this.state.begin,
      end: this.state.end,
      page: this.state.page,
      pagesize: this.state.pagesize,
      sources:this.state.sources,
      title: this.state.titleValue,
      content: this.state.contentValue,
      author: this.state.authorValue,
      source: this.state.sourceValue
    };
    if(this.props.match.params.type === 'topic') {
      param.topicid = this.props.match.params.id
    }else if (this.props.match.params.type === 'sort') {
      param.clfid = this.props.match.params.id
    }
    return (
      <div className="all-opinion" id="anchor">
        <div className="close-open" style={{background:GRAY}}>
          <div className="count"> 信息列表</div>
          <div className="close" onClick={this.triggerTopShow.bind(this)}>
            <span className="closeBtn">{this.state.isTopShow ? '显示' : '隐藏'}</span>
            <Icon type={this.state.isTopShow ? 'down' : 'right'}/>
          </div>
        </div>
        <div className="sort-top" style={this.state.isTopShow ? {display: 'block'} : {display: 'none'}}>
          <div className="sort-items">
            <div className="left">时间：</div>
            <div className="right">
              {Time}
            </div>
            <div className="other" style={this.state.timePickerShow ? {display: 'block'} : {display: 'none'}}>
              <Form onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('range-time-picker'
                  )(
                    <DatePicker showTime placeholder="开始日期" format="YYYY-MM-DD HH:mm:ss"
                                className="DatePicker"
                                style={{width: 180}}

                    />
                  )}
                </FormItem>
                <span style={{margin: "0 3px"}}>至</span>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('range-endtime-picker'
                  )(
                    <DatePicker showTime placeholder="结束日期" format="YYYY-MM-DD HH:mm:ss"
                                className="DatePicker"
                                style={{width: 180}}
                    />
                  )}
                </FormItem>
                {/* <Button type="primary" htmlType="submit" style={{marginTop: '2px'}}>
                  确定
                </Button> */}
              </Form>
            </div>
          </div>
          <div className="title-items">
              <div className="div">
                  <span>标题：</span>
                  <Input 
                    onChange = {this.onInputValueChange.bind(this, 'title')}
                    value={this.state.titleValue}
                    // onBlur={this.onTitleBlur.bind(this)}
                  >
                  </Input>
              </div>
              <div className="div">
                  <span>全文：</span>
                  <Input
                    onChange = {this.onInputValueChange.bind(this, 'content')}
                    value={this.state.contentValue} 
                    // onBlur={this.onContentBlur.bind(this)}
                  >
                    </Input>
              </div>
          </div>
          <div className="title-items">
              <div className="div">
                  <span>来源</span>
                  <Input
                    onChange = {this.onInputValueChange.bind(this, 'source')}
                    value={this.state.sourceValue}
                    // onBlur={this.onSourceBlur.bind(this)}
                  >
                  </Input>
              </div>
              <div className="div">
                  <span>作者：</span>
                  <Input
                    onChange = {this.onInputValueChange.bind(this, 'author')}
                    value={this.state.authorValue}
                    // onBlur={this.onAuthorBlur.bind(this)}
                  >
                  </Input>
              </div>
          </div>
          <div className="sort-items trend-items">
            <div className="left">倾向：</div>
            <div className="right" style={{display: 'flex', alignItems: 'center'}}>
              {Trend}
              {/* <Button className='search' onClick={this.trendSearchClick.bind(this)}>搜索</Button> */}
            </div>
          </div>
          {/* <div className="sort-items">
            <div className="left">排序：</div>
            <div className="right">
              {Sort}
            </div>
          </div> */}
          {/* <div className="sort-items">
            <div className="left">去重：</div>
            <div className="right">
              {Filter}
            </div>
          </div> */}
          <div className="media-items">
            <div className="left">媒体：</div>
            <div className="right" style={{display: 'flex', alignItems: 'center'}}>
              {Media}
              <Button className='search' type="primary" onClick={this.mediaSearchClick.bind(this)}>搜索</Button>
            </div>
          </div>
        </div>
        <div className="middle">
          <div className="count">根据您的条件，为您筛选出<span className="number">{pageInfo.count}</span>条数据！</div>
          <OpinionDetail docList={docList}
                         onDataChange={this.dataChanged.bind(this)}
                         pageSize={this.state.pagesize}
                         pageInfo={pageInfo}
                         current={page}
                         remove = {this.remove.bind(this)}
                         param = {param}
                         ShowTime = {true}
                         sortClick = {this.sortClick.bind(this)}
                         filterClick = {this.filterClick.bind(this)}
                         searchinputhidden = {true}
                         listtype = {this.props.match.params.type}
          />
        </div>
        <div className="bottom">
          <div className="pagintion-wrapper">
            <Pagination showSizeChanger
                        defaultCurrent={this.state.page}
                        defaultPageSize={this.state.pagesize}
                        onChange={this.onPaginationChange.bind(this)}
                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                        total={pageInfo.count}
                        getPopupContainer={() => document.querySelector('.all-opinion')}
                        current={page}
            />
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    themeColor: state.changeThemeReducer,
    docList: state.searchRequestSucceeded.data.searchList.docList,
    carryCount: state.searchRequestSucceeded.data.searchList.carryCount,
    pageInfo: state.searchRequestSucceeded.data.searchList.pageInfo,
    ks: state.searchKeywordSyncReducer.ks,
    page: state.paginationPageReducer,
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
    paginationPage: req => {
      dispatch(paginationPage(req));
    },
    yvqingListRequest: req => {
      dispatch(yvqingListRequested(req))
    },
    classifyRequest: req => {
      dispatch(classifyRequested(req))
    },
    specialRequest: req => {
      dispatch(specialRequested(req))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)((Form.create()(SearchEjct)));