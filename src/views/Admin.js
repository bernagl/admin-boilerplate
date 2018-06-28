import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from '../router'
import { Breadcrumb, Layout } from 'antd'
import Sidebar from '../components/Sidebar'
const { Content, Footer, Header } = Layout
class Admin extends Component {
  render() {
    console.log(this.props)
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Router />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Admin)
