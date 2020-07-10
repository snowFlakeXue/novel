import React, { Component } from 'react';
import {Card,Tooltip,Table} from 'antd'
import axios from './../../axios'
import common from './../../common'
class NovelControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination:{},
            list:[]
          }
    }
    componentWillMount(){
         this.request();
    }
    nowPage=1
    request(){
        axios.get({
            url:`/admin/novel/page/${this.nowPage}/10`,
            data:{
                service:1,
                showLoading:true
            }
        }).then(res=>{
            
            this.setState({
                list:res.data.list,
                pagination: common.pagination(res, (current) => {
                    this.nowPage = current;
                    this.request();
                }),
            })
        })
    }
    render() { 
        const columns=[
            {
                title:"小说名",
                dataIndex:"name"
            },
            {
                title:"作者名",
                dataIndex:"penName"
            },
            {
                title:"小说封面",
                dataIndex:"cover",
                render:(cover)=><img src={cover} alt="封面" />
            },
            {
                title:"描述",
                dataIndex:"description",
                ellipsis: {
                    showTitle: false,
                  },
                render:description=>(
                    <Tooltip placement="topLeft" title={description}>
                    {description}
                  </Tooltip>
                )
            },
            {
                title:"推荐语",
                dataIndex:"recommendNote",
                ellipsis: {
                    showTitle: false,
                  },
                render:recommendNote=>(
                    <Tooltip placement="topLeft" title={recommendNote}>
                    {recommendNote}
                  </Tooltip>
                )
            }
        ]
        return ( 
            <div>
               <Card title="小说管理" hoverable style={{ backgroundColor: 'rgba(255, 192, 203, 0.418)', backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px' }}>
                    <Table 
                         columns={columns} dataSource={this.state.list} bordered pagination={this.state.pagination} />

               </Card>
            </div>
         );
    }
}
 
export default NovelControl;