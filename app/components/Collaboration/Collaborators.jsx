import React, { Component } from 'react'
import { observer } from 'mobx-react'
import * as CollaborationActions from './actions'
import state from './state'
import cx from 'classnames'
import config from 'config'
import * as Modal from 'components/Modal/actions'

const Collaborator = observer(({ item, handleDelete }) => {
  const { collaborator, id } = item
  let info = ''
  if (item.inviteBy === 'Owner') {
    info = (
      <div className='info-owner'>Owner</div>
    )
  } else {
    info = (
      <div className='info-delete' onClick={e => handleDelete(id)}>Delete</div>
    )
  }
  return (
    <div className='collaborator'>
      <div className={cx(
        'dot',
        {
          online: item.online || config.globalKey === collaborator.globalKey,
        }
      )}
      />
      <div className='avatar'>
        <img src={collaborator.avatar} style={{
          borderColor: 'blue'
        }}
        />
      </div>
      <div className='username'>
        {collaborator.name}
        {config.globalKey === collaborator.globalKey && (
          ` (You)`
        )}
      </div>
      <div className='info'>
        {info}
      </div>
    </div>
  )
})

@observer
class Collaborators extends Component {
  componentDidMount () {
    CollaborationActions.fetchCollaborators()
  }

  handleDelete = async (globalKey) => {
    const confirmed = await Modal.showModal('Confirm', {
      header: 'Are you sure you want to remove this collaborator?',
      message: `You're trying to remove ${globalKey}`,
      okText: 'Delete'
    })
    if (confirmed) {
      CollaborationActions.deleteCollaborators(globalKey).then((res) => {
        CollaborationActions.fetchCollaborators()
      })
    }
    Modal.dismissModal()
  }

  render () {
    const { collaborators } = state
    return (
      <div className='collaborators'>
        { collaborators.map((item, i) => {
          return <Collaborator item={item} key={item.collaborator.globalKey} handleDelete={this.handleDelete} />
        })}
      </div>
    )
  }
}

export default Collaborators
