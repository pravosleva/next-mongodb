import { useNotifsContext } from '~/common/hooks'

interface IProps {
  alt: string
  src: string
}

export const ImageInNewTab = ({ alt, src }: IProps) => {
  // const [fullSize, setFullSize] = useState<boolean>(false)
  const { addDangerNotif } = useNotifsContext()
  const handleClick = () => {
    try {
      if (!!window) {
        // @ts-ignore
        const toBeOrNot = window.confirm('Go to new tab?')

        if (toBeOrNot) {
          // @ts-ignore
          window.open(src, '_blank').focus()
        } else {
          addDangerNotif({ message: 'Declined' })
        }
      }
    } catch (err: any) {
      const message = typeof err === 'string' ? err : err?.message || 'No err.message'
      addDangerNotif({ message })
    }
  }

  return (
    <div style={{ margin: '0 0 1em' }}>
      <img className="small" alt={alt} src={src} onClick={handleClick} />
    </div>
  )
}
