import React, { Component } from 'react';
import ImageCode from './../../components/verify'
import { Button, Divider, Form, Input, Row, Col } from 'antd';
import './index.css'
import Axios from './../../axios';
import cookie from 'js-cookie'
import { createFromIconfontCN } from '@ant-design/icons';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            url: `/register/1.jpg`,
            mobile:"",
            password:"",
            token:""
         }
    }
    loginRef=React.createRef();
    showWrap = () => {
        let box = document.querySelector(".login-wrap div")
        box.classList.add("login-container")
    }
    finishLogin=(values)=>{
        this.onReload();
        let box = document.querySelector(".loginVerify");
        box.style.display="block"
        this.setState({
            mobile:values.mobile,
            password:values.password
        })
    }
    onCancel = () => {

        let box = document.querySelector(".loginVerify");
        box.style.display = "none"

    }
    count = 1;
    onReload = () => {
        this.count++;
        if (this.count >= 25) {
            this.count = this.count % 25;
        }
        this.setState({
            url: `/register/${++this.count}.jpg`
        })
    }
    onMatch=async()=>{
        this.onCancel();
        await Axios.post({
            url:"/member/sign_in",
            data:{
                service:4,
                params:{
                   mobile:this.state.mobile,
                   password:this.state.password
                }
            }
        }).then(res=>{
            this.setState({
                token:res.data.token
            })
            cookie.set('login_cookie',res.data.token,{domain:'localhost'})
        })
        Axios.get({
            url:"/sso/member/member/info",
            data:{
                service:4,
                showLoading:true
            }
        }).then(res=>{
            cookie.set('usr_infor',res.data,{domain:'localhost'})
        })
    }
    wxLogin=async()=>{
        // await Axios.get({
        //     url:"/api/ucenter/wx/sign_in",
        //     data:{
        //         service:4
        //     } 
        // }).then(res=>{
        //    window.location.href='/'
        // })
        window.location.href='https://open.weixin.qq.com/connect/qrconnect?appid=wxed9954c01bb89b47&redirect_uri=http%3A%2F%2Fguli.shop%2Fapi%2Fucenter%2Fwx%2Fcallback&response_type=code&scope=snsapi_login&state=fq_blog#wechat_redirect'

    }
    qqLogin=()=>{

    }
    render() { 
        const FormItem = Form.Item;
        const IconFont = createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_1763214_7mic524ye5.js',
          });
        return ( 
            <div className="login-wrap clearfix" >
                <div>
                    <Row>
                        <Col xs={0} sm={0} md={2} lg={6} xl={6}></Col>
                        <Col xs={24} sm={24} md={20} lg={12} xl={12}>

                            <div className="loginCard">
                                <div className="mainText">
                                    <Divider><h1>登录</h1></Divider>
                                    <div className="formList">
                                        <Form name="control-ref" ref={this.loginRef} onFinish={this.finishLogin}>
                                            <FormItem name="mobile" rules={[{
                                                required: true,
                                                message: "请输入手机号呀~"
                                            }]}>
                                                <Input placeholder="输入手机号码" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="password" rules={[
                                                {
                                                    required: true,
                                                    message: "你忘记输密码啦~"
                                                }]}>
                                                    <Input.Password placeholder="请输入密码" onFocus={this.showWrap} size="large"/>
                                            </FormItem>
                                            <Button  type="primary" htmlType="submit">登录</Button>
                                            <Button style={{float:"right"}} type="link" href="/#/register" >去注册</Button>
                                            <div className="thirdLogin">
                                            <span style={{fontSize:"15px",color:"#fff"}}>其他登录方式</span>
                                            <IconFont style={{marginLeft:"10px"}} type="icon-qq" onClick={this.qqLogin} />
                                            <IconFont style={{marginLeft:"10px"}} type="icon-weixin" onClick={this.wxLogin} />

                                            </div>
                                           
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            <div className="loginVerify" style={{ display: "none" }}>
                                <ImageCode
                                    imageUrl={this.state.url}
                                    onReload={this.onReload}
                                    onMatch={this.onMatch}
                                    onCancel={this.onCancel}
                                /></div>
                        </Col>
                    </Row>
                </div>
            </div>
         );
    }
}

export default Login;