import { Box, Container } from '@material-ui/core'
import { useStyles } from './styles'

export const Footer = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.container}>
      <Box p={2} style={{ borderTop: '1px solid lightgray' }}>
        2021
      </Box>
    </Container>
  )
}
