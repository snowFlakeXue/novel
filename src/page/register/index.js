import React, { Component } from 'react';
import ImageCode from './../../components/verify'
import { Button, Divider, Form, Input, Checkbox, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.css'
import Axios from './../../axios';
import { Redirect } from 'react-router-dom'
import Pswstrength from './../../components/psw'
class Register extends Component {
    state = {
        url: `/register/1.jpg`,
        submitType: true,
        mobileType: false,
        loginFlag: false,
        strength: "弱",
        color: "rgb(247, 132, 103)",
        middle: "none",
        high: "none",
    }
    componentDidMount() {
    }
    registerRef = React.createRef();
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
    onMatch = () => {
        let _this = this;
        let box = document.querySelector('.veri')
        box.style.display = "none";
        let phone = this.registerRef.current.getFieldValue("mobile");
        let btn = document.querySelector(".addButton")
        if (!/^1[3456789]\d{9}$/.test(phone)) {
            btn.innerHTML = "点击重新获取"
        }
        else {
            Axios.get({
                url: `/msg/send/${phone}`,
                data: {
                    service: 3
                }
            }).then(res => {
                // this.setState({
                //     mobileType: true
                // })
                let item = document.querySelector(".hasMessage")
            item.style.display = "block";
            let btn = document.querySelector(".addButton")
            let count = 60;
            this.setState({
                mobileType:true
            })
            btn.innerHTML = "60s后获取"
            let timer = setInterval(() => {
                --count;
                if (count === -1) {
                    clearInterval(timer)
                    _this.setState({
                        mobileType: false
                    })
                }
                btn.innerHTML = `${count===-1?"点击重新获取":count+"s后获取"}`
            }, 1000);
            })
            
            
            
           
        }
    }
    showWrap = () => {
        let box = document.querySelector(".register-wrap div")
        box.classList.add("register-container")
    }
    checkChange = (e) => {
        this.showWrap();
        if (e.target.checked) {
            this.setState({
                submitType: false
            })
        } else {
            this.setState({
                submitType: true
            })
        }
    }
    getMobile = () => {
        this.onReload();
        this.showWrap();
        let result = this.registerRef.current.getFieldValue("mobile");
        if(!result){
            this.registerRef.current.validateFields(["mobile"])
        }
        else{
            let box = document.querySelector('.veri')
            box.style.display = "block";
        }
    }
    onCancel = () => {

        let box = document.querySelector(".veri");
        box.style.display = "none"

    }
    finishRegister = (values, e) => {
        Axios.post({
            url: "/register",
            data: {
                service: 7,
                params: {
                    code: values.code,
                    mobile: values.mobile,
                    penName: values.penName,
                    password: values.password,
                    idCard:values.idCard,
                    email:values.email
                }
            }
        }).then(res => {
            this.setState({
                loginFlag: true
            })
        })

    }
    showStrength = () => {
        let result = this.registerRef.current.getFieldValue("password");
        var lv = 0;
        if (/{[0-6]}/g.test(result)) { lv = 0; }
        if (/[a-zA-Z]/g.test(result)) { lv++; }
        if (/[0-9]/g.test(result)) { lv++; }
        if (/[#@.-]+/g.test(result)) { lv++; }

        if (lv === 3) {
            this.setState({
                strength: "安全",
                color: "rgb(144, 247, 103)",
                high: "block",
                middle: "block",
            })

        }
        if (lv === 2) {
            this.setState({
                strength: "中",
                color: "rgb(233, 247, 103)",
                middle: "block",
                high: "none",
            })
        }
        if (lv === 1) {
            this.setState({
                strength: "弱",
                color: "rgb(247, 132, 103)",
                middle: "none",
                high: "none",
            })
        }
    }
    render() {
        if (this.state.loginFlag) {
            return <Redirect to='/authorLogin' />
        }
        const FormItem = Form.Item;
        const getVertify = (
            <Button type="primary" className="addButton" onClick={this.getMobile} disabled={this.state.mobileType}>点击获取</Button>
        )
        return (
            <div className="register-wrap clearfix" >
                <div>
                    <Row>
                        <Col xs={0} sm={0} md={2} lg={6} xl={6}></Col>
                        <Col xs={24} sm={24} md={20} lg={12} xl={12}>

                            <div className="registerCard">
                                <div className="mainText">
                                    <Divider><h1>注册</h1></Divider>
                                    <div className="formList">
                                        <Form name="control-ref" ref={this.registerRef} onFinish={this.finishRegister}>
                                            <FormItem name="penName" rules={[{
                                                required: true,
                                                message: "就告诉我你的笔名吧~"
                                            }]}>
                                                <Input prefix={<UserOutlined />} placeholder="笔名" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="password" rules={[
                                                {
                                                    required: true,
                                                    message: "请输入密码~"
                                                },
                                                {
                                                    pattern: /^[0-9a-zA-Z#@.-]{6,16}$/,
                                                    message: "密码格式不规范哦！"
                                                }]}>
                                                <div>
                                                    <Pswstrength
                                                        color={this.state.color}
                                                        strength={this.state.strength}
                                                        high={this.state.high}
                                                        middle={this.state.middle} />
                                                    <Input.Password placeholder="密码(6~16位字符组合)" onFocus={this.showWrap} size="large" onChange={this.showStrength} />

                                                </div>
                                            </FormItem>
                                            <FormItem name="email" rules={[{
                                                required:true,
                                                message:"请输入邮箱"
                                            }]}>
                                                <Input placeholder="请输入邮箱" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="idCard" rules={[{
                                                required:true,
                                                message:"请输入身份证号码"
                                            }]}>
                                                <Input placeholder="请输入身份证号码" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="mobile" rules={[{
                                                required: true,
                                                message: "请输入手机号"
                                            }, {
                                                pattern: /^1[3456789]\d{9}$/,
                                                message: "这不是手机号吧~"
                                            }]}>
                                                <Input addonBefore="中国大陆" placeholder="常用手机号码" onFocus={this.showWrap} size="large" />
                                            </FormItem>
                                            <FormItem name="code" className="modifyBtn" rules={[{
                                                required: true,
                                                message: "请输入验证码"
                                            }]}>
                                                <div>
                                                    <Input disabled={this.state.verify} placeholder="请输入短信验证码" onFocus={this.showWrap} size="large" addonAfter={getVertify} />
                                                    <div className="hasMessage">验证码短信已发出，5分钟内有效，请注意查收</div>

                                                </div>
                                            </FormItem>
                                            <Checkbox onChange={this.checkChange} style={{ color: "#fff" }}>我已同意合理合法使用博客系统</Checkbox>
                                            <div className="largeBtn">
                                                <Button htmlType="submit" type="primary" disabled={this.state.submitType}>注册</Button>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <Button type="link" href="/#/authorLogin">已有账号，直接登录</Button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            <div className="veri" style={{ display: "none" }}>
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
        )
    }
}
export default Register