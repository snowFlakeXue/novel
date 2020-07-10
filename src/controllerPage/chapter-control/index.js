import React, { Component } from 'react';
import axios from './../../axios'
import { Card, List, Button, Modal, Badge} from 'antd'
import common from './../../common'
import './index.css'
class ChapterControl extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            detail:{},
            showVisible:false
         }
    }
    componentDidMount(){
        this.request()
    }
    request=()=>{
        axios.get({
            url:'/admin/chapter/all',
            data:{
                service:1,
                showLoading:true,
                
            }
        }).then(res=>{
            console.log(res)
            this.setState({
                dataList:res.data
            })
        })
    }
    getDetail=(id)=>{
        this.setState({
            showVisible:true
        })
        axios.get({
            url:`/admin/chapter/${id}`,
            data:{
                service:1,
                showLoading:true
            }
        }).then(res=>{
            console.log(res)
            this.setState({
                detail:res.data
            })
        })
    }
    pass=(id)=>{
        
       axios.put({
           url:`/admin/chapter/pass/${id}`,
           data:{
               service:1,

           }
       }).then(res=>{
          this.request();
       })
    }
    noPass=(id)=>{
        axios.put({
            url:`/admin/chapter/no_pass/${id}`,
            data:{
                service:1,
            }
        }).then(res=>{
           this.request();
        })
    }
    closeDetail=()=>{
         this.setState({
             showVisible:false
         })
    }
    getStatus(status){
        if(status==1){
           
            return 'processing'
        }else{
            
            return 'success'
        }
    }
    setText(status){
        if(status==1){
           
            return '审核中'
        }else{
            
            return '审核通过'
        }
    }
    render() { 
        return ( 
            <div className="chapterControl">
                <Card title="章节管理" hoverable style={{ backgroundColor: 'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')", minHeight: '640px' }}>
                <List itemLayout="horizontal" dataSource={this.state.dataList} renderItem={item => (
                        <List.Item
                            actions={[ <Button type="link" onClick={this.getDetail.bind(this, item.id)}>获取详情</Button>, <Button type="link" onClick={this.noPass.bind(this, item.id)}>不通过审核</Button>,<Button type="link" onClick={this.pass.bind(this,item.id)}>通过审核</Button>]}>
                            <List.Item.Meta title={(
                                <div>
                                    章节名称：{item.name} <Badge status={this.getStatus(item.status)} text={this.setText(item.status)} />
                                </div>
                            )
                                } description={(
                                <div>
                                <p>{`修改时间：${common.formateDate(item.gmtModified)}`}</p>
                                <p>{`章节描述：${item.description?item.description:'无'}`}</p>
                                </div>
                                
                            )}  />
                            
                        </List.Item>
                    )}></List>
                </Card>
                <Modal title={`第${this.state.detail.rankIndex}章 ${this.state.detail.name}`} closable style={{ minHeight: '500px' }} visible={this.state.showVisible} footer={null} onCancel={this.closeDetail}>
                    <div className="rank"></div>
                    <p>主要内容：</p>
                    <div className="content" style={{minHeight:'70px',marginBottom:"10px",backgroundColor:'rgba(185, 177, 177, 0.349)',fontSize:'18px',padding:'10px'}}>{this.state.detail.content}</div>
                    <p>尾语：</p>
                    <div className="tail" style={{marginBottom:"10px"}}>{this.state.detail.tailNote}</div>
                    <div className="words" style={{float:'right'}}>总字数:{this.state.detail.totalWords}</div>
                </Modal>

            </div>
         );
    }
}
 
export default ChapterControl;