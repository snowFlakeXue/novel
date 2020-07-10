import React, { Component } from 'react';
import { Button, Divider, Form, Input, Row, Col } from 'antd';
import './index.css'
import Axios from './../../axios';
import cookie from 'js-cookie'
class BackbackLogin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }
    backLoginRef=React.createRef();
    showWrap = () => {
        let box = document.querySelector(".backLogin-wrap div")
        box.classList.add("backLogin-container")
    }
    finishbackLogin=async(values)=>{
        await Axios.post({
            url:"/login",
            data:{
                service:4,
                params:{
                   account:values.account,
                   password:values.password
                }
            }
        }).then(res=>{
            console.log(res.data.token)
            cookie.set('Authorization',res.data.token,{domain:'localhost'})
        })
        await Axios.get({
            url:"/admin/info",
            data:{
                service:4,
                showLoading:true
            }
        }).then(res=>{
            console.log(res)
            cookie.set('admin_info',res.data,{domain:'localhost'})
        })
        window.location.href="/#/acl/home"
    }
    

    render() { 
        const FormItem = Form.Item;
        return ( 
            <div className="backLogin-wrap clearfix" >
                <div>
                    <Row>
                        <Col xs={0} sm={0} md={2} lg={6} xl={6}></Col>
                        <Col xs={24} sm={24} md={20} lg={12} xl={12}>

                            <div className="backLoginCard">
                                <div className="mainText">
                                    <Divider><h1>后台登录</h1></Divider>
                                    <div className="formList">
                                        <Form name="control-ref" ref={this.backLoginRef} onFinish={this.finishbackLogin}>
                                            <FormItem name="account" rules={[{
                                                required: true,
                                                message: "请输入账户名"
                                            }]}>
                                                <Input placeholder="输入账户名" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="password" rules={[
                                                {
                                                    required: true,
                                                    message: "你忘记输密码啦~"
                                                }]}>
                                                    <Input.Password placeholder="请输入密码" onFocus={this.showWrap} size="large"/>
                                            </FormItem>
                                            <Button  type="primary" htmlType="submit">登录</Button>
                                           
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
         );
    }
}

export default BackbackLogin;