import React, { Component } from 'react';
import AuthorHeader from './components/author-hearder'
import { Menu,BackTop } from 'antd'
import { NavLink } from 'react-router-dom'
import {getChapterId,getAuthorMenu} from './redux/action'
import {connect} from 'react-redux'
class AuthorStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected:'/author/index'
        }
    }
    componentWillReceiveProps(){
       this.setState({
            selected:this.props.authorMenu
       })
    }
    removeChapter=(e)=>{
        this.props.getId("");
        this.props.getAuthorMenu(e.key);
        // this.setState({
        //     selected:[e.key]
        // })
    }
    render() {
        const style = {
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#bae7ff',
            color: '#ffc069',
            textAlign: 'center',
            fontSize: 16,
        };
        return (
            <div style={{backgroundImage:"url('assets/authorBack.png')",backgroundSize:'contain',backgroundRepeat:"y-repeat"}}>
                <AuthorHeader />
                <div style={{ width: "90%", margin: "30px auto",height:"200vh", }}>
                    <Menu selectedKeys={this.state.selected} onClick={this.removeChapter} style={{ width: "10%", marginRight: "30px", textAlign: "right", float: "left" }}>
                        <Menu.Item key="/author/index">
                            <NavLink to="/author/index">专区首页</NavLink>
                        </Menu.Item>
                        <Menu.Item key="/author/book-manage"><NavLink to="/author/book-manage">作品管理</NavLink></Menu.Item>
                        <Menu.Item key="/author/notice"><NavLink to="/author/notice">通知公告</NavLink></Menu.Item>
                        <Menu.Item key="/author/base">
                            <NavLink to="/author/base/info">个人信息</NavLink></Menu.Item>
                    </Menu>
                    <div style={{ float: "left", width: "80%",backgroundColor:"rgba(255, 192, 203, 0.418)",minHeight:"650px",padding:"20px" }}>
                        {this.props.children}
                    </div>
                    <BackTop visibilityHeight={20}>
                    <div style={style}>UP</div>
                </BackTop>
                </div>

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
 
  export default connect(mapStatetoProp,dispatchToProps)(AuthorStage);
