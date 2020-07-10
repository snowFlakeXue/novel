import React, { Component } from 'react';
import { Row, Col, Breadcrumb, Avatar } from 'antd';
import { HomeOutlined,MessageOutlined } from '@ant-design/icons';
import cookie from 'js-cookie'
import './index.css'
import {getChapterId,getAuthorMenu} from './../../redux/action'
import {connect} from 'react-redux'
class AuthorHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            authorInfo:{},
            hhh:""
         }
    }
    componentDidMount=()=>{
        let list = cookie.get('author_info')
         this.setState({
             authorInfo:JSON.parse(list)
         })
    }
    goNotice=()=>{
         this.props.getAuthorMenu("/author/notice")
        
    }
    goPerson=()=>{
        this.props.getAuthorMenu("/author/base/info")
    }
    go=()=>{
        this.props.getAuthorMenu("/author/index")
    }
    render() { 
        return ( 
            <div className="author-header">
            <Row>
                <Col xs={12} sm={12} md={8} xl={8} lg={8} >
                    <Breadcrumb separator="|" className="left">
                        <Breadcrumb.Item><Avatar style={{marginTop:"15px"}} src={this.state.authorInfo.avatar} size={50} /></Breadcrumb.Item>
                        <Breadcrumb.Item><span style={{fontFamily:"华文行楷",color:"rgb(0,0,0,0.4)"}}>作家专区</span></Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={0} sm={0} md={6} xl={6} lg={6}></Col>
                <Col xs={12} sm={12} md={10} xl={10} lg={10} >
                    <Breadcrumb separator=" " className="right">
                    <Breadcrumb.Item onClick={this.go} href="/#/author/index">
                    <HomeOutlined />
                    <span>首页</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={this.goNotice} href="/#/author/notice">
                    <MessageOutlined />
                    <span>消息</span>
                    </Breadcrumb.Item>
                    
                    <Breadcrumb.Item onClick={this.goPerson} href="/#/author/base/info">
                    <HomeOutlined />
                    <span>{this.state.authorInfo.penName}</span>
                    </Breadcrumb.Item>
                    
                    
                    </Breadcrumb>
                </Col>
            </Row>
        </div>
         );
    }
}
const mapStatetoProp = (state) => {
    return {
      novelId: state.novelId,
      authorMenu:state.authorMenu
    }
  }
const dispatchToProps = (dispatch) => {
    return {
      getId(e) {
        let action = getChapterId(e)
        return dispatch(action)
      },
      getAuthorMenu(e) {
        let action = getAuthorMenu(e)
        return dispatch(action)
      }
    }
  }
 
  export default connect(mapStatetoProp,dispatchToProps)(AuthorHeader);
 
