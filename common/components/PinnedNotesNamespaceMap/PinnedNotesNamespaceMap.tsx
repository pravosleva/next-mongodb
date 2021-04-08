import React from 'react'
import { CreateNamespace, LSControl, LSResult } from './components'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'

export const PinnedNotesNamespaceMap = () => {
  return (
    <div>
      <CollabsibleContent title="Create namespace" contentRenderer={() => <CreateNamespace />} />
      <CollabsibleContent title="LS Control" contentRenderer={() => <LSControl />} />
      <CollabsibleContent title="LS Result" contentRenderer={() => <LSResult />} isOpenedByDefault />
    </div>
  )
}
