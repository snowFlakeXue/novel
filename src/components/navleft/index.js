import React, { Component } from 'react';
import {Menu} from 'antd'
import './index.css'
import {NavLink} from 'react-router-dom'
import SubMenu from 'antd/lib/menu/SubMenu';
import Axios from './../../axios/index'
class NavLeft extends Component {
    constructor(props) {
        super(props);
        this.state = { 
           
         }
    }
    componentWillMount(){
        // 注意要在组件加载前
        let _this=this;
        Axios.get({
            url:"/admin/menu_list",
            data:{
                service:4,
                showLoading:false
            }
        }).then(res=>{
            this.setState({
                menuNode:_this.renderMenu(res.data)
            })
        })
    }
   
    renderMenu=(data)=>{
        return data.map(item=>{
            if(item.children.length!==0){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return<Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.path}>{item.title}</NavLink>
            </Menu.Item>
            
        })
    }
    render() { 
        return ( 
            <div className="navleft">
               <Menu mode="inline">
                  {/* <Menu.Item key="作者管理"><Link to="/sso/author">作者管理</Link></Menu.Item>
                  <Menu.Item key="分类管理"><Link to="/sso/categories">分类管理</Link></Menu.Item>
                  <Menu.Item><Link to="/sso/front-banner">轮播图管理</Link></Menu.Item>
                  <Menu.Item><Link to="/sso/blog">博客管理</Link></Menu.Item>
                  <Menu.Item>权限管理</Menu.Item>
                  <Menu.Item>权限管理</Menu.Item>
                  <Menu.Item>权限管理</Menu.Item>   */}
                  {this.state.menuNode}
               </Menu>
            </div>
           
         );
    }
}
 
export default NavLeft;