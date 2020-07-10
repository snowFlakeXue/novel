import React, { Component } from 'react';
import { List, Avatar, Button, Modal, Form, Input, TextArea } from 'antd';
import { EditOutlined, DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';
import Axios from './../../axios/index'
import common from './../../common'
import './index.css'
import { connect } from 'react-redux'
import { getBlogDetail } from './../../redux/action'


class BlogManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            pagination: {},
            addVisible: false
        }
    }
    componentDidMount = () => {
        this.request()
    }
    nowPage = 1;
    addRef = React.createRef();
    request = () => {
        let _this = this
        Axios.get({
            url: `/admin/content/page/${this.nowPage}/5`,
            data: {
                service: 1,
                showLoading:true
            }
        }).then(res => {
            let list = res.data.list.map(item => {
                item.key = item.id;
                return item;
            })
            this.setState({
                listData: list,
                pagination: common.pagination(res, (current) => {
                    _this.nowPage = current;
                    _this.request();
                }),
            })
        })
    }
    addBlog = () => {
        this.setState({
            addVisible: true
        })
    }
    delete = (id) => {
        let _this = this;
        Axios.delete({
            url: `/content/${id}`,
            data: {
                service: 1
            }
        }).then(res => {
            _this.request();
        })
    }
    modify=async(id)=>{
        await Axios.get({
            url:`/admin/content/${id}`,
            data: {
                service: 1,
                showLoading:true
            }
        }).then(res=>{
           this.props.getDetail(res.data)
        })
        window.location.href="/#/sso/blog-edit"
        window.scrollTo(0, 0)

    }
    render() {
        return (
            <div className="blog-management">
                <Button type="primary"
                    href="/#/sso/blog-edit"
                    className="addBannerBtn" size="large" shape="circle" icon={<FolderAddOutlined />}></Button>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={this.state.pagination}
                    dataSource={this.state.listData}

                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <Button type="link" onClick={(e) => this.delete(item.id, e)}>
                                <DeleteOutlined />删除
                                </Button>,
                                <Button type="link" onClick={(e) => this.modify(item.id, e)}>
                               <EditOutlined />修改
                                </Button>
                            ]}
                            extra={
                                <img
                                    width={272}
                                    height={120}
                                    alt="logo"
                                    src={item.cover}
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={item.title}
                                description={item.summary}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        blogDetail: state.blogDetail,
    }
}
const dispatchToProps = (dispatch) => {
    return {
        getDetail(value) {
            let action = getBlogDetail(value)
            return dispatch(action);
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(BlogManagement)