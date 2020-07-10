import React, { Component } from 'react';
import {Form,Button,Input, Select,Radio} from 'antd'
import axios from './../../axios/index'
import {connect} from 'react-redux'
class UploadChapter extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            maxChapter:1,
            type:0,
            isDraft:false,
            display:"none",
            rules:[{
                required:true,
                message:"请选择！"
            }],
            draft:1
         }
    }
    componentWillMount=()=>{
        if(this.props.isDraft===0){
            this.setState({
                draft:0
            })
        }
        if(this.props.chapterId){
            axios.get({
                url:`/admin/chapter/detail/${this.props.chapterId}`,
                data:{
                    service:7,
                    showLoading:true
                }
            }).then(res=>{
                
                let box = document.querySelector('.select');
                box.style.display="none"
                this.charpterRef.current.setFieldsValue({
                    name:res.data.name,
                    tailNote:res.data.tailNote,
                    content:res.data.content,
                    description:res.data.description
                })
               this.setState({
                   isDraft:true,
                   maxChapter:res.data.rankIndex,
                   chapterType:res.data.type?"序言":"正常",
                   display:"inline",
                   rules:[]
               })
            })
        }else{
            this.request()
        }
        
      
         
    }
    charpterRef=React.createRef()
    request=()=>{
        axios.get({
            url:`/admin/chapter/max_chapter/${this.props.match.params.id}`,
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            if(res.data){
               this.setState({
                   maxChapter:res.data.rankIndex+1
               })
            }
           
        })
    }
    changeChapter=(value)=>{
           if(value!==0){
               let item = document.querySelector('.maxChapter');
               item.style.display="none"
           }else{
            let item = document.querySelector('.maxChapter');
            item.style.display="inline"
           }

           this.setState({
               type:value
           })
    }
    onFinish=(value)=>{
        if(this.props.chapterId){
            axios.put({
                url:`/admin/chapter`,
                data:{
                    service:7,
                    params:{
                    id:this.props.chapterId,
                    name:value.name,
                    rankIndex:this.state.maxChapter,
                    description:value.description,
                    content:value.content,
                    tailNote:value.tailNote
                    }
                }
            }).then(res=>{
                window.location.href=`/#/author/book-info/draft/${this.props.match.params.id}`
                window.scrollTo(0, 0)
            })
        }else{
            axios.post({
                url:`/admin/chapter`,
                data:{
                    service:7,
                    params:{
                        novelId:this.props.match.params.id,
                        name:value.name,
                        rankIndex:this.state.maxChapter,
                        description:value.description,
                        content:value.content,
                        draft:value.draft,
                        type:this.state.type,
                        tailNote:value.tailNote
                    }
                }
            }).then(res=>{
                if(value.draft===1){
                    window.location.href=`/#/author/book-info/draft/${this.props.match.params.id}`
                    window.scrollTo(0, 0)
                }else{
                    window.location.href=`/#/author/book-info/chpater-manage/${this.props.match.params.id}`
                    window.scrollTo(0, 0)
                }
            })
        }
        
    }
    render() { 
        const layout={
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 18,
            },
        }
        return ( 
            <div>
                <Form name="ref-control" ref={this.charpterRef} {...layout} onFinish={this.onFinish} >
                   <Form.Item label="章节序号">
                      <span className="maxChapter" style={{marginRight:"10px"}}>{`第 ${this.state.maxChapter}  章`}</span>
                      <span style={{display:this.state.display}}>{this.state.chapterType}</span>
                      <Select className="select" defaultValue={this.state.type} style={{width: 120}}  onChange={this.changeChapter}>
                          <Select.Option value={0}>正常</Select.Option>
                          <Select.Option value={2}>序言</Select.Option>
                      </Select>
                   </Form.Item>
                   <Form.Item name="name" label="章节名称" rules={[{
                          required:true,
                          message:"请填写章节名称"
                      },{
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){1,20}$",
                        message:"最多可输入20字" 
                      }
                      ]}>
                       <Input placeholder="请输入章节名称，最多20字" />
                   </Form.Item>
                   <Form.Item label="章节概要" name="description" rules={[{
                          required:true,
                          message:"请填写章节概要"
                      },{
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){1,300}$",
                        message:"最多可输入300字" 
                      }
                      ]}>
                       <Input.TextArea placeholder="最多可输入300字" rows={5} />
                   </Form.Item>
                   <Form.Item name="content" label="正文" rules={[{
                          required:true,
                          message:"请填写正文内容"
                      },{
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){10,50000}$",
                        message:"至少输入1000字，最多支持50000字" 
                      }
                      ]}>
                       <Input.TextArea rows={40} />
                   </Form.Item>
                   <Form.Item label="尾语" name="tailNote" rules={[{
                          required:true,
                          message:"请填写尾语"
                      },{
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){1,200}$",
                        message:"最多可输入200字" 
                      }
                      ]}>
                       <Input.TextArea placeholder="读者将会在该章节的末尾看到这段话" rows={5} />
                   </Form.Item>
                   <Form.Item name="draft" label="存为草稿" rules={this.state.rules}>
                      <Radio.Group disabled={this.state.isDraft} defaultValue={this.state.draft}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                      </Radio.Group>
                   </Form.Item>
                   <Button type="primary" htmlType="submit">上传章节</Button>
                </Form>
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
  export default connect(mapStatetoProp)(UploadChapter)
