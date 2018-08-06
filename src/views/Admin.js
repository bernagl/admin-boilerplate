import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Router, RouterAuth } from '../router'
import { Layout, Icon } from 'antd'
import Sidebar from '../components/Sidebar'
import { authState } from '../actions/firebase_auth'
const { Content, Footer, Header } = Layout

class Admin extends Component {
  state = { auth: false, loading: true }

  componentDidMount() {
    authState(this)
  }

  render() {
    const { auth, loading } = this.state
    return loading ? (
      <div className="row align-items-center justify-content-center fh">
        <Icon type="loading" />
      </div>
    ) : auth ? (
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
    ) : (
      <RouterAuth />
    )
  }
}

const mapStateToProps = ({ auth, schema }) => ({ auth, schema })

export default withRouter(connect(mapStateToProps)(Admin))
