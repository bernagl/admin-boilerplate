import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { setSchemaTitle } from '../actions/schema_actions'
import Modal from '../components/Modal'
import { TableHeaders } from '../models'
import Table from 'react-xtable'
import {
  addDocument,
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
// import 'react-xtable/dist/styles.css'
import '../assets/xtable.css'

class Model extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.state = { selected: null, data: [] }
  }

  componentDidMount() {
    this.setDataToState(this.props.match.params.id)
  }

  componentDidUpdate(prevProps) {
    const model = this.props.match.params.id
    model !== prevProps.match.params.id &&
      (this.props.setSchemaTitle(model), this.setDataToState(model))
  }

  setDataToState = async model => {
    this.setState({ data: [] })
    const data = await getDocumentsByModel(this.props.match.params.id)
    this.setState({ data })
  }

  showModal = selected => {
    this.setState({ selected }, () => this.modalRef.current.showModal())
  }

  render() {
    const { data, selected } = this.state
    const { id } = this.props.match.params
    const action = selected ? updateDocument(id) : addDocument(id)
    const Columns = TableHeaders[id]
    return (
      <div>
        <Table
          data={data}
          columns={Columns(this.showModal)}
          pagination={50}
          searchPlaceholder="Buscar"
          emptyText={() => 'Esta tabla aún no tiene ningún dato'}
        />
        <Modal
          ref={this.modalRef}
          modalRef={this.modalRef}
          model={id}
          selected={selected}
          action={action}
          callback={this.setDataToState}
        />
        <Button type="primary" onClick={() => this.showModal(null)}>
          Agregar
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ schema }) => ({ schema })

export default connect(
  mapStateToProps,
  { setSchemaTitle }
)(Model)
