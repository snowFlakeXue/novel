import React, { Component } from 'react';
import Footer from './components/footer'
import './style/pageCommon.css'
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div >
            <div className="pageMain" >
            {this.props.children}
            </div>
               <div>
               <Footer />
            </div>
                
            </div>
         );
    }
}
 
export default Home;