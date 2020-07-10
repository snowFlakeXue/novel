import React, { Component } from 'react';
import cookie from 'js-cookie'
import { Avatar, Breadcrumb } from 'antd'
import './index.css'
import axios from '../../axios/index';
import {Tag,Button} from 'antd'
import {NavLink} from 'react-router-dom'
import {HighlightOutlined,SettingOutlined,CloudUploadOutlined,CloseOutlined} from '@ant-design/icons'
import {getNovelId} from './../../redux/action'
import {connect} from 'react-redux'
class AuthorIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorInfo: {},
            books:[]
        }
    }
    componentWillMount(){
        this.getList()
        let list = cookie.get('author_info')
        // cookie里存的json字符串需转化成对象
        this.setState({
            authorInfo: JSON.parse(list)
        })
        let time = new Date();
        if (time.getHours() > 6 && time.getHours() < 12) {
            this.setState({
                time: "上午"
            })
        } else if (time.getHours() === 12) {
            this.setState({
                time: "中午"
            })
        } else if (time.getHours() > 12 && time.getHours() <= 18) {
            this.setState({
                time: "下午"
            })
        } else {
            this.setState({
                time: "晚上"
            })
        }
        let str = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 码字愉快~`
        this.setState({
            getTime: str
        })
        let ntime=time.getTime()-JSON.parse(list).gmtCreate;
        let day = Math.floor(ntime/86400000)
        this.setState({
            createDays:day
        })
    }
    getList=()=>{
         axios.get({
            url:"/admin/novel",
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            this.setState({
                books:res.data.slice(0,2)
            })
        })
       
    }
    getId=(id)=>{
        this.props.getId(id);
     }
    render() {
        return (
            <div className="author-index">
                <div className="info clearfix">
                    <Avatar style={{ float: "left" }} src={this.state.authorInfo.avatar} size={99} />
                    <div style={{ float: "left",marginLeft:"30px" }}>
                        <h1>{this.state.authorInfo.penName},<span>{this.state.time}好</span></h1>
                        <span>今天是{this.state.getTime}</span>
                    </div>
                    <div style={{ float: "right",marginTop:"40px" }}>
                        <Breadcrumb separator="|">
                            <Breadcrumb.Item >
                                <span>作品数量: </span>
                                <span>{this.state.authorInfo.novelCount}本</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span>创作天数: </span>
                                <span>{this.state.createDays}天</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span>累计字数: </span>
                                <span>{this.state.authorInfo.totalWords}字</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div>
                
                </div>
                <div style={{marginTop:"50px"}}>
                    <h2>我的作品</h2>
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
                                     <NavLink onClick={this.getId.bind(this,item.id)} to={`/author/book-info/${item.id}`}><HighlightOutlined />作品编辑</NavLink>
                                 </Breadcrumb.Item>
                                 
                             </Breadcrumb>
                             <p>阅读量：{item.view} </p>
                          </div>
                      </div>
                  )
              })}
                </div>
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

  export default connect(mapStatetoProp, dispatchToProps)(AuthorIndex) ;