import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import Gist from 'react-gist'
import { Alert } from './Alert'
import { ImageInNewTab } from './ImageRenderer'
import { JSONComparison } from './JSONComparison'
import { ImagesGalleryBox } from './ImagesGalleryBox'

const componentTransforms = {
  Alert: (props: any) => <Alert text={props.value} {...props} />,
  React: (props: any) => <>{props.children}</>,
  YoutubeGrid,
  YoutubeInModal,
  YoutubePlayer,
  Gist: ({ gistId }: { gistId: string }) => <Gist id={gistId} />,
  ImageInNewTab: (props: any) => <ImageInNewTab {...props} />,
  JSONComparison: (props: any) => <JSONComparison {...props} />,
  ImagesGalleryBox: (props: any) => <ImagesGalleryBox {...props} />,
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
