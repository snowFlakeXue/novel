import React, { Component } from 'react';
import Axios from './../../axios/index'
import {Card,Table,Avatar,Button,Modal,Input,Form,Drawer,Alert} from 'antd'
import { UserOutlined } from '@ant-design/icons';
import common from './../../common'
import SinglePic from './../../common/singlePic'
import { connect } from 'react-redux'
import {removePic} from './../../redux/action'

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addVisible:false,
            modifyVisible:false,
            modifyId:"",
            selectedKeys:[],
            roleVisible:false
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
            url:`/admin/user/page/${_this.nowPage}/10`,
            data:{
                service:4,
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
        this.props.remove();
        this.addRef.current.resetFields();
    }
    add=()=>{
        this.setState({
            addVisible:true
        })
    }
    addFinish=(values)=>{
         Axios.post({
             url:"/admin/user",
             data:{
                 params:{
                     "account":values.account,
                     "password":values.password,
                     "nickName":values.nickName,
                     "avatar":this.props.imgUrl
                 },
                 service:4
             }
         }).then(res=>{
             this.request();
             this.setState({
                addVisible:false
            })
            this.props.remove();
            this.addRef.current.resetFields();
         })
    }
    // 修改
    openModifyPage=(row)=>{
        this.setState({
            modifyVisible:true,
            modifyId:row.id,
            selectedAvatar:row.avatar
        })
        setTimeout(() => {
            this.modifyRef.current.setFieldsValue({
                account: row.account,
                nickName: row.nickName,
            })
        }, 200)
    }
    handleModifyCancel=()=>{
        this.setState({
            modifyVisible:false,
            modifyId:""
        })
        this.props.remove();
        this.modifyRef.current.resetFields()
    }
    modifyFinish=(values)=>{
        Axios.put({
            url:"/admin/user",
            data:{
                params:{
                    "id":this.state.modifyId,
                    "account":values.account,
                    "nickName":values.nickName,
                    "avatar":this.props.imgUrl
                },
                service:4
            }
        }).then(res=>{
            this.request();
            this.setState({
                modifyVisible:false,
                modifyId:""
            })
            this.props.remove();
            this.modifyRef.current.resetFields()
        })
    }
    // 删除
    singleDelete=(row)=>{
          Axios.delete({
              url:`/admin/user/${row.id}`,
              data:{
                  service:4
              }
          }).then(res=>{
              this.request()
          })
    }
    // 批量删除
    delete=()=>{
        let _this=this
        if (this.state.selectedKeys.length === 0) {
            Modal.info({
                title: "提示",
                content: "请至少选择一位要操作的用户！"
            })
        }else{
            Axios.delete({
                url:`/admin/user/batch/${_this.state.selectedKeys.join(",")}`,
                data:{
                    service:4,
                    
                }
            }).then(res=>{
                _this.request()
            })
        }
        
    }
    assignRole=(row)=>{
        this.setState({
            roleVisible:true,
            selectUserId:row.id
          })
          Axios.get({
            url:`/admin/user/role_info/${row.id}`,
            data:{
                service:4,
                showLoading:true
            }
        }).then(res=>{
           console.log(res)
            let list = res.data.allRoles.map(item => {
                item.key = item.id;
                return item;
            })
            
          
            this.setState({
                roleList: list,
                roleSelectedKeys: res.data.assignRoles
            })
        })

    }
    handleRoleCancel=()=>{
        this.setState({
            roleVisible:false
        })
    }
    modifyRole=()=>{
        console.log(this.state.roleSelectedKeys)
        Axios.post({
            url:"/admin/user/assign_role",
            data:{
                service:4,
                params:{
                    "id":this.state.selectUserId,
                    "roleId":this.state.roleSelectedKeys
                }
            }
        }).then(res=>{
            this.setState({
                roleVisible:false
            })
        })
    }
    render() { 
        const columns=[
            {
                title:"账户名",
                dataIndex:"account"
            },
            {
                title:"昵称",
                dataIndex:"nickName"
            },
            {
                title:"头像",
                dataIndex:"avatar",
                render: (avatar) => {
                    return (avatar ? <Avatar src={avatar} /> : <Avatar style={{ backgroundColor: "#87e8de" }} icon={<UserOutlined />} />)
                }

            },
            {
                title: '操作',
                dataIndex: '',
                render: (row) => {
                    return <span><Button type="link" onClick={this.openModifyPage.bind(this, row)}>修改</Button>
                    <Button type="link" onClick={this.singleDelete.bind(this, row)}>删除</Button>
                    <Button type="link" onClick={this.assignRole.bind(this, row)}>分配角色</Button>
                    </span>
                },
            }
        
        ]
        const roleColumns=[
            {
                title:"角色名",
                dataIndex:"roleName"
            },
            {
                title:"备注",
                dataIndex:"remark"
            },
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
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let list = selectedRowKeys.map(item => item);
                this.setState({
                    selectedKeys: list,
                })
            }
        };
        const selected=this.state.roleSelectedKeys
       
        const roleSelection = {
            // 设置默认选中
            selectedRowKeys:selected,
            onChange: async(selectedRowKeys, selectedRows) => {
                let list = await selectedRowKeys.map(item => item);
            //    setState是异步的
                this.setState({
                    roleSelectedKeys: list,
                })
                console.log(selectedRowKeys)
            }
        };
        return ( 
            <div>
              <Card title="用户管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
              <Alert type='info' style={{marginBottom:'20px'}} closable showIcon message='提示' description="请谨慎操作，尤其是批量删除操作！删除后将无法找回！" />

              <Button type="primary" onClick={this.add}>添加用户</Button>
              <Button type="primary" onClick={this.delete}>批量删除</Button>
                 <Table
                  rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                   style={{marginTop:'20px'}}
                  bordered columns={columns} dataSource={this.state.list} pagination={this.state.pagination} />
              </Card>
              <Modal title="添加用户" visible={this.state.addVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.addRef} onFinish={this.addFinish}

                    >
                      <SinglePic />
                        
                        <FormItem label="账户名" name="account" rules={[
                            {
                                required: true,
                                message: "请输入账户名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="密码" name="password" rules={[
                            {
                                required: true,
                                message: "请输入密码"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="昵称" name="nickName" rules={[
                            {
                                required: true,
                                message: "请输入昵称"
                            }
                        ]}><Input /></FormItem>
                       
                        <div className="formButtonGroup">
                            <Button onClick={this.handleCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>

                        </div>

                    </Form>
                </Modal>
                <Drawer
                    title="修改用户信息"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleModifyCancel}
                    visible={this.state.modifyVisible}
                >
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}
                    >
                <FormItem label="原头像" name="avatar" >
                <Avatar shape="square" size={100} src={this.state.selectedAvatar} />

                </FormItem>
                <FormItem label="新头像" name="avatar" >
                     <SinglePic  />
                </FormItem>

                       
                        <FormItem label="账户名" name="account" rules={[
                            {
                                required: true,
                                message: "请输入账户名"
                            }
                        ]}><Input /></FormItem>
                        
                        <FormItem label="昵称" name="nickName" rules={[
                            {
                                required: true,
                                message: "请输入昵称"
                            }
                        ]}><Input /></FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.handleModifyCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>

                        </div>

                    </Form>
                </Drawer>
                <Drawer title="分配角色"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleRoleCancel}
                    visible={this.state.roleVisible}>
                 <Table columns={roleColumns} dataSource={this.state.roleList}
                 rowSelection={{
                            type: "checkbox",
                            ...roleSelection,
  
                        }} pagination={false} />
                <Button type="primary" style={{float:"right",marginTop:"20px"}} onClick={this.modifyRole}>确认修改</Button>
                </Drawer>
            </div>
         );
    }
}
const mapStateToProps = state =>{
    return {
        imgUrl:state.imgUrl,
        imgList:state.imgList,
    }
}
const dispatchToProps = (dispatch) =>{
    return {
      remove(){
          let action=removePic()
         return dispatch(action);
      }
    }
}
export default connect(mapStateToProps,dispatchToProps)(UserManage);