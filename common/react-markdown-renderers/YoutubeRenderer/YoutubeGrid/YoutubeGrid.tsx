import { useMemo } from 'react'
import YouTubeVideo from 'react-youtube'
import { useStyles } from './styles'
import clsx from 'clsx'
import { Alert, AlertTitle } from '@material-ui/lab'

type TProps = {
  json: string
}

function isJsonString(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const YoutubeGrid = ({ json }: TProps) => {
  const classes = useStyles()
  const isValidJson = useMemo(() => isJsonString(json), [json])

  if (!isValidJson)
    return (
      <Alert variant="outlined" severity="error" style={{ marginBottom: '16px' }}>
        <AlertTitle>Incorrect JSON</AlertTitle>
        Should be like this:
        <pre style={{ margin: '0px !important' }}>
          {`<YoutubeGrid json='["l-EdCNjumvI", "oPssk0PEwtg", "hqgVYX3zhug", "_i_qxQztHRI", "6XQHpUiiKgc"]' />`}
        </pre>
      </Alert>
    )

  const videoIds = JSON.parse(json)

  return (
    <>
      {!videoIds && Array.isArray(videoIds) ? (
        <Alert className="info" variant="outlined" severity="info" style={{ marginBottom: '16px' }}>
          <AlertTitle>Incorrect data</AlertTitle>
          Incorrect props: videoIds should be an Array of strings!
        </Alert>
      ) : (
        <div className={classes.grid}>
          {videoIds.map((id: string, i: number) => (
            <div key={i} className={clsx('grid-item', classes.externalWrapper)}>
              <div className={classes.reactYoutubeContainer}>
                <YouTubeVideo videoId={id} className={classes.reactYoutube} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
