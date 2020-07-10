import React, { Component } from 'react';
import axios from '../../axios/index'
import {Tag,Breadcrumb,Button,Modal} from 'antd'
import {NavLink} from 'react-router-dom'
import {HighlightOutlined,SettingOutlined,CloudUploadOutlined,CloseOutlined} from '@ant-design/icons'
import './index.css'
import {getNovelId} from './../../redux/action'
import {connect} from 'react-redux'
class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            books:[]
         }
    }
    componentDidMount(){
        this.request()
    }
    request=()=>{
        axios.get({
            url:"/admin/novel",
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            this.setState({
                books:res.data
            })
        })
    }
    onChange = page => {
        this.setState({
          current: page,
        });
      };
      getId=(id)=>{
         this.props.getId(id);
      }
      delete=(id)=>{
        this.props.getId(id);
          axios.delete({
              url:`/admin/novel/${id}`,
              data:{
                  service:7,
                  showLoading:true
              }
          }).then(res=>{
              this.request()
          })
      }
      pen=(id)=>{
        this.props.getId(id);
          axios.post({
              url:`/admin/novel/${id}`,
              data:{
                  service:7
              }
          }).then(res=>{
            Modal.success(
                {
                    title: "提示",
                    content: "已申请签约，请耐心等待后台处理！"
                })
          })
      } 
    render() { 
        return ( 
            <div className="novelManage">
              <h1>作品列表<span>当前作品总数{this.state.books.length}本</span>
              <Button type="primary" style={{float:"right"}}><NavLink to="/author/book-info/0" onClick={this.getId.bind(this,0)}>创建新作品</NavLink></Button></h1>
              {this.state.books.map((item)=>{
                  return (
                      <div key={item.id} className="novelList">
                          <div className="left">
                              <div className="cover left" style={{backgroundImage:`url(${item.cover})`}}></div>
                              <div className="left">
                              <h2><span>{item.name}</span><Tag color="success">{item.issueStatus}</Tag><Tag color="default">{item.auditStatus}</Tag></h2>
                              <p>{item.latestChapterInfo===null?"暂无审核章节":`第${item.latestChapterInfo.rankIndex}章 ${item.latestChapterInfo.name}`}</p>
                              <p style={{marginTop:"20px"}}>作品字数： {item.totalWords}字</p>
                              </div>
                          </div>
                          <div className="right clearfix">
                        
                          <Breadcrumb separator=" " style={{marginBottom:"30px"}}>
                                 <Breadcrumb.Item>
                                     <NavLink onClick={this.getId.bind(this,item.id)} to={`/author/book-info/upload-chapter/${item.id}`}><CloudUploadOutlined />上传章节</NavLink>
                                 </Breadcrumb.Item>
                                 <Breadcrumb.Item>
                                     <NavLink to="/author/book-manage" onClick={this.pen.bind(this,item.id)}><HighlightOutlined />申请签约</NavLink>
                                 </Breadcrumb.Item>
                                 <Breadcrumb.Item>
                                     <NavLink to={`/author/book-info/chapter-manage/${item.id}`} onClick={this.getId.bind(this,item.id)}><SettingOutlined />管理</NavLink>
                                 </Breadcrumb.Item>
                                 <Breadcrumb.Item>
                                     <Button type="link" onClick={this.delete.bind(this,item.id)} ><CloseOutlined />删除</Button>
                                 </Breadcrumb.Item>
                             </Breadcrumb>
                             <p>阅读量：{item.view} </p>
                          </div>
                      </div>
                  )
              })}
            </div>
         );
    }
}
const mapStatetoProp = (state) => {
    return {
      novelId: state.novelId
    }
  }
  const dispatchToProps = (dispatch) => {
    return {
      getId(e) {
        let action = getNovelId(e)
        return dispatch(action)
      }
    }
  }
  export default connect(mapStatetoProp, dispatchToProps)(BookList);
