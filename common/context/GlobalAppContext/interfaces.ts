export enum ELSFields {
  MainPinnedNamespaceMap = 'pinned-namespace-map',
  LocalNotesPinnedNamespaceMap = 'pinned-namespace-map.local',
  LocalNotes = 'my-local-notes',
  PinnedNotesSearchField = 'pinned-notes.search-field',
  MainSearch = 'main.search',
}

export type TPagination = {
  curentPage: number
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
