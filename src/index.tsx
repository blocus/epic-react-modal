import { DragEvent, useEffect, useRef, useState } from 'react'
import style from './modal.module.css'
import { Portal } from 'react-portal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import * as types from './types'
import { getWindowDimensions } from './helpers/window'
import classNames from 'classnames'

export const useModal = (props?: types.useModalProps): types.UseModalHook => {
  const { show: isvisible = false, width = null, height = null } = props || {}
  const modalRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState<boolean>(Boolean(isvisible))
  const [position, setPosition] = useState<types.ModalPosition>({ top: 0, left: 0 })
  const [oldPosition, setOldPosition] = useState<types.ModalPosition>({ top: 0, left: 0 })
  const [startPosition, setStartPosition] = useState<types.ModalPosition>({ top: 0, left: 0 })

  function handleResize() {
    const { width, height } = getWindowDimensions()
    let [top, left] = [0, 0]
    const { current } = modalRef
    if (!current) {
      top = height / 2
      left = width / 2
    } else {
      const { width: modalWidth, height: modalHeight } = current.getBoundingClientRect()
      top = height / 2 - modalHeight / 2
      left = width / 2 - modalWidth / 2
    }

    setPosition({ top, left })
    setOldPosition({ top, left })
  }

  const hide = () => setVisible(false)
  const show = () => setVisible(true)

  useEffect(() => {
    if (visible) handleResize()
  }, [visible])

  const toggle = () => setVisible(!visible)

  const dragStart = ({ pageY, pageX, dataTransfer }: DragEvent<HTMLDivElement>) => {
    var img = document.createElement('img')
    dataTransfer.setDragImage(img, 0, 0)
    setStartPosition({ top: pageY, left: pageX })
  }

  // BUG: Drag and drop not working on firefox
  const drag = ({ pageX, pageY }: DragEvent<HTMLDivElement>) => {
    const { current } = modalRef
    const { width, height } = getWindowDimensions()

    if (!current) return

    const { top: startTop, left: startLeft } = startPosition
    const { top: oldTop, left: oldLeft } = oldPosition
    const { width: modalWidth, height: modalHeight } = current.getBoundingClientRect()
    let currentTop = oldTop + pageY - startTop
    let currentLeft = oldLeft + pageX - startLeft
    if (currentTop < 0) currentTop = 0
    if (currentLeft < 0) currentLeft = 0
    if (currentTop + modalHeight > height) currentTop = height - modalHeight
    if (currentLeft + modalWidth > width) currentLeft = width - modalWidth
    current.style.top = `${currentTop}px`
    current.style.left = `${currentLeft}px`
  }

  const dragEnd = ({ pageX, pageY }: DragEvent<HTMLDivElement>) => {
    const { current } = modalRef
    if (!current) return
    const { width, height } = getWindowDimensions()
    const { width: modalWidth, height: modalHeight } = current.getBoundingClientRect()
    const { top: startTop, left: startLeft } = startPosition
    const { top: oldTop, left: oldLeft } = oldPosition

    let currentTop = oldTop + pageY - startTop
    let currentLeft = oldLeft + pageX - startLeft
    if (currentTop < 0) currentTop = 0
    if (currentLeft < 0) currentLeft = 0
    if (currentTop + modalHeight > height) currentTop = height - modalHeight
    if (currentLeft + modalWidth > width) currentLeft = width - modalWidth

    setPosition({ top: currentTop, left: currentLeft })
    setStartPosition({ top: 0, left: 0 })
    setOldPosition({ top: currentTop, left: currentLeft })
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    modalRef,
    visible,
    show,
    hide,
    toggle,
    position,
    width: width || '',
    height: height || '',
    resetPosition: handleResize,
    dragEvent: {
      onDragStart: dragStart,
      onDrag: drag,
      onDragEnd: dragEnd,
    },
  }
}

function Modal({ modal, title = '', children }: types.ModalProps) {
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

function ModalBody({ children, noPadding = false, className = '' }: types.ModalBodyProps) {
  return <div className={classNames(style.modalBody, className, { [style.noPadding]: noPadding })}>{children}</div>
}

export default Object.assign(Modal, {
  useModal,
  Body: ModalBody,
})
