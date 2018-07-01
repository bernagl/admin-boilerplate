import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { setSchemaTitle } from '../actions/schema_actions'
import Datatable from '../components/Datatable'
import Modal from '../components/Modal'
import Table from 'react-xtable'
import { getDocumentsByModel } from '../actions/firebase_actions'
// import 'react-xtable/dist/styles.css'
import '../assets/xtable.css'

const data = [
  {
    nombre: 'Daniela',
    correo: 'danimerlo@gmail.com',
    contrasena: 'daniela123',
    age: 22
  }
]

class Model extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.state = { selected: null }
  }

  componentDidMount() {
    this.setDataToState(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    const model = nextProps.match.params.id
    model !== this.props.match.params.id &&
      (this.props.setSchemaTitle(model), this.setDataToState(model))
  }

  setDataToState = async model => {
    const data = await getDocumentsByModel(this.props.match.params.id)
    this.setState({ data })
  }

  showModal = selected => {
    this.setState({ selected }, () => this.modalRef.current.showModal())
  }

  render() {

    return (
      <div>
        <Table
          data={data}
          columns={columns}
          pagination={50}
          searchPlaceholder="Buscar"
          emptyText={() => 'Esta tabla aún no tiene ningún dato'}
        />
        <Modal
          ref={this.modalRef}
          modalRef={this.modalRef}
          model={this.props.match.params.id}
          selected={this.state.selected}
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
