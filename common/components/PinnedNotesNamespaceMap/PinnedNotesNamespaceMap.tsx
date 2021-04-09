import React, { useMemo } from 'react'
import { CreateNamespace, LSControl, LSResult } from './components'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'
import { useGlobalAppContext } from '~/common/hooks'
// import { useStyles } from './styles'

const getLSSpace = (toFixedArg = 2) => {
  if (typeof window === 'undefined') return 0

  let allStrings = ''
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      allStrings += window.localStorage[key]
    }
  }
  return allStrings ? (3 + (allStrings.length * 16) / (8 * 1024)).toFixed(toFixedArg) + ' KB' : '0 KB'
}

export const PinnedNotesNamespaceMap = () => {
  // const classes = useStyles()
  const { pinnedMap } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  // const totalSizeLS = useMemo(() => (typeof window !== 'undefined' ? new Blob(Object.values(localStorage)).size : 0), [typeof window])
  const totalSizeLS = useMemo(() => (typeof window !== 'undefined' ? getLSSpace() : 0), [typeof window, pinnedMap])

  return (
    <div
    // className={classes.wrapper}
    >
      <CollabsibleContent title="Create namespace" contentRenderer={() => <CreateNamespace />} />
      {pinnedMapKeys.length > 0 && (
        <>
          <CollabsibleContent
            // titleColor="gray"
            title={`LS Result (${totalSizeLS})`}
            contentRenderer={() => <LSResult />}
            isOpenedByDefault
          />
          <CollabsibleContent title="LS Control" contentRenderer={() => <LSControl />} />
        </>
      )}
    </div>
  )
}
