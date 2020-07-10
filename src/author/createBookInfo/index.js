import React, { Component } from 'react';
import {CheckCircleFilled} from '@ant-design/icons'
import { Button } from 'antd';
import {NavLink} from 'react-router-dom'
import './index.css'
class CreateBookInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="createBookInfo">
               <CheckCircleFilled style={{color:"green",fontSize:"50px"}} /> 
               <h2>作品创建成功</h2>
               <p>新建作品后，请尽快上传章节，章节上传成功后会进入审核后台，审核人员会在2个工作日内进行审核。</p>
               <Button type="primary"><NavLink to={`/author/book-info/upload-chapter/${this.props.match.params.id}`}>继续上传章节</NavLink></Button>
               <p className="red">注意：严禁上传任何涉黄、涉赌、涉毒、涉政、涉黑等违规内容。一经查实，全书屏蔽整改并取消福利，情节严重的会追究其法律责任。</p>
            </div>
         );
    }
}
 
export default CreateBookInfo;