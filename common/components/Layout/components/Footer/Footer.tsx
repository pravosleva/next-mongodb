import { Box, Container } from '@material-ui/core'
import { useStyles } from './styles'

export const Footer = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.container}>
      <Box style={{ borderTop: '1px solid lightgray', padding: '8px 0 8px 0', minHeight: '64px' }}>
        © code-samples.space 2021
      </Box>
    </Container>
  )
}
