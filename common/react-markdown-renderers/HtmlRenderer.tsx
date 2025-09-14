import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import Gist from 'react-gist'
import { Alert } from './Alert'
import { ControlsBox } from './ControlsBox'
import { ImageInNewTab } from './ImageRenderer'
import { JSONComparison } from './JSONComparison'
import { ImagesGalleryBox, ImagesGalleryBox2 } from './ImagesGalleryBox'
import { CollapsibleBox } from './CollapsibleBox'
import { CardsExample } from './CardsExample'

const componentTransforms = {
  Alert: (props: any) => <Alert text={props.value} {...props} />,
  ControlsBox: (props: any) => <ControlsBox {...props} />,
  React: (props: any) => <>{props.children}</>,
  YoutubeGrid,
  YoutubeInModal,
  YoutubePlayer,
  Gist: ({ gistId }: { gistId: string }) => <Gist id={gistId} />,
  ImageInNewTab: (props: any) => <ImageInNewTab {...props} />,
  JSONComparison: (props: any) => <JSONComparison {...props} />,
  ImagesGalleryBox: (props: any) => <ImagesGalleryBox {...props} />,
  ImagesGalleryBox2: (props: any) => <ImagesGalleryBox2 {...props} />,
  CollapsibleBox: (props: any) => <CollapsibleBox {...props} />,
  CardsExample: (props: any) => <CardsExample {...props} />,
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
