import React, { Component } from 'react';
import Axios from './../../axios/index'
import {Card,Table,Button,Modal,Input,Form,Drawer,Alert,Tree} from 'antd'
import common from './../../common'
class RoleManage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addVisible:false,
            modifyVisible:false,
            modifyId:"",
            selectedKeys:[],
            permissionSelectedKeys:[],
            permissionVisible:false,
            selectRoleId:"",
            menuVisible:false,
            checkedKeys:[]
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
            url:`/admin/role/page/${_this.nowPage}/5`,
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
        this.addRef.current.resetFields();
    }
    add=()=>{
        this.setState({
            addVisible:true
        })
    }
    addFinish=(values)=>{
         Axios.post({
             url:"/admin/role",
             data:{
                 params:{
                     "remark":values.remark,
                     "roleName":values.roleName,
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
                remark: row.remark,
                roleName: row.roleName,
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
            url:"/admin/role",
            data:{
                params:{
                    "id":this.state.modifyId,
                    "roleName":values.roleName,
                    "remark":values.remark,
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
              url:`/admin/role/${row.id}`,
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
                content: "请至少选择一位要操作的角色！"
            })
        }else{
            Axios.delete({
                url:`/admin/role/batch/${_this.state.selectedKeys.join(",")}`,
                data:{
                    service:4
                }
            }).then(res=>{
                _this.request()
            })
        }
        
    }
    // 根据角色获得权限
    showPermission=(row)=>{
          this.setState({
            permissionVisible:true,
            selectRoleId:row.id
          })
          Axios.get({
            url:`/admin/permission/by_role/${row.id}`,
            data:{
                service:4,
                showLoading:true
            }
        }).then(res=>{
           
            let list = res.data.allPermissionList.map(item => {
                item.key = item.id;
                return item;
            })
            
          
            this.setState({
                permissionList: list,
                permissionSelectedKeys: res.data.assignPermissionList
            })
        })
    }
    handlePermissionCancel=()=>{
        this.setState({
            permissionVisible:false
          })
    }
    // 修改权限
    modifyPermission=()=>{
        Axios.post({
            url:"/admin/permission/assign",
            data:{
                service:4,
                params:{
                    "id":this.state.selectRoleId,
                    "permissionOrMenuList":this.state.permissionSelectedKeys
                }
            }
        }).then(res=>{
            this.setState({
                permissionVisible:false
            })
        })
    }
    showMenu=async(row)=>{
        await Axios.get({
            url:`/admin/menu/${row.id}`,
            data:{
                service:4,
                showLoading:true
            }
        }).then(res=>{
            this.setState({
                treeData:res.data.allMenuList,
                checkedKeys:res.data.assignMenuList,

            })
        })
        this.setState({
            menuVisible:true,
            selectMenuId:row.id,
           
        })
        
    }
    modifyMenu=()=>{
        Axios.post({
            url:"/admin/menu/assign",
            data:{
                service:4,
                params:{
                    "id":this.state.selectMenuId,
                    "permissionOrMenuList":[...new Set(this.state.checkedKeys.checked)]
                }
            }
        }).then(res=>{
            this.setState({
                menuVisible:false,
            })
        })
    }
    handleMenuCancel=()=>{
        this.setState({
            menuVisible:false,
            refresh:false
        })
    }
     onCheck = (checkedKeys) => {
    console.log(checkedKeys)
    this.setState({
      checkedKeys:checkedKeys
    })
};
    render() { 
        const columns=[
            {
                title:"角色名",
                dataIndex:"roleName"
            },
            {
                title:"备注",
                dataIndex:"remark"
            },
            {
                title: '操作',
                dataIndex: '',
                render: (row) => {
                    return <span><Button type="link" onClick={this.openModifyPage.bind(this, row)}>修改</Button>
                    <Button type="link" onClick={this.singleDelete.bind(this, row)}>删除</Button>
                    <Button type="link" onClick={this.showPermission.bind(this, row)}>修改权限</Button>
                    <Button type="link" onClick={this.showMenu.bind(this, row)}>修改菜单</Button></span>
                },
            }
        
        ]
        const permissionColumns=[
            {
                title:"权限名",
                dataIndex:"name"
            },
            {
                title:"权限值",
                dataIndex:"permissionValue"
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
        const selected=this.state.permissionSelectedKeys
       
        const permissionSelection = {
            // 设置默认选中
            selectedRowKeys:selected,
            onChange: async(selectedRowKeys, selectedRows) => {
                let list = await selectedRowKeys.map(item => item);
            //    setState是异步的
                this.setState({
                    permissionSelectedKeys: list,
                })
            }
        };
        return ( 
            <div>
              <Card title="角色管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
              <Button type="primary" onClick={this.add}>添加角色</Button>
              <Button type="primary" onClick={this.delete}>批量删除</Button>
                 <Table
                  rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                  bordered columns={columns} dataSource={this.state.list} pagination={this.state.pagination} />
              </Card>
              <Modal title="添加角色" visible={this.state.addVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.addRef} onFinish={this.addFinish}

                    >
                        <FormItem label="角色名" name="roleName" rules={[
                            {
                                required: true,
                                message: "请输入角色名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="备注" name="remark"><Input /></FormItem>
                        
                        <div className="formButtonGroup">
                            <Button onClick={this.handleCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>

                        </div>

                    </Form>
                </Modal>
                <Drawer
                    title="修改角色信息"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleModifyCancel}
                    visible={this.state.modifyVisible}
                >
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}
                    >
                        <FormItem label="角色名" name="roleName" rules={[
                            {
                                required: true,
                                message: "请输入角色名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="备注" name="remark"><Input /></FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.handleModifyCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>
                        </div>

                    </Form>
                </Drawer>
                <Drawer title="角色权限"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handlePermissionCancel}
                    visible={this.state.permissionVisible}
                    zIndex={0}
                   >
                 <Table columns={permissionColumns} dataSource={this.state.permissionList}
                 rowSelection={{
                            type: "checkbox",
                            ...permissionSelection,
  
                        }} pagination={false} />
                <Button type="primary" style={{float:"right",marginTop:"20px"}} onClick={this.modifyPermission}>确认修改</Button>
                
                </Drawer>
                <Drawer title="菜单权限"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.handleMenuCancel}
                    visible={this.state.menuVisible}>
<Alert message="记得选择父选项以显示" type="success" />
    <Tree
      checkable
      checkStrictly
      // onExpand={onExpand}
      // expandedKeys={expandedKeys}
      // autoExpandParent={autoExpandParent}
      onCheck={this.onCheck}
      checkedKeys={this.state.checkedKeys}
      treeData={this.state.treeData}
    />
                <Button type="primary" style={{float:"right",marginTop:"20px"}} onClick={this.modifyMenu}>确认修改</Button>
                </Drawer>
            </div>
         );
    }
}


  
  export default RoleManage;