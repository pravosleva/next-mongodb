import React from 'react'
import clsx from 'clsx'
import { EType, useStyles } from './styles'

interface IProps {
  type?: EType
  text: string
}

// const Icon = ({ children, type }: { children: React.FC; type: EType }) => {
//   return <div>{children}</div>
// }

export const Alert = ({ type, text }: IProps) => {
  const classes = useStyles()

  // @ts-ignore
  return <div className={clsx(classes.likeBlockuote, classes[`likeBlockuote_${type || 'default'}`])}>{text}</div>
}
