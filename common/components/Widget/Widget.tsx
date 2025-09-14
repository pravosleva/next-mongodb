import { useCallback, useMemo } from 'react'
import { Box, Button } from '@material-ui/core'
import { useStyles, widgetWidthDesktop } from './styles'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { useWindowSize } from '~/common/hooks'
import { useRouter } from 'next/router'
import { useWidgetContext, EWidgetNames } from '~/common/components/Widget'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

type TProps = {
  widgetName: EWidgetNames
  isMobileOnly: boolean
  // forLgOnly?: boolean
  children: React.FC
  side?: 'left' | 'right'
  label?: any
  togglerStyles?: CSSProperties
  contentWrapperStyles?: CSSProperties
  isChatFrame?: boolean
  hideYellowTogglerIfOpened?: boolean
}

export const Widget: React.FC<TProps> = ({
  children,
  isMobileOnly,
  widgetName,
  side,
  label,
  togglerStyles,
  contentWrapperStyles,
  isChatFrame,
  hideYellowTogglerIfOpened,
  // forLgOnly,
}) => {
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
      ) : !!label ? (
        label
      ) : (
        widgetTogglerLabel
      ),
    // @ts-ignore
    [state[widgetName], label]
  )
  // const hasOpenedWigget = useMemo(() => Object.values(state).some((s) => !!s), [state])

  // if ((isMobileOnly && isDesktop) || !((isDesktop && !(hasOpenedWigget && downLg)))) return null
  if (isMobileOnly && isDesktop) return null
  // if (forLgOnly && !upLg) return null
  // if (router.pathname !== '/' && router.pathname !== '/notes/[id]') return null
  if (router.pathname === '/notes/[id]/edit') return null

  return (
    <>
      <div
        className={clsx(classes.fixedDesktopWidget, {
          // [classes.openedWidget]: isWidgetOpened,
          [classes.left]: side === 'left',
          [classes.right]: side !== 'left',
          left: side === 'left',
          right: side !== 'left',
          // @ts-ignore
          [classes.openedWidget]: state[widgetName] === true,
        })}
      >
        <button className={classes.absCloseBtn} onClick={handleToggleWidget}>
          <CloseIcon />
        </button>
        <Box boxShadow={3} className={clsx(classes.widgetPaper, classes.buttonsWrapper, 'paper')}>
          <Button
            onClick={handleToggleWidget}
            size="medium"
            variant="contained"
            color="inherit"
            className={clsx('widget-toggler-btn', {
              // @ts-ignore
              [classes.hidden]: hideYellowTogglerIfOpened && !!state[widgetName],
            })}
            style={!!togglerStyles ? togglerStyles : {}}
            // disabled={isLoading}
          >
            {/* isWidgetOpened ? <CloseIcon /> : widgetTogglerLabel */}
            {/* @ts-ignore */}
            {MemoizedLabel}
          </Button>
          <div
            className={clsx(classes.heightLimit, classes.insetShadow)}
            style={!!contentWrapperStyles ? contentWrapperStyles : {}}
          >
            {isChatFrame ? (
              <iframe
                key={isDesktop ? 'd' : 'm'}
                title="Chat"
                src="http://pravosleva.ru/express-helper/chat/#?room=code-samples.space"
                style={{
                  width: isDesktop ? `${widgetWidthDesktop}px` : '100vw',
                  height: '100dvh',
                  border: 'none',
                }}
              />
            ) : (
              children
            )}
          </div>
        </Box>
      </div>
    </>
  )
}
