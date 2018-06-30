import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'

const { SubMenu } = Menu
const { Sider } = Layout

export default class Sidebar extends Component {
  state = { collapsed: false }
  render() {
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
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <NavLink activeClassName="active" to="/model/credito">
              <Icon type="pie-chart" />
              <span>Asignar créditos</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink activeClassName="active" to="/model/clase">
              <Icon type="desktop" />
              <span>Clases</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink activeClassName="active" to="/model/sucursale">
              <Icon type="pie-chart" />
              <span>Sucursales</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink activeClassName="active" to="/model/pago">
              <Icon type="pie-chart" />
              <span>Pagos</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink activeClassName="active" to="/model/instructor">
              <Icon type="pie-chart" />
              <span>Instructores</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="6">
            <NavLink activeClassName="active" to="/model/salon">
              <Icon type="pie-chart" />
              <span>Salones</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="7">
            <NavLink activeClassName="active" to="/model/usuario">
              <Icon type="pie-chart" />
              <span>Usuarios</span>
            </NavLink>
          </Menu.Item>
          {/* <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu> */}
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
