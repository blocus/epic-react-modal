import style from './modal.module.scss'
import { Portal } from 'react-portal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { ModalProps } from './types'
function Modal({ modal, title = '', children }: ModalProps) {
  const { modalRef, dragEvent, visible, position, hide, width, height } = modal

  return visible ? (
    <Portal>
      <div role='dialog' className={style.modalDrop} onClick={hide} tabIndex={-1}>
        <div
          ref={modalRef}
          style={{ ...position, width, height }}
          className={style.modal}
          onClick={event => event.stopPropagation()}
        >
          <div draggable {...dragEvent} className={style.modalHeader}>
            <span>{title}</span>
            <button onClick={hide}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  ) : null
}

export default Modal