import React, { Component } from 'react';
import {Menu,Form,Input,Button} from 'antd';
import {NavLink} from 'react-router-dom'
import cookie from 'js-cookie'
import common from './../../common/index'
class AuthorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            authorInfo:{},
            current:"base"
         }
    }
    
    handleClick = e => {
        console.log('click ', e);
        this.setState({
          current: e.key,
        });
      };
    render() { 
       
        return ( 
            <div>
                <h2>个人信息</h2>
                <Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.current]}>
                    <Menu.Item key="base" style={{fontSize:"18px"}}><NavLink to="/author/base/info">基本信息</NavLink></Menu.Item>
                    <Menu.Item key="pwd" style={{fontSize:"18px"}}><NavLink to="/author/base/password">修改密码</NavLink></Menu.Item>
                </Menu>
                {this.props.children}
            </div>
         );
    }
}
 
export default AuthorInfo;