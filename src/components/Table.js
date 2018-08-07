import React, { Component } from 'react'
import { Button, Icon, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import Table from 'react-xtable'
import {
  addDocument,
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import '../assets/xtable.css'

export default class Datatable extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      loading: false,
      selected: null,
      modal: false,
      data: [],
      exportData: [],
      dataSource: [],
      hideDisabled: false
    }
  }

  componentDidMount() {
    this.setDataToState(this.props.model)
  }

  setDataToState = async model => {
    const data = await getDocumentsByModel(this.props.model)
    this.setState({ data, dataSource: data })
  }

  showModal = selected => {
    this.setState({ selected, modal: true })
  }

  closeModal = () => {
    this.setState({ selected: {}, modal: false, loading: false })
  }

  handleOk = () => {
    this.setState({ loading: true }, () => this.formRef.current.submit())
  }

  toggleDisabled = () => {
    this.setState(({ dataSource, hideDisabled }) => {
      if (!hideDisabled) {
        const d = dataSource.filter(row => row.status === 1)
        return { data: d, hideDisabled: !hideDisabled }
      } else {
        return { data: dataSource, hideDisabled: !hideDisabled }
      }
    })
  }

  setExportData = exportData => {
    this.setState({ exportData })
  }

  render() {
    const {
      //   data,
      exportData,
      hideDisabled,
      loading,
      modal,
      selected
    } = this.state
    const {
      Columns,
      download,
      data,
      Inputs,
      model,
      redirect,
      showHideDisabled,
      submit,
      title
    } = this.props
    const action = selected ? updateDocument(model) : addDocument(model)
    return (
      <div className="row">
        <div className="col-12 my-2">
          {!showHideDisabled && (
            <span
              onClick={this.toggleDisabled}
              className="dt-toggle-status-btn"
            >
              {hideDisabled
                ? 'Mostrar deshabilitados'
                : 'Ocultar deshabilitados'}
            </span>
          )}
          <br />
          {download && (
            <CSVLink data={exportData}>
              Exportar <Icon type="file-excel" />
            </CSVLink>
          )}
        </div>
        <div className="col-12">
          <Table
            callback={this.setExportData}
            columns={Columns}
            data={data}
            emptyText={() => 'Esta tabla aún no tiene ningún dato'}
            footer={false}
            // header={true}
            pagination={50}
            search={true}
            searchPlaceholder="Buscar"
          />
        </div>
      </div>
    )
  }
}
