import React, { useState } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import Icon from '@mdi/react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

interface IProps {
  titleColor?: string
  contentRenderer: React.FC<any>
  title: string
  isOpenedByDefault?: boolean
}

export const CollabsibleContent = ({ title, titleColor, contentRenderer, isOpenedByDefault }: IProps): any => {
  const classes = useStyles()
  const [isOpened, setIsOpened] = useState<boolean>(isOpenedByDefault || false)
  const handleToggle = () => {
    setIsOpened((s: boolean) => !s)
  }

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
      {isOpened && contentRenderer({})}
    </div>
  )
}
