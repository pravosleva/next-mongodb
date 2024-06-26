export enum ELSFields {
  MainPinnedNamespaceMap = 'pinned-namespace-map',
  LocalNotesPinnedNamespaceMap = 'pinned-namespace-map.local',
  LocalNotes = 'my-local-notes',
  PinnedNotesSearchField = 'pinned-notes.search-field',
  MainSearch = 'main.search',
  SubscribedTags = 'tags.subscribed',
}

export type TPagination = {
  currentPage: number
  totalPages: number
  totalNotes: number
}
export interface IState {
  notes: any
  pagination: TPagination
  searchByTitle: string
  searchByDescription: string
  activeNote: any | null
  localPage: number
}
