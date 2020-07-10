import React, { Component } from 'react';
import { Tree, Button, Card, Modal, Input, Form, Drawer,Select } from 'antd'
import Axios from './../../axios/index'
class PermissionManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false,
            modifyVisible: false,
            dataSource: [],
            selected:[],
            parentList:[],
            expandKeys:[]
        }
    }
    addRef = React.createRef()
    modifyRef = React.createRef()

    componentWillMount=()=> {
        
        this.request()
    }

    request = () => {
        console.log(this.state.defaultExpand)
        Axios.get({
            url: "/admin/menu",
            data: {
                service: 4,
                showLoading:true
            }
        }).then(res => {
            this.setState({
                dataSource: res.data,
                
            })
        })
    }
    // 添加
    handleCancel = () => {
        this.setState({
            addVisible: false
        })
        this.addRef.current.resetFields();
    }
    add = () => {
        
        this.setState({
            addVisible: true
        })
    }
    addFinish = (values) => {
        Axios.post({
            url: "/admin/menu",
            data: {
                params: {
                    "name": values.title,
                    "path": values.path,
                    "pid":this.state.selected.length?this.state.selected[0].key:0
                },
                service: 4
            }
        }).then(res => {
            this.request();
            this.setState({
                addVisible: false
            })
            this.addRef.current.resetFields();
        })
    }
    // 修改
    openModifyPage = () => {
        
        if(this.state.selected.length===0){
            Modal.info({
                title: "提示",
                content: "请先选择下面的一级菜单！"
            })
        }else{
            this.setState({
                modifyVisible: true,
               
            })
            setTimeout(() => {
                const { Option } = Select;
                this.modifyRef.current.setFieldsValue({
                    title: this.state.selected[0].title,
                    path: this.state.selected[0].path,
                })
                Axios.get({
                    url: "/admin/menu/list",
                    data: {
                        service: 4,
                        showLoading:true
                    }
                }).then(res => {
                    this.setState({
                        parentList: res.data.map(item => {
                            
                            if(this.state.selected[0].pid===item.id){
                                this.modifyRef.current.setFieldsValue({
                                    pid: item.name
                                })
                            }
                            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                        })
                    })
                })
            }, 200)
        }
       
    }
    handleModifyCancel = () => {
        this.setState({
            modifyVisible: false,
        })
        this.modifyRef.current.resetFields()
    }
    modifyFinish = (values) => {
        Axios.put({
            url: "/admin/menu",
            data: {
                params: {
                    "id": this.state.selected[0].key,
                    "pid": values.pid,
                    "name": values.title,
                    "path":values.path
                },
                service: 4
            }
        }).then(res => {
            this.request();
            this.setState({
                modifyVisible: false,
                modifyId: ""
            })
            this.modifyRef.current.resetFields()
        })
    }
    // 删除
    singleDelete = () => {
        if(this.state.selected.length===0){
            Modal.info({
                title: "提示",
                content: "请先选择下面的一级菜单！"
            })
        }else{
            Axios.delete({
                url: `/admin/menu/${this.state.selected[0].key}`,
                data: {
                    service: 4
                }
            }).then(res => {
                this.setState({
                    selected:[]
                })
                this.request()
            })
        }
       
    }
    onSelect = (selectedKeys, info) => {
        this.setState({
            selected:info.selectedNodes
        })
    };
    render() {

        const FormItem = Form.Item;
        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
       
        return (
            <div>
                <Card title="菜单管理" style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
                    <div style={{marginTop:'20px'}}>
                    <Button type="primary" onClick={this.add}>添加菜单</Button>
                    <Button type="primary" onClick={this.openModifyPage}>修改菜单</Button>
                    <Button type="primary" onClick={this.singleDelete}>删除菜单</Button>
                    </div>
                    <div style={{marginTop:'30px'}}>
                    <Tree
                       treeData={this.state.dataSource}
                       onSelect={this.onSelect}
                   />
                    </div>
                   

                </Card>
                <Modal title="添加菜单" visible={this.state.addVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.addRef} onFinish={this.addFinish}

                    >
                        <FormItem label="菜单名" name="title" rules={[
                            {
                                required: true,
                                message: "请输入菜单名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="路径" name="path"
                            rules={[
                                {
                                    required: true,
                                    message: "路径"
                                }
                            ]}
                        ><Input /></FormItem>

                        <div className="formButtonGroup">
                            <Button onClick={this.handleCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>

                        </div>

                    </Form>
                </Modal>
                <Drawer
                    title="修改菜单信息"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleModifyCancel}
                    visible={this.state.modifyVisible}
                >
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}
                    >
                        <FormItem label="菜单名" name="title" rules={[
                            {
                                required: true,
                                message: "请输入菜单名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="所属上级" name="pid"
                            rules={[
                                {
                                   
                                    message: "请选择所属上级"
                                }
                            ]}><Select>
                                {this.state.parentList}
                            </Select>
                        </FormItem>
                        <FormItem label="路径" name="path"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入路径"
                                }
                            ]}><Input /></FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.handleModifyCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>

                        </div>

                    </Form>
                </Drawer>
            </div>
        );
    }
}

export default PermissionManage;