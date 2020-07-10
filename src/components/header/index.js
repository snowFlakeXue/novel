import React, { Component } from 'react';
import {Button,Avatar} from 'antd'
import './index.css'
import cookie from 'js-cookie'
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            info:{}
         }
    }
    componentWillMount(){
        this.setState({
            info: JSON.parse(cookie.get('admin_info'))
        })
       

    }
    render() { 
        return ( 
            <div className="header">
               <div className="logo">
                     <Avatar style={{float:'left',marginLeft:'40px',marginRight:'20px'}} src={this.state.info.avatar} alt="刘" size={46} />
                     <div className="name">
                     <img src='/assets/header.png' alt='header' />
                     </div>
                  </div>
               <div className="right">
                 <span style={{fontSize:"20px",paddingRight:"30px"}}>Hi , {this.state.info.nickName}</span>
               </div>
            </div>
         );
    }
}
 
export default Header;