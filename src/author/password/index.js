import React, { Component } from 'react';
import { Form, Input,Button } from 'antd';
import axios from './../../axios/index'
class AuthorPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    pwdRef=React.createRef();
    finish=(values)=>{
        console.log(values)
         axios.put({
             url:"/admin/update_password",
             data:{
                 service:7,
                 params:{
                     oldPassword:values.oldPassword,
                     newPassword:values.newPassword
                 }
             }
         }).then(res=>{
             window.location.href='/#/authorLogin'
             window.scrollTo(0, 0)
         })

    }
    render() {
        const layout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 10,
            },
        }
        return (
            <div>
                <Form style={{ marginTop: "30px" }} layout="horizontal" {...layout} name="control-ref" ref={this.pwdRef} onFinish={this.finish}>
                <Form.Item
                        name="oldPassword"
                        label="原密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入原密码',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请输入确认密码!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('两次密码不一致!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">确认</Button>
                </Form>
            </div>
        );
    }
}

export default AuthorPwd;