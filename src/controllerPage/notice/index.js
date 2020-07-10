import React, { Component } from 'react';
import { Card, List, Button, Modal, Drawer,Form,Input } from 'antd'
import axios from './../../axios'
import common from './../../common/index'
import BraftEditor from 'braft-editor'
import * as qiniu from 'qiniu-js'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVisible: false,
            modifyVisible: false,
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(null),
            token: "",
            content:"",
            modifyTitle:"",
            addVisible:false
        }
    }
    componentWillMount() {
        this.request()
    }
    modifyRef=React.createRef();
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
        // const htmlContent = this.state.editorState.toHTML()
    }
    uploadFn = async (param) => {
        await axios.get({
            url: "/token",
            data: {
                service: 6,
                showLoading: true
            }
        }).then(res => {
            this.setState({
                token: res.data
            })
        })
        const putExtra = {
        }
        const config = {
            useCdnDomain: true,
            region: qiniu.region.z2
        };

        const observer = {
            next(res) {
                param.progress(res.loaded / res.total * 100)
            },
            error(err) {
                param.error({
                    msg: err.message
                })
            },
            complete(res) {
                param.success({
                    url: 'http://juetu.francisqiang.top/' + res.key
                })
            }
        }
        qiniu.upload(param.file, Math.round(new Date() / 1000), this.state.token, putExtra, config).subscribe(observer)
    }

    handleCancel = () => {

    }
    request = () => {
        axios.get({
            url: '/admin/notice',
            data: {
                showLoading: true,
                service: 1
            }
        }).then(res => {
            this.setState({
                dataList: res.data
            })
        })
    }
    getDetail = (id) => {
        this.setState({
            showVisible: true
        })
        axios.get({
            url: `/admin/notice/${id}`,
            data: {
                service: 1,
                showLoading: true
            }
        }).then(res => {
            this.setState({
                noticeDetail: res.data.content
            })
        })
    }
    closeDetail = () => {
        this.setState({
            showVisible: false
        })
    }
    modifyNotice = async(id) => {
        
      
            let _this=this;
            await axios.get({
                url:`/admin/notice/${id}`,
                data:{
                    service:1,
                    showLoading:true
                }
            }).then(res=>{
                console.log(res)
                 _this.setState({
                    editorState: BraftEditor.createEditorState(res.data.content),
                    modifyTitle:res.data.title
                 })
            
            
        })
        // ContentUtils.setValue(this.state.editorState)
        this.setState({
            modifyVisible:true,
            modifyId:id
        })
    }
    closeModify=()=>{
        this.setState({
            modifyVisible:false
        })
    }
    modifyFinish=(values)=>{
        console.log(values)
        axios.put({
            url:'/admin/notice',
            data:{
                service:1,
                 params:{
                     id:this.state.modifyId,
                     title:values.title,
                     content:this.state.editorState.toHTML()
                 }
            }
        }).then(res=>{
            this.setState({
                modifyVisible:false
            })
            this.request()
        })
    }
    delete=(id)=>{
        axios.delete({
            url:`/admin/notice/${id}`,
            data:{
                service:1
            }
        }).then(res=>{
            this.request();
        })
    }
    add=()=>{
        this.setState({
            addVisible:true
        })
    }
    addFinish=(values)=>{
        axios.post({
            url:"/admin/notice",
            data:{
                service:1,
                params:{
                        title:values.title,
                        content:this.state.editorState.toHTML()
                
                }
            }
        }).then(res=>{
            this.setState({
                addVisible:false
            })
            this.request();
        })
    }
    closeAdd(){
        this.setState({
            addVisible:false
        })
    }
    render() {
        const { editorState } = this.state
        const layout={
            labelCol: {
                span: 2,
            },
            wrapperCol:{
                span:12
            }
        }
        return (
            <div>
                <Card title="通知管理" hoverable style={{ backgroundColor: 'rgba(255, 192, 203, 0.418)', backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px' }}>
                    <Button type="primary" onClick={this.add}>添加通知</Button>
                    <List itemLayout="horizontal" dataSource={this.state.dataList} renderItem={item => (
                        <List.Item
                            actions={[<Button type="link" onClick={this.modifyNotice.bind(this, item.id)}>更新</Button>, <Button type="link" onClick={this.getDetail.bind(this, item.id)}>获取详情</Button>, <Button type="link" onClick={this.delete.bind(this,item.id)}>删除</Button>]}>
                            <List.Item.Meta title={item.title} description={`更新时间：${common.formateDate(item.gmtModified)}`} />
                        
                        </List.Item>
                    )}></List>
                </Card>
                <Modal title="通知详情" closable style={{ minHeight: '500px' }} visible={this.state.showVisible} footer={null} onCancel={this.closeDetail}>
                   <div dangerouslySetInnerHTML={{ __html: this.state.noticeDetail}}></div>
                </Modal>
                <Drawer placement="left" width={800} title="添加通知" visible={this.state.addVisible} closable onClose={this.closeAdd}>
                    <div className="edit-blog">
                        <div style={{ clear: "both" }}>
                        <Form layout="horizontal" {...layout} name="control-ref"
                            ref={this.addRef} onFinish={this.addFinish}>
                            <Form.Item name="title" label="标题" rules={[{
                                required:true,
                                message:"请输入标题"
                            }]}>
                                <Input defaultValue={this.state.addTitle} />
                            </Form.Item>
                            <BraftEditor
                                value={editorState}
                                onChange={this.handleEditorChange}
                                onSave={this.submitContent}
                                media={{ uploadFn: this.uploadFn }}
                            />
                            <Button type="primary" htmlType="submit">提交</Button>
                        </Form>
                           
                        </div>
                    </div>
                </Drawer>
                <Drawer placement="left" width={800} title="修改通知" visible={this.state.modifyVisible} closable onClose={this.closeModify}>

                    <div className="edit-blog">
                        <div style={{ clear: "both" }}>
                        <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}>
                            <Form.Item name="title" label="标题">
                                <Input defaultValue={this.state.modifyTitle} />
                            </Form.Item>
                            <BraftEditor
                                value={editorState}
                                onChange={this.handleEditorChange}
                                onSave={this.submitContent}
                                media={{ uploadFn: this.uploadFn }}
                            />
                            <Button type="primary" htmlType="submit">提交修改</Button>
                        </Form>
                           
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default Notice;