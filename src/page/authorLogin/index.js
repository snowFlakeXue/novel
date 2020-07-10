import React, { Component } from 'react';
import { Button, Divider, Form, Input, Row, Col } from 'antd';
import './index.css'
import Axios from './../../axios';
import cookie from 'js-cookie'
class AuthorLogin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }
    authorLoginRef=React.createRef();
    showWrap = () => {
        let box = document.querySelector(".authorLogin-wrap div")
        box.classList.add("authorLogin-container")
    }
    finishauthorLogin=async(values)=>{
        await Axios.post({
            url:"/login",
            data:{
                service:7,
                params:{
                   mobile:values.account,
                   password:values.password
                }
            }
        }).then(res=>{
            cookie.set('Authorization',res.data.token,{domain:'localhost'})
        })
        await Axios.get({
            url:"/admin/info",
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            console.log(res)
            cookie.set('author_info',res.data,{domain:'localhost'})
        })
        window.location.href="/#/author/index"
        console.log(cookie.get('author_info'))
    }
    

    render() { 
        const FormItem = Form.Item;
        return ( 
            <div className="authorLogin-wrap clearfix" >
                <div>
                    <Row>
                        <Col xs={0} sm={0} md={2} lg={6} xl={6}></Col>
                        <Col xs={24} sm={24} md={20} lg={12} xl={12}>

                            <div className="authorLoginCard">
                                <div className="mainText">
                                    <Divider><h1>作者登录</h1></Divider>
                                    <div className="formList">
                                        <Form name="control-ref" ref={this.authorLoginRef} onFinish={this.finishauthorLogin}>
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

export default AuthorLogin;