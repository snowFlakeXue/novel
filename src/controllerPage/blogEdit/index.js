import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import * as qiniu from 'qiniu-js'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import Axios from "../../axios/index"
import { connect } from 'react-redux'
import { removePic } from './../../redux/action'
import './index.css'
class BlogEditor extends React.Component {

    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(this.props.blogDetail.content),
        token: "",
        
    }
    // async componentDidMount() {
    //     if(this.props.blogDetail.authorId){
    //         this.setState({
    //             modify:false,
    //             add:true
    //         })
    //     }else{
    //         this.setState({
    //             modify:true,
    //             add:false
    //         })
    //     }
    //     this.request()
    //     console.log(this.props.blogDetail)
    //     this.addRef.current.setFieldsValue({
    //         title:this.props.blogDetail.title,
    //         summary:this.props.blogDetail.summary,
    //         isFree:this.props.blogDetail.isFree,
    //         price:this.props.blogDetail.price,
    //         categoryId:this.props.blogDetail.categoryId
    //     })
    // }
    // request = () => {
    //     const { Option } = Select;

    //     Axios.get({
    //         url: "/category/children",
    //         data: {
    //             service: 3,
    //             showLoading:true
    //         }
    //     }).then(res => {
    //         this.setState({
    //             secondList: res.data.map(item => {
    //                 return (<Option value={item.id} key={item.id}>{item.title}</Option>)
    //             })
    //         })
    //     })
    // }
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
        // const htmlContent = this.state.editorState.toHTML()
    }
    uploadFn = async (param) => {
        await Axios.get({
            url: "/token",
            data: {
                service: 6,
                showLoading:true
            }
        }).then(res => {
            this.setState({
                token: res.data
            })
        })
        const putExtra = {
        }
        const config = {
            useCdnDomain: true,
            region: qiniu.region.z2
        };

        const observer = {
            next(res) {
                param.progress(res.loaded / res.total * 100)
            },
            error(err) {
                param.error({
                    msg: err.message
                })
            },
            complete(res) {
                param.success({
                    url: 'http://juetu.francisqiang.top/' + res.key
                })
            }
        }
        qiniu.upload(param.file, Math.round(new Date() / 1000), this.state.token, putExtra, config).subscribe(observer)
    }

    handleCancel = () => {

    }
    // addFinish = (values) => {
    //     let _this=this;
    //     if(this.state.modify){
    //         Axios.post({
    //             url:"/admin/content",
    //             data:{
    //                 service:1,
    //                 params:{
    //                     title:values.title,
    //                     content:this.state.editorState.toHTML(),
    //                     categoryId:values.categoryId,
    //                     summary:values.summary,
    //                     isFree:values.isFree,
    //                     price:values.price?values.price.toString():"0.00",
    //                     cover:this.props.imgUrl
    //                 }
    //             }
    //         }).then(res=>{
    //             _this.addRef.current.resetFields();
    //             window.location.href="/#/sso/blog"
    //         })
    //     }else{
    //         Axios.put({
    //             url:"/admin/content",
    //             data:{
    //                 service:1,
    //                 params:{
    //                     id:this.props.blogDetail.id,
    //                     title:values.title,
    //                     content:this.state.editorState.toHTML(),
    //                     categoryId:values.categoryId,
    //                     summary:values.summary,
    //                     isFree:values.isFree,
    //                     price:values.price?values.price.toString():"0.00",
    //                     cover:this.props.imgUrl?this.props.imgUrl:_this.props.blogDetail.cover
    //                 }
    //             }
    //         }).then(res=>{
    //             _this.addRef.current.resetFields();
    //             window.location.href="/#/sso/blog"
    //         })
    //     }
       
    // }
    render() {

        const { editorState } = this.state
        return (
            <div className="edit-blog">
                <div style={{ clear: "both" }}>
                    <BraftEditor
                        value={editorState}
                        onChange={this.handleEditorChange}
                        onSave={this.submitContent}
                        media={{ uploadFn: this.uploadFn }}
                    />
                </div>
            </div>
        )

    }

}
const mapStateToProps = state => {
    return {
        imgUrl: state.imgUrl,
        blogDetail: state.blogDetail
    }
}
const dispatchToProps = (dispatch) => {
    return {
        remove() {
            let action = removePic()
            return dispatch(action);
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(BlogEditor)