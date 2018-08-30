import React, { Component } from 'react'
import AnimationWrapper from '../components/AnimationWrapper'
import Form from '../components/Form2'
import { Button, message } from 'antd'
import '../assets/login.css'
import Logo from '../assets/ifs.png'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { loading: false }
  }

  submitForm = () => {
    this.formRef.current.submit()
  }

  submit = async model => {
    this.setState({ loading: true })
    const response = await this.props.submit(model)
    if (response === 404) this.setState({ loading: false })
  }

  render() {
    const { children, Links, title } = this.props
    const { loading } = this.state
    return (
      <AnimationWrapper>
        <div className="container">
          <div
            id="login"
            className="row justify-content-center align-items-center center-text p-2 p-md-0"
          >
            <div className="login-box col-12 col-md-6 col-lg-4 p-4">
              <div className="row">
                <div className="col-12">
                  <div className="logo-container my-3">
                    <img src={Logo} alt="" />
                  </div>
                  <h3>{title}</h3>
                  <Form ref={this.formRef} submit={this.submit}>
                    {children}
                    <Button
                      onClick={this.submitForm}
                      type="primary"
                      className="fw"
                      loading={loading}
                    >
                      {title}
                    </Button>
                  </Form>
                </div>
                <Links />
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }
}
