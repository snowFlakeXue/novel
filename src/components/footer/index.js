import React, { Component } from 'react';
import { HeartFilled } from '@ant-design/icons'
import './index.css'
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="footer">
            make with <HeartFilled style={{color:"#ffa39e"}} spin /> by 木樰
            </div>
         );
    }
}
 
export default Footer;