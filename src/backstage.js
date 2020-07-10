import React, { Component } from 'react';
import { Layout, BackTop } from 'antd'
import Head from './components/header'
import Foot from './components/footer'
import NavLeft from './components/navleft'
import './style/common.less'

class Backstage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount(){
        
    }
    render() {
        const style = {
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#bae7ff',
            color: '#ffc069',
            textAlign: 'center',
            fontSize: 16,
        };
        const { Sider, Content } = Layout;
        return (
            <div className="backstage">
                <Layout>
                    <Sider breakpoint="lg"
                        collapsedWidth="0"
                        className="left-page">
                        <NavLeft />
                    </Sider>
                    <Layout className="right-page">

                        <Head />

                        <Content className="main" style={{ margin: '105px 22px 20px' }}>
                            {this.props.children}
                        </Content>

                        <Foot style={{ margin: '84px 22px 0px', overflow: 'initial' }} />


                    </Layout>
                </Layout>
                <img className="cute" src="/assets/cute.png" alt="cute" />
                <BackTop visibilityHeight={20}>
                    <div style={style}>UP</div>
                </BackTop>
            </div>
        );
    }
}

export default Backstage;