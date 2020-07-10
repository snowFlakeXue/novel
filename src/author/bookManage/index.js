import React, { Component } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'
import {getChapterId} from './../../redux/action'
class BookManage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    removeChapter=()=>{
        this.props.getId("")
    }
    render() {
        return (
            <div>
                <Menu mode="horizontal"  onClick={this.removeChapter}>
                    <Menu.Item key='bookInfo'><NavLink to={`/author/book-info/${this.props.novelId}`}>作品信息</NavLink></Menu.Item>
                    <Menu.Item key='chapter'><NavLink to={`/author/book-info/chapter-manage/${this.props.novelId}`}>章节管理</NavLink></Menu.Item>
                    <Menu.Item key='upload-chapter'><NavLink to={`/author/book-info/upload-chapter/${this.props.novelId}`}>上传章节</NavLink></Menu.Item>
                    <Menu.Item key='draft'><NavLink to={`/author/book-info/draft/${this.props.novelId}`}>草稿箱</NavLink></Menu.Item>
                </Menu>
                {this.props.children}
            </div>

        );
    }
}
const mapStatetoProp = (state) => {
    return {
      novelId: state.novelId
    }
  }
  const dispatchToProps = (dispatch) => {
    return {
      getId(e) {
        let action = getChapterId(e)
        return dispatch(action)
      }
    }
  }
 
  export default connect(mapStatetoProp,dispatchToProps)(BookManage);
