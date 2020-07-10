import React, { Component } from 'react';
import './index.css'
class Pswstrength extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {color,strength,middle,high}=this.props;
        return ( 
            <div className="pswstrength">
                <ul>
                <li>
                    <span>密码强度</span>
                </li>
                    <li></li>
                    <li style={{display:`${middle}`}}></li>
                    <li style={{display:`${high}`}}></li>
                    <li style={{marginLeft:"20px" ,color:`${color}`}}>{strength}</li>
                </ul>
            </div>
         );
    }
}
 
export default Pswstrength;