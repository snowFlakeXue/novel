import React, { Component } from 'react';
import axios from './../../axios/index';
import {Link} from 'react-router-dom'
import { Breadcrumb } from 'antd';
class NoticeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    componentWillMount(){
        this.request()
          axios.get({
              url:`/admin/notice/${this.props.match.params.id}`,
              data:{
                  service:7,
                  showLoading:true
                  
              }
          }).then(res=>{
            console.log(res)
            this.setState({
                title:res.data.title
            })
          })
    }
    request=()=>{
        axios.get({
            url:`/admin/notice/${this.props.match.params.id}`,
            data:{
                service:7
            }
        }).then(res=>{
            this.setState({
                content:res.data.content
            })
        })
    }
    render() { 
        return ( 
            <div>
               <Breadcrumb>
                   <Breadcrumb.Item><Link to="/author/index">首页</Link></Breadcrumb.Item>
                   <Breadcrumb.Item><Link to="/author/notice">通告</Link></Breadcrumb.Item>
                   <Breadcrumb.Item>{this.state.title}</Breadcrumb.Item>
               </Breadcrumb>
               <div dangerouslySetInnerHTML={{ __html: this.state.content}}></div>
            </div>
         );
    }
}
 
export default NoticeDetail;