import React, { Component } from 'react';
import './index.css'
import {Card,Avatar,Rate} from 'antd'
class BackHome extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="backHome">
               <Card hoverable style={{height:'630px',backgroundSize:"cotain",backgroundImage:"url('/assets/mao.png')", backgroundColor:'rgba(255, 192, 203, 0.418)'}}>
                   <div className="content">
                     <Avatar src='/assets/server.jpg' size={50} style={{float:'left'}} />
                     <div className="dialog">
                     Hello！这里是木樰小说后台管理
                     <br />
                     请谨慎管理您所拥有权限的数据，一些操作可根据系统提示处理
                     <br />
                     如有更多问题或意见请发邮件至<a href="mailto:liuxue82@outlook.com?subject=木樰小说后台问题反馈">liuxue82@outlook.com</a>
                     </div>
                     <div style={{clear:'both'}}>
                     <Avatar src='/assets/server.jpg' size={50} style={{float:'left'}} />
                     <div className="dialog" style={{marginTop:'20px'}}>动动你的小手指给我们评个分吧！
                     <Rate allowHalf defaultValue={0.5} /></div>
                     

                     </div>
                   </div>
               </Card>
            </div>
         );
    }
}
 
export default BackHome;