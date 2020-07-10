import React, { Component } from 'react';
import { Button, Card, Modal, Form, Select, Input, TreeSelect,Alert } from 'antd'
import Axios from './../../axios'
import './index.css'
class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childList: [],
            list: [],
            inner: "",
            addVisible: false,
            modifyVisible: false
        }
    }
    componentDidMount = () => {
        this.getTree();
    }
    addRef = React.createRef();
    modifyRef = React.createRef()
    request = async () => {
        await Axios.get(
            {
                url: "/admin/category/all",
                data: {
                    service: 1,
                    showLoading:true
                }

            }
        ).then(res => {
            console.log(res)
            this.setState({
                list: res.data
            });
        })


    }
    getElemByPid = async (id) => {
        let list = this.state.list.filter(item => {
            return item.parentId === id;
        })
        this.setState({
            childList: list
        })
    }
    renderList = async () => {
        let inner = `<ul>`;
        this.state.childList && this.state.childList.forEach(item => {
            // 下面这两步一定要拿出来写
            this.getElemByPid(item.id)
            this.renderList()
            inner += `
              <li>
              <p>${item.title}</p>
                ${this.state.inner} 
              </li>
            `
        })
        inner += `</ul>`
        this.setState({
            inner: inner
        })
        return inner;
    }
    getTree = async () => {
        await this.request()
        let tree = document.querySelector(".categoryList");
        await this.getElemByPid("0");
        await this.renderList();
        tree.innerHTML = this.state.inner;
        let lists = document.querySelectorAll(".categoryList p");
        lists.forEach(item => {
            item.onclick = () => {
                item.nextElementSibling.classList.toggle("show");
            }
        })
    }
    // 添加分类
    add = () => {
        this.getParent()
        this.setState({
            addVisible: true
        })
    }
    addClose = () => {
        this.setState({
            addVisible: false
        })
        this.addRef.current.resetFields();
    }
    getParent = () => {
        const { Option } = Select;
        Axios.get({
            url: "/admin/category/parents",
            data: {
                service: 1,
                showLoading:true
            }
        }).then(res => {
            this.setState({
                parentList: res.data.map(item => {
                    return (<Option value={item.id} key={item.id}>{item.title}</Option>)
                })
            })
        })
    }
    addFinish = (values) => {
        Axios.post({
            url: "/admin/category",
            data: {
                service: 1,
                params: {
                    parentId: values.parentCategory === "无" ? "0" : values.parentCategory,
                    title: values.title
                }
            }
        }).then(res => {
            // 放出去就不生效了
            this.getTree();
        })
        this.addRef.current.resetFields();
        this.setState({
            addVisible: false
        })
    }
    // 修改
    modify = () => {
        Axios.get({
            url:"/admin/category/all",
            data:{
                service:1,
                showLoading:true
            }
        }).then(res=>{
            const {Option}=Select
            this.setState({
                selectList:res.data.map(item=>{
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                })
                
            })
        })
        this.setState({
            modifyVisible: true
        })
    }
    modifyClose = () => {
        this.setState({
            modifyVisible: false
        })
        this.modifyRef.current.resetFields();
    }
    modifyFinish = async(values) => {
        await Axios.get({
            url:"/admin/category/all",
            data:{
                service:1,
                showLoading:true
            }
        }).then(res=>{
            for(let i=0;i<res.data.length;i++){
                if(values.id===res.data[i].id){
                    this.setState({
                        modifyParent:res.data[i].parentId
                    })
                }
            }
        })
       
        
        Axios.put({
            url:"/admin/category",
            data:{
                service:1,
                params:{
                    id:values.selected,
                    parentId:this.state.modifyParent,
                    title:values.title
                }
            }
        }).then(res=>{
            this.getTree();
        })
        this.setState({
            modifyVisible: false
        })
        this.modifyRef.current.resetFields();
    }
    render() {
        const FormItem = Form.Item;
        const { Option } = Select;
        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
        return (
            <div className="category">
                <Card title="分类管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
                <Alert style={{marginTop:'20px',marginBottom:'20px'}} type='info' closable showIcon message='提示' description="下面的分类概览只做展示作用，可在操作后查看是否操作成功" />
                    <Button type="primary" onClick={this.add}>添加分类</Button>
                    <Button type="primary" onClick={this.modify}>修改分类</Button>
                    <h1>分类概览</h1>
                    <div className="categoryList">
                </div>
                </Card>
                
                <Modal title="添加分类" onCancel={this.addClose} footer={null} visible={this.state.addVisible}>
                    <Form {...layout} ref={this.addRef} onFinish={this.addFinish} name="control-ref">
                        <FormItem label="一级分类名称" name="parentCategory" rules={[{
                            required: true,
                            message: "请选择一级分类名称！"
                        }]}>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择所属一级分类"
                                optionFilterProp="children"
                                onChange={this.onAddChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="无">无</Option>
                                {
                                    this.state.parentList
                                }
                            </Select>
                        </FormItem>
                        <FormItem label="分类名称" name="title" rules={[{
                            required: true,
                            message: "请输入添加的分类名称"
                        }]}>
                            <Input placeholder="请输入所添加分类的名称" />
                        </FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.addClose}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>
                        </div>
                    </Form>
                </Modal>
                <Modal visible={this.state.modifyVisible} title="修改分类名称" onCancel={this.modifyClose} footer={null}>
                    <Form {...layout} ref={this.modifyRef} onFinish={this.modifyFinish} name="control-ref">
                        <FormItem name="selected" label="修改前" rules={[{
                            required: true,
                            message: "请选择要修改的分类名称！"
                        }]}>
                            <Select placeholder="请选择分类名称">
                                {
                                    this.state.selectList
                                }
                            </Select>
                        </FormItem>
                        <FormItem name="title" label="修改后" rules={[{
                            required: true,
                            message: "请输入修改后的名称！"
                        }]}>
                            <Input placeholder="请输入修改后的名称" />
                        </FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.modifyClose}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Categories;