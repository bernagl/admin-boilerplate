import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Router } from '../router'
import { Layout } from 'antd'
import Sidebar from '../components/Sidebar'
const { Content, Footer, Header } = Layout

class Admin extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <h1 className="admin-title">{this.props.schema.title}</h1>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Router />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Admin by Mobkii</Footer>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ auth, schema }) => ({ auth, schema })

export default withRouter(connect(mapStateToProps)(Admin))
