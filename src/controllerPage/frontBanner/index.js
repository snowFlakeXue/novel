import React, { Component } from 'react';
import Axios from './../../axios'
import { Card, Button,Modal,Form,Input,Alert,Avatar} from 'antd'
import './index.css'
import { FolderAddOutlined } from '@ant-design/icons';
import SinglePic from './../../common/singlePic'
import { connect } from 'react-redux'
import {removePic} from './../../redux/action'
class FrontBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
            addVisible:false,
            modifyVisible:false,
            id:""
        }
    }
    componentDidMount() {
        this.request()
    }
    addRef=React.createRef()
    modifyRef=React.createRef()
    request = () => {
        Axios.get({
            url: "/admin/banner",
            data: {
                service: 1,
                showLoading:true
            }
        }).then(res => {
            this.setState({
                bannerList: res.data
            })
        })
    }
    addBanner = () => {
        this.setState({
            addVisible:true
        })
        this.props.remove();
    }
    addFinish=(values)=>{
        this.setState({
            addVisible:false
        })
        let _this=this
        Axios.post({
            url: "/admin/banner",
            data: {
                service: 1,
                params: {
                    title:values.title,
                    imgUrl:this.props.imgUrl,
                    linkUrl:values.linkUrl
                }
            }
        }).then(res=>{
        _this.request();
        })
        _this.props.remove();
        _this.addRef.current.resetFields()
    }
    
    addClose=()=>{
        this.props.remove();
        this.addRef.current.resetFields();
        this.setState({
            addVisible:false
        })
    }
    cancelAdd=()=>{
        this.addClose()
    }
    delete=(id)=>{
        let _this=this;
        Axios.delete({
            url:`/admin/banner/${id}`,
            data:{
                service:1
            }
        }).then(res=>{
            _this.request()
        })
    }
    cancelModify=()=>{
        this.setState({
            modifyVisible:false,
        })
        this.props.remove();
        this.modifyRef.current.resetFields();
    }
    modifyClose=()=>{
        this.cancelModify()
    }
    edit=(id,linkUrl,imgUrl,title)=>{
        this.setState({
            modifyVisible:true,
            id:id,
            modifyImg:imgUrl
        })
        let _this=this
        setTimeout(function(){
            _this.modifyRef.current.setFieldsValue({
                title:title,
                linkUrl:linkUrl
            })
        },20)
        
    }
    modifyFinish=(values)=>{
        let _this=this;
        Axios.put({
            url:"/admin/banner",
            data:{
                service:1,
                params:{
                    id:this.state.id,
                    imgUrl:this.props.imgUrl,
                    title:values.title,
                    linkUrl:values.linkUrl
                }
            }
        }).then(res=>{
            _this.request();
        })
        this.setState({
            modifyVisible:false,
        })
        this.props.remove();
        this.modifyRef.current.resetFields();
    }
    render() {
        const { Meta } = Card;
        const FormItem = Form.Item
        const banners = (
            this.state.bannerList.map(item =>
                    <Card 
                    key={item.id}
                    actions={[
      <Button type="link" key="edit" onClick={(e)=>this.edit(item.id,item.linkUrl,item.imgUrl,item.title,e)}>编辑</Button>,
      <Button type="link" key="delete" onClick={(e)=>this.delete(item.id,e)}>删除</Button>,
    ]}
                    style={{marginBottom:"10px",marginRight:"10px",width:"380px",float:"left"}}
                     hoverable cover={<img style={{height:"200px"}} src={item.imgUrl} alt={item.title} />}>
                        <Meta title={item.title} description={item.linkUrl} />
                    </Card>
            )
        )
        const layout = {
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 20,
            },
        };
        return (
            <div className="frontBanner">
            <Card title="轮播图管理" hoverable style={{backgroundColor:'rgba(255, 192, 203, 0.418)',backgroundImage:"url('/assets/baseBack.png')",minHeight: '640px'}}>
            <Button type="primary"
                    onClick={this.addBanner}
                    className="addBannerBtn" size="large" shape="circle" icon={<FolderAddOutlined />}></Button>
                   <Alert style={{marginTop:'10px',marginBottom:"20px"}} type='info' showIcon message='提示' closable description='添加轮播图按钮在右上角;所填链接为首页广告宣传地址，请谨慎填写' />
                    {banners}
            </Card>
                
                <Modal title="添加轮播图" onCancel={this.cancelAdd} visible={this.state.addVisible} footer={null}>
                    <Form
                    {...layout}
                     onFinish={this.addFinish} ref={this.addRef} onCancel={this.cancelAdd} name="control-ref">
                       
                       <SinglePic />
                      <FormItem name="title" label="名称" rules={[{
                          required:true,
                          message:"请输入轮播图的名称"
                      }]}>
                        <Input />
                      </FormItem>
                      <FormItem name="linkUrl" label="链接地址" rules={[{
                          required:true,
                          message:"请输入轮播图的url"
                      }]}>
                        <Input />
                      </FormItem>
                      <div className="formButtonGroup">
                            <Button onClick={this.addClose}>取消</Button>
                            <Button type="primary" htmlType="submit">确认</Button>
                        </div>
                    </Form>
                </Modal>
                <Modal title="修改轮播图" visible={this.state.modifyVisible} onCancel={this.cancelModify} footer={null}>
                    <Form
                    {...layout}
                     onFinish={this.modifyFinish} ref={this.modifyRef} name="control-ref">
                    <FormItem label="原图片">
                           <Avatar shape='square' src={this.state.modifyImg} size={100} />
                    </FormItem>
                    <FormItem label="新图片">
                       <SinglePic />
                    </FormItem>
                       
                      <FormItem name="title" label="名称" rules={[{
                          required:true,
                          message:"请输入轮播图的名称"
                      }]}>
                        <Input />
                      </FormItem>
                      <FormItem name="linkUrl" label="链接地址" rules={[{
                          required:true,
                          message:"请输入轮播图的url"
                      }]}>
                        <Input />
                      </FormItem>
                      <div className="formButtonGroup">
                            <Button onClick={this.modifyClose}>取消</Button>
                            <Button type="primary" htmlType="submit">修改</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        imgUrl:state.imgUrl,
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
export default connect(mapStateToProps,dispatchToProps)(FrontBanner)