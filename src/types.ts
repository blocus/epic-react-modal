import { Dispatch, DragEvent, MutableRefObject, ReactElement } from 'react'

interface ModalPosition {
  top: number
  left: number
}

export interface UseModalHook {
  modalRef: MutableRefObject<HTMLDivElement | null>
  visible: boolean
  position: ModalPosition
  width: string | number
  height: string | number
  //   show: () => void
  hide: () => void
  //   toggle: () => void
  //   resetPosition: () => void
  dragEvent: {
    onDragStart: Dispatch<DragEvent<HTMLDivElement>>
    onDrag: Dispatch<DragEvent<HTMLDivElement>>
    onDragEnd: Dispatch<DragEvent<HTMLDivElement>>
  }
}

export interface ModalProps {
  modal: UseModalHook
  title?: ReactElement | string
  children?: ReactElement[]
}
