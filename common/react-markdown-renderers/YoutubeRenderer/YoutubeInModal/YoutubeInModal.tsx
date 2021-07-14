import { useState } from 'react'
import clsx from 'clsx'
import { useStyles } from './styles'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { TransparentModal } from '~/common/components/TransparentModal'
import { YoutubePlayer } from '~/common/react-markdown-renderers/YoutubeRenderer/YoutubePlayer'
import { useWindowSize } from '~/common/hooks'
import { makeStyles } from '@material-ui/core/styles'

type TProps = {
  previewSrc?: string
  videoId: string
}

export const YoutubeInModal = ({ previewSrc, videoId }: TProps) => {
  const classes = useStyles()

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const modalToggler = (val?: boolean) => {
    if (val === true || val === false) {
      setIsOpened(val)
    } else {
      setIsOpened((s) => !s)
    }
  }
  const { isDesktop } = useWindowSize()
  const useStyles2 = makeStyles({
    customBg: (props: { previewSrc?: string }) => ({
      backgroundImage: !!props.previewSrc
        ? `url(${props.previewSrc})`
        : 'url(/static/img/youtube-default-preview-0.jpeg)',
    }),
  })
  const classes2 = useStyles2({ previewSrc })

  return (
    <>
      <div className={clsx(classes.wrapper, classes2.customBg)} onClick={() => modalToggler()}>
        <div className={classes.arrowBox}>
          <div className={clsx(classes.arrow, 'arrow-hover')}>
            <PlayArrowIcon fontSize="large" color="inherit" />
          </div>
        </div>
        <div className={clsx(classes.internalWrapper, 'dimmer')} />
      </div>

      <TransparentModal isOpened={isOpened} onClose={() => modalToggler(false)}>
        <div style={{ width: isDesktop ? '850px' : '300px' }}>
          <YoutubePlayer
            videoId={videoId}
            opts={{
              playerVars: {
                // NOTE: See also https://developers.google.com/youtube/player_parameters
                autoplay: 1,
              },
            }}
          />
        </div>
      </TransparentModal>
    </>
  )
}
