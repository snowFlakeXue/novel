import React, { Component } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import cookie from 'js-cookie'
import common from './../../common/index'
import SinglePic from './../../common/singlePic'
import {connect} from 'react-redux'
import {removePic} from './../../redux/action'
import axios from './../../axios/index'
class AuthorBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorInfo: {}
        }
    }
    baseRef = React.createRef();
    componentWillMount = async() => {
        let list = cookie.get('author_info')
        // cookie里存的json字符串需转化成对象
       this.setState({
            authorInfo: JSON.parse(list),
        })

    }
    finish=(values)=>{
          axios.put({
              url:"/admin/update_author",
              data:{
                  service:7,
                  params:{
                      motto:values.motto,
                      email:values.email,
                      sex:values.sex,
                      avatar:this.props.imgUrl
                  }
              }
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
                <Form style={{ marginTop: "30px" }} layout="horizontal" {...layout} name="control-ref" ref={this.baseRef} onFinish={this.finish}>
                    <Form.Item label="头像">
                        <SinglePic />
                    </Form.Item>
                    <Form.Item label="作者笔名">
                        {this.state.authorInfo.penName}
                    </Form.Item>
                    <Form.Item label="手机号码">
                        {common.resetPhone(this.state.authorInfo.mobile)}
                    </Form.Item>
                    <Form.Item label="性别" name="sex">
                    {/* 要写在willmount理财型，不然sex渲染不上 */}
                        <Radio.Group defaultValue={this.state.authorInfo.sex}>
                            <Radio value={1}>男生</Radio>
                            <Radio value={2}>女生</Radio>
                            <Radio value={0}>保密</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="email" label="邮箱">
                        <Input defaultValue={this.state.authorInfo.email} />
                    </Form.Item>
                    <Form.Item name="motto" label="作者格言">
                        <Input defaultValue={this.state.authorInfo.motto} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">修改</Button>
                </Form>
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
export default connect(mapStateToProps,dispatchToProps)(AuthorBase);