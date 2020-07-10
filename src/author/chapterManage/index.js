import React, { Component } from 'react';
import axios from './../../axios'
import common from './../../common/index'
import {Table, Button,Modal} from 'antd' 
import {getChapterId,setDraft} from './../../redux/action'
import {connect} from 'react-redux'
class ChapterManage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            list:[],
            visible:false
         }
    }
    nowPage=1
    componentWillMount=()=>{
        this.request();
    }
    request=()=>{
        axios.get({
            url:`/admin/chapter/chapter_list/${this.props.match.params.id}/1/5`,
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            let list = res.data.list.map(item => {
                item.key = item.id;
                return item;
            })
            this.setState({
                list: list,
                pagination: common.pagination(res, (current) => {
                    this.nowPage = current;
                    this.request();
                }),
            })
        })
    }
    show=(row)=>{
        axios.get({
            url:`/admin/chapter/detail/${row.id}`,
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            console.log(res)
            this.setState({
                title:res.data.name,
                content:res.data.content
            })
        })
        this.setState({
            visible:true
        })
    }
    handleCancel= ()=>{
        this.setState({
            visible:false
        })
       
    }
    
    modify=(row)=>{
        this.props.getId(row.id);
        this.props.setDraft(0)
    }
    
    render() { 
        const columns = [
              {
                  title:"章节名称",
                  dataIndex:"name"
              },
              {
                title:"字数",
                dataIndex:"totalWords"
            },
            {
                title:"更新时间",
                dataIndex:"gmtModified",
                render:(gmtModified) => common.formateDate(gmtModified)
            },
            {
                title:"状态",
                dataIndex:"status",
                render:(status) => status?"审核中":"驳回"
            },
            {
                title:"操作",
                dataIndex: "",
                render:(row)=>{
                    return (
                        <div className="buttonLink">
                          <Button type="link" onClick={this.show.bind(this,row)}>预览</Button>
                          <Button type="link" onClick={this.modify.bind(this,row)} href={`/#/author/book-info/upload-chapter/${this.props.match.params.id}`}>修改</Button>
                        </div>
                        
                    )
                }
            }
        ]
        return ( 
            <div>
                <Table pagination={this.state.pagination} dataSource={this.state.list} columns={columns} />
                <Modal title={this.state.title} visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}>
                        {this.state.content}
                    </Modal>
            </div>
         );
    }
}
const mapStatetoProp = (state) => {
    return {
      chapterId: state.chapterId,
      isDraft:state.isDraft
    }
  }
  const dispatchToProps = (dispatch) => {
    return {
      getId(e) {
        let action = getChapterId(e)
        return dispatch(action)
      },
      setDraft(e){
        let action = setDraft(e)
        return dispatch(action)
      }
    }
  }
  export default connect(mapStatetoProp, dispatchToProps)(ChapterManage)
