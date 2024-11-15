import { useMemo, useState, memo } from 'react'
import { useStyles } from './styles'
import { isValidJson } from '~/utils/isValidJson'
// import { Gallery, Image } from 'react-grid-gallery'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { CircularIndeterminate } from '~/common/components/CircularIndeterminate'
import { TNormalizedItem, TProps } from './types'

// interface ICustomImage extends Image {
//   original: string;
// }

/* NOTE: Example
const images: CustomImage[] = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    original: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    width: 320,
    height: 174,
    tags: [
      { value: "Nature", title: "Nature" },
      { value: "Flora", title: "Flora" },
    ],
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
]
*/

export const ImagesGalleryBox = memo(({ itemsJson }: TProps) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(itemsJson), [itemsJson])

  const normalizedItems = useMemo<TNormalizedItem[]>(() => JSON.parse(itemsJson), [itemsJson])
  const [index, setIndex] = useState(-1)
  const currentImage = normalizedItems[index]
  const nextIndex = (index + 1) % normalizedItems.length
  const nextImage = normalizedItems[nextIndex] || currentImage
  const prevIndex = (index + normalizedItems.length - 1) % normalizedItems.length
  const prevImage = normalizedItems[prevIndex] || currentImage

  const handleClick = (index: number) => setIndex(index)
  const handleClose = () => setIndex(-1)
  const handleMovePrev = () => setIndex(prevIndex)
  const handleMoveNext = () => setIndex(nextIndex)

  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (!arePropsValid) return <div>INVALID PROPS!</div>

  if (isServer) return <CircularIndeterminate />

  if (normalizedItems.length === 0) return <b>Empty ImagesGalleryBox</b>

  return (
    <div className={styles.wrapper}>
      <div className={styles.srLWrapperLayout}>
        {normalizedItems.map(({ src, title }, i) => {
          return <img key={src} src={src} alt={title || 'img'} onClick={() => handleClick(i)} />
        })}
      </div>

      {/* <Gallery
        // key={Math.random()}
        images={[...normalizedItems]}
        onClick={handleClick}
        enableImageSelection={false}
        // thumbnailStyle={{}}
        // tileViewportStyle={{}}
        margin={0}
        rowHeight={210}
      /> */}

      {!!currentImage && (
        <Lightbox
          mainSrc={currentImage.original}
          imageTitle={currentImage.title}
          imageCaption={currentImage.caption}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.original}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.original}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </div>
  )
})
