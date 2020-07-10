import React, { Component } from 'react';
import Axios from './../../axios/index'
import {Card,Table,Button,Modal,Input,Form,Drawer} from 'antd'
import common from './../../common'

class PermissionManage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addVisible:false,
            modifyVisible:false,
            modifyId:"",
            selectedKeys:[]
         }
    }
    componentDidMount(){
this.request()
    }
    nowPage=1
    addRef=React.createRef()
    modifyRef=React.createRef()
    request=()=>{
        let _this=this
        Axios.get({
            url:`/admin/permission/page/${_this.nowPage}/5`,
            data:{
                service:4,
                showLoding:false
            }
        }).then(res=>{
            let list = res.data.list.map(item => {
                item.key = item.id;
                return item;
            })
            this.setState({
                list: list,
                pagination: common.pagination(res, (current) => {
                    _this.nowPage = current;
                    _this.request();
                }),
            })
        })
    }
    // 添加
    handleCancel=()=>{
        this.setState({
            addVisible:false
        })
        this.addRef.current.resetFields();
    }
    add=()=>{
        this.setState({
            addVisible:true
        })
    }
    addFinish=(values)=>{
         Axios.post({
             url:"/admin/permission",
             data:{
                 params:{
                     "name":values.name,
                     "permissionValue":values.permissionValue,
                 },
                 service:4
             }
         }).then(res=>{
             this.request();
             this.setState({
                addVisible:false
            })
            this.addRef.current.resetFields();
         })
    }
    // 修改
    openModifyPage=(row)=>{
        this.setState({
            modifyVisible:true,
            modifyId:row.id
        })
        setTimeout(() => {
            this.modifyRef.current.setFieldsValue({
                name: row.name,
                permissionValue: row.permissionValue,
            })
        }, 200)
    }
    handleModifyCancel=()=>{
        this.setState({
            modifyVisible:false,
            modifyId:""
        })
        this.modifyRef.current.resetFields()
    }
    modifyFinish=(values)=>{
        Axios.put({
            url:"/admin/permission",
            data:{
                params:{
                    "id":this.state.modifyId,
                    "permissionValue":values.permissionValue,
                    "name":values.name,
                },
                service:4
            }
        }).then(res=>{
            this.request();
            this.setState({
                modifyVisible:false,
                modifyId:""
            })
            this.modifyRef.current.resetFields()
        })
    }
    // 删除
    singleDelete=(row)=>{
          Axios.delete({
              url:`/admin/permission/${row.id}`,
              data:{
                  service:4
              }
          }).then(res=>{
              this.request()
          })
    }
   
    render() { 
        const columns=[
            {
                title:"权限名",
                dataIndex:"name"
            },
            {
                title:"权限值",
                dataIndex:"permissionValue"
            },
            {
                title: '操作',
                dataIndex: '',
                render: (row) => {
                    return <span><Button type="link" onClick={this.openModifyPage.bind(this, row)}>修改</Button>
                    <Button type="link" onClick={this.singleDelete.bind(this, row)}>删除</Button></span>
                },
            }
        
        ]
        const FormItem=Form.Item;
        const layout = {
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 20,
            },
        };
       
        return ( 
            <div>
              <Card title="权限管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
              <Button type="primary" onClick={this.add}>添加权限</Button>
                 <Table
                 
                  bordered columns={columns} dataSource={this.state.list} pagination={this.state.pagination} />
              </Card>
              <Modal title="添加权限" visible={this.state.addVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.addRef} onFinish={this.addFinish}

                    >
                        <FormItem label="权限名" name="name" rules={[
                            {
                                required: true,
                                message: "请输入权限名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="权限值" name="permissionValue" 
                         rules={[
                            {
                                required: true,
                                message: "请输入权限值"
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
                    title="修改权限信息"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleModifyCancel}
                    visible={this.state.modifyVisible}
                >
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}
                    >
                        <FormItem label="权限名" name="name" rules={[
                            {
                                required: true,
                                message: "请输入权限名"
                            }
                        ]}><Input /></FormItem>
                        
                        <FormItem label="权限值" name="permissionValue"
                         rules={[
                            {
                                required: true,
                                message: "请输入权限值"
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