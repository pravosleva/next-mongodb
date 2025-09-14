import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

export const CircularIndeterminate = () => {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '16px',
      }}
    >
      <CircularProgress />
    </Box>
  )
}
