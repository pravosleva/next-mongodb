import { memo, useState, useEffect } from 'react'
// import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
// import Link from 'next/link'
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import Icon from '@mdi/react'
// import { mdiArrowRight } from '@mdi/js'
// import { useSelector } from 'react-redux'
// import { IRootState } from '~/store/IRootState'
import { Alert, AlertTitle } from '@material-ui/lab'
import { useStyles } from './styles'
import {
  TProps,
  TNormalizedItem,
} from './types'
// import clsx from 'clsx'

export const CardsExample = memo((ps: TProps) => {
  const styles = useStyles()
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    try {
      switch (true) {
        case typeof ps?.itemsJson === 'string':
          JSON.parse(ps?.itemsJson)
          setErrMsg(null)
          break
        default:
          throw new Error(`🚫 Incorrect type: ${typeof ps?.itemsJson}`)
      }
    } catch (e: any) {
      // console.warn(e)
      setErrMsg(e?.message || 'Incorrect props')
    }
  }, [ps?.itemsJson])

  const normalizedItems: TNormalizedItem[] = !!ps?.itemsJson ? JSON.parse(ps?.itemsJson) : []
  // const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {
        !errMsg && Array.isArray(normalizedItems) && normalizedItems.length > 0 && (
          <div
            // style={wrapperStyles}
            className={styles.wrapper}
          >
            {normalizedItems.map((item, i) => {
              return (
                <div className={styles.cardWrapper} key={`${i}-${item?.id}`}>
                  <div
                    className={styles.card}
                    style={{
                      ...(!!item.bgUrl
                        ? {
                          objectFit: 'cover',
                          backgroundImage: `url(${item.bgUrl})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                        : {}),
                      border: !!item.bgUrl ? 'none' : '2px solid #959eaa',
                    }}
                  >
                    <div
                      className={styles.internalCardContent}
                      style={{
                        height: 'inherit',
                        // background: 'linear-gradient(rgba(1, 98, 200, 0.9) 30%, rgba(1, 98, 200, 0.65) 60%, rgba(255, 255, 255, 0) 100%)'
                        background: !!item.bgUrl
                          ? 'linear-gradient(rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.4) 100%)'
                          : 'none',
                        color: !!item.bgUrl ? '#FFF' : 'inherit',
                      }}
                    >
                      <h3 style={{ margin: '0px', padding: '0px' }}>{item.title}</h3>
                      {!!item.descr && <span style={{ fontSize: '0.8em' }}>{item.descr}</span>}
                      {/*
                        !!item.links && item.links.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '16px',
                              justifyContent: 'flex-end',
                              marginTop: 'auto',
                            }}
                          >
                            {item.links.map(({ title, url }, i) => (
                              <ThemedButton
                                // className={clsx({
                                //   'backdrop-blur--lite': currentTheme === 'dark' || currentTheme === 'hard-gray',
                                // })}
                                key={`${i}-${url}`}
                                // fullWidth
                                variant="contained"
                                color={EColorValue.default}
                                component={Link}
                                noLinkStyle
                                // NOTE: v1
                                href={url}
                                target="_blank"
                                // NOTE: v2
                                // href='/blog/article/[slug]'
                                // as={`/blog/article/${slugMap.get(_id)?.slug || ''}`}

                                endIcon={<Icon path={mdiArrowRight} size={1} />}
                                sx={{
                                  // color: !(currentTheme === 'dark' || currentTheme === 'hard-gray') ? '#000' : 'inherit',
                                  color: '#000',
                                  // backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FFC800',
                                  backgroundColor: '#FFC800',
                                  '&:hover': {
                                    // backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FF8E53',
                                    backgroundColor: '#FF8E53',
                                  },
                                  '&:focus': {
                                    // backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FF8E53',
                                    backgroundColor: '#FF8E53',
                                  },
                                }}
                              >
                                {title}
                              </ThemedButton>
                            ))}
                          </div>
                        )
                      */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
      <Alert
        variant='outlined'
        severity={!!errMsg ? 'error' : 'info'}
      // style={{ marginBottom: '16px' }}
      >
        <AlertTitle>Exp</AlertTitle>
        {!!errMsg && <em>{errMsg}</em>}
        <pre style={{ margin: '0px !important' }}>
          {JSON.stringify({ ps, normalizedItems }, null, 2)}
        </pre>
      </Alert>
    </div>
  )
})
