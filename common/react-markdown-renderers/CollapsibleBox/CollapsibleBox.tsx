import { useState, useCallback, useMemo } from 'react'
import Icon from '@mdi/react'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/common/react-markdown-renderers'
// import classes from './CollapsibleBox.module.scss'
import { useStyles } from './styles'
import { isValidJson } from '~/utils/isValidJson'
import clsx from 'clsx'
// import slugify from 'slugify'

type TProps = {
  header: string;
  text: string;
  actionsJson?: string;
  // t: (v: string) => string;
}

export const CollapsibleBox = ({ header, text, actionsJson }: TProps) => {
  const isActionsRequired = useMemo(() => typeof actionsJson === 'string', [actionsJson])
  const isActionsValid = useMemo(() => !!actionsJson && isActionsRequired && isValidJson(actionsJson), [isActionsRequired, actionsJson])
  const parsedActions = useMemo(() => (!!actionsJson && isActionsRequired && isActionsValid)
    ? JSON.parse(actionsJson)
    : null, [actionsJson, isActionsRequired, isActionsValid])
  const [isOpened, setIsOpened] = useState(false)
  const handleToggle = useCallback(() => {
    setIsOpened((s) => !s)
  }, [setIsOpened])
  const classes = useStyles()

  const handleClickLink = useCallback(({ link, label }: { link: string; label: string }) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    const hasLocalLinkClicked = (label === 'LOCAL_LINK' && typeof link === 'string' && link[0] === '#') || false
    // const hasNewTabLinkClicked = (label === 'NEW_TAB_LINK' && typeof link === 'string' && !!link) || false
    // const hasCurrentTabLinkClicked = (label === 'CURRENT_TAB_LINK' && typeof link === 'string' && !!link) || false

    switch (true) {
      case hasLocalLinkClicked:{
          e.preventDefault()
          try {
            const elmId = link.substring(1)
            const elm = document.getElementById(elmId)

            if (!!elm) elm.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            else throw new Error(`Element not found: ${link}`)
          } catch (err: any) {
            console.log(err?.message || 'No err.message')
          }
          break
        }
      // case hasNewTabLinkClicked: {
      //   break
      // }
      // case hasCurrentTabLinkClicked: {
      //   break
      // }
      default:
        break
    }
  }, [])
  // const togglerSlug = slugify(header).toLowerCase() 

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '2px solid inherit',
        padding: '16px',
        transition: '0.2s all ease',
        borderRadius: isOpened ? '20px' : '28px',
        // color: textColor,
        backgroundColor: '#fff',
        boxShadow: '0 8px 6px -6px rgba(0,0,0,0.3)',
        marginBottom: '20px',

        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={handleToggle}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '16px',
        }}
        className={classes.collapsible}
      >
        {/* <input id={togglerSlug} type='checkbox' style={{ border: '1px solid red' }} />
        <label style={{ fontWeight: 'bold' }} htmlFor={togglerSlug}>{header}</label> */}
        <div style={{ fontWeight: 'bold' }}>{header}</div>
        <div
          style={{
            marginLeft: 'auto',
            border: '2px solid inherit',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            isOpened
              ? <Icon path={mdiChevronUp} />
              : <Icon path={mdiChevronDown} />
          }
        </div>
      </div>
      
      {isOpened && (
        <div
          style={{ fontSize: '0.8em' }}
          className={clsx(classes.noMarginBottomForLastChild)}
        >
          <ReactMarkdown
            // @ts-ignore
            plugins={[gfm, { singleTilde: false }]}
            renderers={theNotePageRenderers}
            children={text}
          />
        </div>
      )}

      {
        isOpened && !!parsedActions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {
              parsedActions.map(({ link, label, target }: { link: 'string'; label: 'string'; target?: '_blank' | '_self' }, i: number) => {
                return (
                  <a
                    key={`${link}-${i}`}
                    className={clsx('link-as-rippled-btn', 'truncate')}
                    href={link}
                    onClick={handleClickLink({ link, label })}
                    style={{
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                    target={target || '_self'}
                  >
                    {label}
                  </a>
                )
              })
            }
          </div>
        )
      }
      {
        isOpened && isActionsRequired && !isActionsValid && (
          <>
            <pre style={{ marginBottom: '0px !important' }}>{JSON.stringify({
              isActionsRequired,
              isActionsValid,
            }, null, 2)}</pre>
            <div>Incorrect props</div>
          </>
        )
      }
    </div>
  )
}