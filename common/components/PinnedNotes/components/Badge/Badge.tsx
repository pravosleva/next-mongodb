import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { httpClient } from '~/utils/httpClient'
import { useStyles } from './styles'
import { useAuthContext } from '~/common/hooks'
import { CircularProgress } from '@material-ui/core'

export const Badge = ({ id, isActive, onClick, children, ...rest }: any) => {
  const classes = useStyles()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { isLogged } = useAuthContext()

  useEffect(() => {
    setIsLoading(true)
    setErrorMsg(null)
    setData(null)

    httpClient
      .getNoteNoCancel(id)
      .then((data) => {
        setData(data)
        // console.log(data)
        setIsLoaded(true)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        setErrorMsg(typeof err === 'string' ? err : err.message || 'No err.message')
        setIsLoaded(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isLogged])

  return (
    <li
      onClick={onClick}
      className={clsx(classes.truncate, classes.badge, classes.defaultBadge, {
        [classes.activeDefault]: isActive,
        [classes.activePrivate]: isActive && id === data?._id && data?.isPrivate,
        [classes.defaultPrivate]: !isActive && id === data?._id && data?.isPrivate,
        [classes.defaultNotPrivate]: !isActive && !data?.isPrivate,
      })}
      {...rest}
    >
      {isLoading && <CircularProgress size={8} color="inherit" style={{ marginRight: '5px' }} />}
      {!!errorMsg && errorMsg}
      {isLoaded && data?.title}
    </li>
  )
}
