import React, { Component } from 'react';
import {Button,Form,Input,Radio,Select} from 'antd'
import './index.css'
import axios from './../../axios'
import SinglePic from './../../common/singlePic'
import { connect } from 'react-redux'
import {removePic} from './../../redux/action'
class BookInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            confirm:true,
            defaultFirst:"",
            defaultSecond:""
         }
    }
    
    componentWillMount=async ()=>{
        if(this.props.novelId){
            await axios.get({
               url:`/admin/novel/${this.props.novelId}`,
               data:{
                   service:7,
                   showLoading:true
               }
           }).then(res=>{
               console.log(res)
               this.infoRef.current.setFieldsValue({             
                targetReader:res.data.targetReader,
                description:res.data.description,
                recommendNote:res.data.recommendNote,
                name:res.data.name
              })
              this.setState({
                firstId:res.data.categoryParentId,
                secondId:res.data.categoryId
              })
             axios.get({
                url:`/admin/category/${res.data.targetReader}`,
                data:{
                    service:7,
                    showLoading:true
                }
            }).then(res=>{
                console.log(res)
                this.setState({
                    firstCategory:(
                        res.data.map(item=>{
                            if(item.id===this.state.firstId){
                                console.log(item.title)
                                this.setState({
                                    defaultFirst:item.title
                                })
                            }
                            return (<Select.Option value={item.id}>{item.title}</Select.Option>)
                        })
                    )
                })
            })
           })
           
        await axios.get({
            url:`/admin/category/children/${this.state.firstId}`,
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            this.setState({
                secondCategory:(
                    
                    res.data.map(item=>{
                        if(item.id===this.state.secondId){
                            console.log(item.title)
                            this.setState({
                                defaultSecond:item.title
                            })
                        }
                        return (<Select.Option value={item.id}>{item.title}</Select.Option>)
                    })
                )
                })
        })
        }
    }
    infoRef=React.createRef();
    changeSex=async (e)=>{
          axios.get({
              url:`/admin/category/${e.target.value}`,
              data:{
                  service:7,
                  showLoading:true
              }
          }).then(res=>{
              console.log(res)
              this.setState({
                  firstCategory:(
                      res.data.map(item=>{
                          return (<Select.Option value={item.id}>{item.title}</Select.Option>)
                      })
                  )
              })
          })
          
    }
    changeFirst=(value)=>{
        axios.get({
            url:`/admin/category/children/${value}`,
            data:{
                service:7,
                showLoading:true
            }
        }).then(res=>{
            this.setState({
                secondCategory:(
                    res.data.map(item=>{
                        return (<Select.Option value={item.id}>{item.title}</Select.Option>)
                    })
                ),
                firstId:value
            })
        })
    }
    changeSecond=(value)=>{
        this.setState({
            secondId:value
        })
    }
    onFinish=(values)=>{
        if(this.props.novelId){
            axios.put({
                url:"/admin/novel",
                data:{
                    service:7,
                    params:{
                        id:this.props.novelId,
                    name:values.name,
                    targetReader:values.targetReader,
                    recommendNote:values.recommendNote,
                    description:values.description,
                    categoryParentId:this.state.firstId,
                    categoryId:this.state.secondId,
                    cover:this.props.imgUrl
                    }
                }
            }).then(res=>{
                window.location.href=`/#/author/book-manage`
                window.scrollTo(0, 0)
   
            })
        }else{
            this.setState({
                confirm:false
            })
            axios.post({
                url:"/admin/novel",
                data:{
                    service:7,
                    params:{
                        name:values.name,
                        targetReader:values.targetReader,
                        recommendNote:values.recommendNote,
                        description:values.description,
                        categoryParentId:this.state.firstId,
                        categoryId:this.state.secondId,
                        cover:this.props.imgUrl
                    }
                }
            }).then(res=>{
                window.location.href=`/#/author/book-manage`;
                window.scrollTo(0, 0)
            })
        }
        
    }
    
    render() { 
        const { TextArea } = Input;
        const layout={
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 18,
            },
        }
        return ( 
            <div className="bookInfo clearfix">
            <h1 style={{marginBottom:"30px"}}>作品信息</h1>
                <div className="left">
                   <SinglePic/>
                </div>
                <div className="right">
                    <Form ref={this.infoRef} {...layout} name="ref-control" onFinish={this.onFinish}>
                      <Form.Item label="作品名称" name="name" rules={[{
                          required:true,
                          message:"请填写作品名称"
                      },{
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){1,20}$",
                        message:"最多可输入20字" 
                      }
                      ]}>
                          <Input placeholder="请输入作品名称，最多20字" />
                      </Form.Item>
                      <Form.Item label="目标读者" name="targetReader"  rules={[
                            {
                          required:true,
                          message:"请选择目标读者"
                      }]}>
                         <Radio.Group onChange={this.changeSex}>
                             <Radio value={0}>通用</Radio>
                             <Radio value={1}>男生(以男生受众为主的作品)</Radio>
                             <Radio value={2}>女生(以女生受众为主的作品)</Radio>
                         </Radio.Group>
                      </Form.Item>
                      <Form.Item label="作品类型">
                          <Select style={{ width: 200,marginRight:"10px" }} 
                          placeholder={this.state.defaultFirst}
                          onChange={this.changeFirst}
                          dependencies={['targetReader']}
                          rules={[
                            {
                          required:true,
                          message:"请选择一级分类"
                      }]}
                          >
                              {this.state.firstCategory}
                          </Select>
                          <Select  rules={[
                            {
                          required:true,
                          message:"请选择二级分类"
                      }]} 
                      onChange={this.changeSecond} 
                      placeholder={this.state.defaultSecond}
                       style={{ width: 200 }}>
                            {this.state.secondCategory}
                          </Select>
                      </Form.Item>
                      <Form.Item label="作品状态"  rules={[
                            {
                          required:true,
                          message:"请选择作品状态"
                      }]}>
                         <Radio.Group defaultValue={0} disabled>
                             <Radio value={0}>连载中</Radio>
                             <Radio value={1}>已完结(如要完结，请联系责编修改作品)</Radio>
                         </Radio.Group>
                      </Form.Item>
                      <Form.Item label="推荐语" name="recommendNote">
                          <Input placeholder="请输入推荐语，最多15字" />
                      </Form.Item>
                      <Form.Item label="作品简介" name="description" rules={[
                          {
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){0,15}$",
                        message:"最多可输入15字"
                        
                      }
                      ]}>
                      <TextArea rows={4} placeholder="请简要介绍作品，最多200字" rules={[
                          {
                        pattern:"^([\u4e00-\u9fa5]|[0-9_a-zA-Z]){0,200}$",
                        message:"最多可输入200字"
                      }
                      ]} />
                      </Form.Item>
                      <p style={{color:"red"}}>注意：严禁上传任何涉黄、涉赌、涉毒、涉政、涉黑等违规内容。一经查实，全书屏蔽整改并取消福利，情节严重的会追究其法律责任。</p>
                      <Button type="primary" htmlType="submit" >确认创建</Button>
                      <Button>取消</Button>
                    </Form>
                </div>
            </div>
         );
    }
}
const mapStateToProps = state =>{
    return {
        imgUrl:state.imgUrl,
        imgList:state.imgList,
        novelId:state.novelId,
        
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
export default connect(mapStateToProps,dispatchToProps)(BookInfo);