import { useState, useCallback } from 'react'
import { Box, Button } from '@material-ui/core'
import { useStyles } from './styles'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { useWindowSize } from '~/common/hooks'

type TProps = {
  isMobileOnly: boolean
  children: React.FC
}

export const Widget: React.FC<TProps> = ({ children, isMobileOnly }) => {
  const classes = useStyles()
  const [isWidgetOpened, setIsWidgetOpened] = useState<boolean>(false)
  const handleToggleWidget = useCallback(() => {
    setIsWidgetOpened((state) => !state)
  }, [setIsWidgetOpened])
  const widgetTogglerLabel = 'Sidebar'
  const { isDesktop } = useWindowSize()

  if (isMobileOnly && isDesktop) return null
  return (
    <>
      <div
        className={clsx(classes.fixedDesktopWidget, {
          [classes.openedWidget]: isWidgetOpened,
        })}
      >
        <Box boxShadow={3} className={clsx(classes.widgetPaper, classes.buttonsWrapper)}>
          <Button
            onClick={handleToggleWidget}
            size="small"
            variant="contained"
            color="inherit"
            className={classes.widgetTogglerBtn}
            // disabled={isLoading}
          >
            {isWidgetOpened ? <CloseIcon /> : widgetTogglerLabel}
          </Button>
          <div className={classes.heightLimit}>{children}</div>
        </Box>
      </div>
    </>
  )
}
