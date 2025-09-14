import React, { useMemo } from 'react'
import { CreateNamespace, LSControl, LSResult } from './components'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'
import { useGlobalAppContext } from '~/common/hooks'
// import { useStyles } from './styles'
import { getLSSpace } from '~/utils/getLSSpace'
import { ELSFields } from '~/common/context'

export const PinnedNotesNamespaceMap = () => {
  // const classes = useStyles()
  const { pinnedMap, localNotes } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  // const totalSizeLS = useMemo(() => (typeof window !== 'undefined' ? new Blob(Object.values(localStorage)).size : 0), [typeof window])
  const totalSizeLS = useMemo(
    () => (typeof window !== 'undefined' ? getLSSpace(2, ELSFields.MainPinnedNamespaceMap) : 0),
    [typeof window, pinnedMap, localNotes]
  )
  const totalCounter = useMemo(() => {
    if (!pinnedMap) return 0

    let result = 0

    // @ts-ignore
    for (const namespace in pinnedMap) {
      // @ts-ignore
      if (Array.isArray(pinnedMap[namespace].ids) && pinnedMap[namespace].ids.length > 0)
        // @ts-ignore
        result += pinnedMap[namespace].ids.length
    }

    return result
  }, [pinnedMap])

  return (
    <div
    // className={classes.wrapper}
    >
      <CollabsibleContent
        title="Create namespace"
        contentRenderer={(collabsiblePs) => <CreateNamespace {...collabsiblePs} />}
      />
      {pinnedMapKeys.length > 0 && (
        <>
          <CollabsibleContent
            title={`My pinned notes (${totalCounter}) | ${totalSizeLS} in LS`}
            contentRenderer={() => <LSResult />}
            // isOpenedByDefault
          />
          <CollabsibleContent title="LS Control ☢️" contentRenderer={() => <LSControl />} />
        </>
      )}
    </div>
  )
}
