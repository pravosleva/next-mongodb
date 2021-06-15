import { useCallback, useMemo } from 'react'
import { Box, Button } from '@material-ui/core'
import { useStyles } from './styles'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { useWindowSize } from '~/common/hooks'
import { useRouter } from 'next/router'
import { useWidgetContext, EWidgetNames } from '~/common/components/Widget'

type TProps = {
  widgetName: EWidgetNames
  isMobileOnly: boolean
  children: React.FC
}

export const Widget: React.FC<TProps> = ({ children, isMobileOnly, widgetName }) => {
  const classes = useStyles()
  // const [isWidgetOpened, setIsWidgetOpened] = useState<boolean>(false)
  const { state, widgetToggler } = useWidgetContext()
  const handleToggleWidget = useCallback(() => {
    // setIsWidgetOpened((state) => !state)
    widgetToggler(widgetName)
  }, [
    // setIsWidgetOpened,
    widgetToggler,
  ])
  const widgetTogglerLabel = 'Sidebar'
  const { isDesktop } = useWindowSize()
  const router = useRouter()
  const MemoizedLabel = useMemo(
    () =>
      // @ts-ignore
      !!state[widgetName] ? (
        <>
          <CloseIcon />
        </>
      ) : (
        widgetTogglerLabel
      ),
    // @ts-ignore
    [state[widgetName]]
  )

  if (isMobileOnly && isDesktop) return null
  // if (router.pathname !== '/' && router.pathname !== '/notes/[id]') return null
  if (router.pathname === '/notes/[id]/edit') return null

  return (
    <>
      <div
        className={clsx(classes.fixedDesktopWidget, {
          // [classes.openedWidget]: isWidgetOpened,
          // @ts-ignore
          [classes.openedWidget]: state[widgetName] === true,
        })}
      >
        <Box boxShadow={3} className={clsx(classes.widgetPaper, classes.buttonsWrapper)}>
          <Button
            onClick={handleToggleWidget}
            size="medium"
            variant="contained"
            color="inherit"
            className={classes.widgetTogglerBtn}
            // disabled={isLoading}
          >
            {/* isWidgetOpened ? <CloseIcon /> : widgetTogglerLabel */}
            {/* @ts-ignore */}
            {MemoizedLabel}
          </Button>
          <div className={clsx(classes.heightLimit, classes.insetShadow)}>{children}</div>
        </Box>
      </div>
    </>
  )
}
