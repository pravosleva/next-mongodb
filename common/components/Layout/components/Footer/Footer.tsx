import { Box, Container } from '@material-ui/core'
import { useStyles } from './styles'

export const Footer = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.container}>
      <div style={{ borderTop: '1px solid lightgray' }}>
        <Box m={2}>2021</Box>
      </div>
    </Container>
  )
}
