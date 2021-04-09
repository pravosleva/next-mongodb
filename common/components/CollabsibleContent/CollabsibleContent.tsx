import React, { useState, useCallback } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import Icon from '@mdi/react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

export type TOutputCollapsibleProps = { handleClose: () => void; handleToggle: () => void }

interface IProps {
  titleColor?: string
  contentRenderer: React.FC<TOutputCollapsibleProps>
  title: string
  isOpenedByDefault?: boolean
}

export const CollabsibleContent = ({ title, titleColor, contentRenderer, isOpenedByDefault }: IProps): any => {
  const classes = useStyles()
  const [isOpened, setIsOpened] = useState<boolean>(isOpenedByDefault || false)
  const handleToggle = useCallback(() => {
    setIsOpened((s: boolean) => !s)
  }, [setIsOpened])
  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])

  return (
    <div className={classes.wrapper}>
      <div
        style={{ color: titleColor || 'inherit' }}
        className={clsx(classes.titleBox, { [classes.marginBottomIfOpened]: isOpened })}
        onClick={handleToggle}
      >
        <div>{isOpened ? <Icon path={mdiChevronUp} size={0.7} /> : <Icon path={mdiChevronDown} size={0.7} />}</div>
        <div>
          <b>{title}</b>
        </div>
      </div>
      {isOpened && contentRenderer({ handleClose, handleToggle })}
    </div>
  )
}
