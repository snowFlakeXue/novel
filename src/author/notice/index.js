import React, { Component } from 'react';
import axios from './../../axios/index'
import common from './../../common/index'
import {Link} from 'react-router-dom'
class AuthorNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    componentDidMount(){
          axios.get({
              url:"/admin/notice",
              data:{
                  service:7,
                  showLoading:true
              }
          }).then(res=>{
              this.setState({
                  noticeNode:(
                      <ul>
                          {res.data.map(item=>{
                              
                              return <li key={item.id} style={{marginBottom:"10px"}}>
                                  <div style={{float:"left"}}><Link to={`/author/noticeDetail/${item.id}`}>{item.title}</Link></div>
                                  <div style={{float:"right"}}>{common.formateDate(item.gmtModified)}</div>
                              </li>
                          })}
                      </ul>
                  )
              })
          })
    }
    render() { 
        return ( 
            <div>
                <h1>公告</h1>
                {this.state.noticeNode}
                
            </div>
         );
    }
}
 
export default AuthorNotice;