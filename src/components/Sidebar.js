import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { NavLink, withRouter } from 'react-router-dom'

const { SubMenu } = Menu
const { Sider } = Layout

class Sidebar extends Component {
  state = { collapsed: false }
  render() {
    const path = this.props.location.pathname.replace('/', '')
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={() =>
          this.setState(({ collapsed }) => ({
            collapsed: !collapsed
          }))
        }
      >
        <div className="logo p-4">
          <img
            alt=""
            src="http://impulse-fitnessstudio.com/wp-content/uploads/2016/12/logo-impulsfit.png"
          />
        </div>
        <Menu theme="dark" defaultSelectedKeys={[path]} mode="inline">
          <Menu.Item key="calendario">
            <NavLink activeClassName="active" to="/calendario">
              <Icon type="calendar" />
              <span>Calendario</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="asignar-credito">
            <NavLink activeClassName="active" to="/asignar-credito">
              <Icon type="credit-card" />
              <span>Asignar créditos</span>
            </NavLink>
          </Menu.Item>
          {/* <Menu.Item key="2">
            <NavLink activeClassName="active" to="/model/clase">
              <Icon type="desktop" />
              <span>Clases</span>
            </NavLink>
          </Menu.Item> */}
          <Menu.Item key="sucursal">
            <NavLink activeClassName="active" to="/sucursal">
              <Icon type="shop" />
              <span>Sucursales</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="pago">
            <NavLink activeClassName="active" to="/pago">
              <Icon type="wallet" />
              <span>Pagos</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="instructor">
            <NavLink activeClassName="active" to="/instructor">
              <Icon type="usergroup-add" />
              <span>Instructores</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="salon">
            <NavLink activeClassName="active" to="/salon">
              <Icon type="home" />
              <span>Salones</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="usuario">
            <NavLink activeClassName="active" to="/usuario">
              <Icon type="user" />
              <span>Usuarios</span>
            </NavLink>
          </Menu.Item>
          <SubMenu
            key="clases"
            title={
              <span>
                <Icon type="schedule" />
                <span>Clases</span>
              </span>
            }
          >
            <Menu.Item key="clase">
              <NavLink activeClassName="active" to="/clase">
                Lista de clases
              </NavLink>
            </Menu.Item>
            <Menu.Item key="horario">
              <NavLink activeClassName="active" to="/horario">
                Asignar horario
              </NavLink>
            </Menu.Item>
          </SubMenu>
          {/* <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <NavLink activeClassName="active" to="/eroorjo">
              <Icon type="file" />
              <span>File</span>
            </NavLink>
          </Menu.Item> */}
        </Menu>
      </Sider>
    )
  }
}

export default withRouter(Sidebar)
