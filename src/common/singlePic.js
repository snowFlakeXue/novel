import React, { Component } from 'react';
import { Upload, Modal ,Button} from 'antd';
import { PlusOutlined,UploadOutlined } from '@ant-design/icons';
import Axios from './../axios'
import { connect } from 'react-redux'
import { getUrl, getImgList } from './../redux/action'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class SinglePic extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    uptoken: {
      token: "",
      key: ""
    },
    picUrl: ""
  }
  domainname = "http://juetu.francisqiang.top/"
  componentDidMount() {
    this.initialization()
  }

  initialization = () => {
    Axios.get({
      url: "/token",
      data: {
        service: 6
      }
    }).then(res => {
      this.setState({
        uptoken: {
          token: res.data,
          key: Math.round(new Date() / 1000)
        }
      })
    })
  }
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);

    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });

  };

  handleChange = async ({ fileList, file }) => {

    this.setState({
      fileList,
      picUrl: this.domainname + this.state.uptoken.key
    });
    this.props.getImag(this.state.picUrl)
    if (file.status === "done") {
      // 重置

      this.initialization()
    }
    this.props.getList(this.state.fileList)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
        
    
      </div>
      
      
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://upload-z2.qiniup.com"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={this.state.uptoken}
        >
          {fileList.length >= 1 ? null :uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
const mapStatetoProp = (state) => {
  return {
    imgUrl: state.imgUrl,
    imgList: state.imgList
  }
}
const dispatchToProps = (dispatch) => {
  return {
    getImag(e) {
      let action = getUrl(e)
      return dispatch(action)
    },
    getList(e) {
      let action = getImgList(e)
      return dispatch(action)
    }

  }
}
export default connect(mapStatetoProp, dispatchToProps)(SinglePic);