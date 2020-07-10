import React, { Component } from 'react';
import Axios from './../../axios'
import { Table, Avatar, Button, Card, Modal, Form, Input, Drawer, InputNumber,Alert } from 'antd';
import common from './../../common'
import { UserOutlined } from '@ant-design/icons';
import SinglePic from './../../common/singlePic'
import { connect } from 'react-redux'
import {removePic} from './../../redux/action'
class AuthorManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pagination: {},
            selectedKeys: [],
            addVisible: false,
            modifyVisible: false,
            modifyInfo: {},
            modifyId: "",
            filterVisible: false
        }
    }
    nowPage = 1;
    addRef = React.createRef();
    modifyRef = React.createRef();
    filterRef = React.createRef();
    componentDidMount() {
        this.request();
    }
    request = () => {
        let _this = this
        Axios.get({
            url: `/admin/author/page`,
            data: {
                showLoading: true,
                service:1,
                params:{
                    limit:5,
                    current:this.nowPage
                }
            }
        }).then(res => {
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
    // 删除作者
    delete = () => {
        let _this = this;
        if (this.state.selectedKeys.length === 0) {
            Modal.info({
                title: "提示",
                content: "请至少选择一位要操作的作者！"
            })
        } else {
            let list = [...this.state.selectedKeys];
            list.forEach(item => {
                Axios.delete({
                    url: `/admin/author/${item}`,
                    data:{
                        service:1
                    }
                }).then(res => {
                    _this.request();
                })
            })
            list.length = 0;
            _this.setState({
                selectedKeys: list
            })

        }


    }
    // 添加作者
    add = () => {
        this.setState({
            addVisible: true
        })
        
    }
    handleCancel = (e) => {
        this.setState({
            addVisible: false
        })
        this.addRef.current.resetFields()
        this.props.remove();
    }
    addFinish = (values) => {
        Axios.post({
            url: "/admin/author",
            data: {
                params: {
                    "avatar": this.props.imgUrl,
                    "intro": values.intro,
                    "motto": values.motto,
                    "name": values.name
                },
                service:1
            }
        })
        this.setState({
            addVisible: false
        })
        this.props.remove();
        this.addRef.current.resetFields()

    }
    // 修改
    onClose = () => {
        this.setState({
            modifyVisible: false
        })
    }
    handleModifyCancel = () => {
        this.setState({
            modifyVisible: false
        })
    }
    openModifyPage(row) {
        this.setState({
            modifyVisible: true,
            modifyId: row.id
        })
        // setFieldsValue只能在表单已经显示的情况下才能用
        setTimeout(() => {
            this.modifyRef.current.setFieldsValue({
                name: row.name,
                intro: row.intro,
                motto: row.motto,
            })
        }, 200)
       
    }
    modifyFinish = (value) => {
        let _this = this;
        Axios.put({
            url: "/admin/author",
            data: {
                params: {
                    "avatar": this.props.imgUrl,
                    "id": this.state.modifyId,
                    "intro": value.intro,
                    "motto": value.motto,
                    "name": value.name
                },
                service:1
            }

        }).then(res => {
            _this.request();
            this.setState({
                modifyVisible: false,
                modifyId: ""
            })
        })
        this.props.remove();

    }
    // 筛选
    onfilterClose = () => {
        this.setState({
            filterVisible: false
        })
        this.filterRef.current.resetFields();
    }
    filter = () => {
        this.setState({
            filterVisible: true
        })
    }
    filterFinish = (value) => {
        let _this = this;
        Axios.get({
            url: `/admin/author/page`,
            data: {
                params: {
                    "penName": value.name,
                    "minLevel": value.minLevel,
                    "maxLevel": value.maxLevel,
                    limit:5,
                    current:this.nowPage
                },
                service:1,
                showLoading:false
            }
        }).then(res => {
            console.log(res)
            let list = res.data.list.map(item => {
                item.key = item.id;
                return item;
            })
            this.setState({
                list: list,
                pagination: common.pagination(res, (current) => {
                    _this.nowPage = current;
                    _this.filterFinish();
                }),
                filterVisible: false
            })
        })
        this.filterRef.current.resetFields();
    }
    handleFilterCancel = () => {
        this.setState({
            filterVisible: false
        })
    }
    reset = () => {
        this.request();
    }
    render() {
        const FormItem = Form.Item;
        const layout = {
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 20,
            },
        };
        const columns = [
            {
                title: "笔名",
                dataIndex: 'penName'
            },
            {
                title: "头像",
                dataIndex: 'avatar',
                render: (avatar) => {
                    return (avatar ? <Avatar src={avatar} /> : <Avatar style={{ backgroundColor: "#87e8de" }} icon={<UserOutlined />} />)
                }

            },
            {
                title: "级别",
                dataIndex: 'level',
            },
            {
                title:'性别',
                dataIndex:'sex',
                render:(sex)=> {
                    if(sex===0){
                        return '男'
                    }else if(sex==='女'){
                        return '女'
                    }else{
                        return '未知'
                    }
                }
            },
            {
                title:'电话',
                dataIndex:'mobile',
                render:(mobile)=> common.resetPhone(mobile)
            },
            {
                title: '操作',
                dataIndex: '',
                render: (text, row, index) => {
                    return <Button type="link" onClick={this.openModifyPage.bind(this, row)}>修改</Button>
                },
            },
        ]
        // const rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         let list = selectedRowKeys.map(item => item);
        //         this.setState({
        //             selectedKeys: list,
        //         })
        //     }
        // };
        return (
            <div>
                <Card title="作者管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
                    <Alert type='info' closable showIcon message='提示' description="请谨慎操作，尤其是批量删除操作！删除后将无法找回！" />
                    <div style={{marginTop:'30px',marginBottom:'30px'}}>
                    {/* <Button type="primary" onClick={this.delete}>批量删除</Button> */}
                    {/* <Button type="primary" onClick={this.add}>添加作者</Button> */}
                    <Button type="primary" onClick={this.filter}>筛选作者</Button>
                    <Button onClick={this.reset}>重置列表</Button>

                    </div>
                    
                    <Table
                        // rowSelection={{
                        //     type: "checkbox",
                        //     ...rowSelection,
                        // }}
                        columns={columns} dataSource={this.state.list} bordered pagination={this.state.pagination} />
                </Card>
                <Modal title="添加作者" visible={this.state.addVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.addRef} onFinish={this.addFinish}

                    >
                      <SinglePic />
                        
                        <FormItem label="笔名" name="penName" rules={[
                            {
                                required: true,
                                message: "请输入姓名"
                            }
                        ]}><Input /></FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.handleCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>

                        </div>

                    </Form>
                </Modal>
                <Drawer
                    title="修改作者信息"
                    placement="left"
                    closable={true}
                    width={440}
                    onClose={this.onClose}
                    visible={this.state.modifyVisible}
                >
                    <Form layout="horizontal" {...layout} name="control-ref"
                        ref={this.modifyRef} onFinish={this.modifyFinish}
                    >
                        <SinglePic  />
                        <FormItem label="姓名" name="name" rules={[
                            {
                                required: true,
                                message: "请输入姓名"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="职业" name="intro" rules={[
                            {
                                required: true,
                                message: "请输入职业"
                            }
                        ]}><Input /></FormItem>
                        <FormItem label="座右铭" name="motto" rules={[
                            {
                                required: true,
                                message: "请输入座右铭"
                            }
                        ]}><Input /></FormItem>
                        <div className="formButtonGroup">
                            <Button onClick={this.handleModifyCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>

                        </div>

                    </Form>
                </Drawer>
                <Drawer
                    title="筛选作者"
                    placement="top"
                    closable={true}
                    height={180}
                    onClose={this.onfilterClose}
                    visible={this.state.filterVisible}
                >
                    <Form layout="inline" name="control-ref"
                        ref={this.filterRef} onFinish={this.filterFinish}
                    >

                        <FormItem label="姓名" name="name"><Input /></FormItem>
                        <FormItem label="最高等级" name="maxLevel"><InputNumber min={0} /></FormItem>
                        <FormItem label="最低等级" name="minLevel"><InputNumber min={0} /></FormItem>
                        <div>
                            <Button onClick={this.handleFilterCancel}>取消</Button>
                            <Button type="primary" htmlType="submit">筛选</Button>

                        </div>

                    </Form>
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
export default connect(mapStateToProps,dispatchToProps)(AuthorManagement);