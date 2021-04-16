import { createContext, useReducer, useState, useEffect, useRef, useContext } from 'react'
import buildUrl from 'build-url'
import { useAuthContext, useDebounce, useNotifsContext } from '~/common/hooks'
import { useRouter } from 'next/router'
import { data as defaultPaginationData } from '~/common/constants/default-pagination'
import { scrollTop } from '~/utils/scrollTo'
import { getStandardHeadersByCtx } from '~/utils/next/getStandardHeadersByCtx'
// import { useWindowSize } from '~/common/hooks'
import ls from 'local-storage'
import slugify from 'slugify'

const NEXT_APP_API_ENDPOINT: string = process.env.NEXT_APP_API_ENDPOINT || ''

type TPagination = {
  curentPage: number
  totalPages: number
  totalNotes: number
}
interface IState {
  notes: any
  pagination: TPagination
  searchByTitle: string
  searchByDescription: string
  activeNote: any | null
  localPage: number
}

export const getInitialState = (base: Partial<IState>): IState => ({
  notes: [],
  pagination: {
    curentPage: 0,
    totalPages: 0,
    totalNotes: 0,
  },
  searchByTitle: '',
  searchByDescription: '',
  activeNote: null,
  localPage: 1,

  ...base,
})

export const GlobalAppContext = createContext({
  state: getInitialState({}),
  setPage: () => {
    throw new Error('setPage method should be implemented')
  },
  handleSearchByTitleClear: (): void | never => {
    throw new Error('handleSearchByTitleClear method should be implemented')
  },
  handleSearchByDescriptionClear: (): void | never => {
    throw new Error('handleSearchByDescriptionClear method should be implemented')
  },
  handleSetAsActiveNote: (_note: any): void | never => {
    throw new Error('handleSetAsActiveNote method should be implemented')
  },
  handleResetActiveNote: (): void | never => {
    throw new Error('handleResetActiveNote method should be implemented')
  },
  handlePageChange: (_ev: any, _data: any): void | never => {
    throw new Error('handlePageChange method should be implemented')
  },
  isNotesLoading: false,
  initPagination: () => {
    throw new Error('initPagination method should be implemented')
  },
  initState: (_state: any): void | never => {
    throw new Error('initState method should be implemented')
  },
  handleSearchByDescriptionSetText: (_text: string): void | never => {
    throw new Error('handleSearchByDescriptionSetText method should be implemented')
  },
  handleSearchByTitleSetText: (_text: string): void | never => {
    throw new Error('handleSearchByTitleSetText method should be implemented')
  },
  handleUpdateOneNote: (_note: any): void | never => {
    throw new Error('handleUpdateOneNote method should be implemented')
  },
  handleRemoveOneNote: (_id: string): void | never => {
    throw new Error('handleRemoveOneNote method should be implemented')
  },
  handleAddOneNote: (_note: any): void | never => {
    throw new Error('handleAddOneNote method should be implemented')
  },
  handleSetNotesResponse: (_arg: any): void | never => {
    throw new Error('handleSetNotesResponse method should be implemented')
  },
  handlePinToLS: (_arg: any, _lsField: ELSFields): void | never => {
    throw new Error('handlePinToLS method should be implemented')
  },
  handleUnpinFromLS: (_id: string, _lsField: ELSFields): void | never => {
    throw new Error('handleUnpinFromLS method should be implemented')
  },
  pinnedIds: [],
  pinnedMap: null,
  localNotesPinnedNamespaceMap: null,
  isPinnedToLS: (_id: string, _lsField: ELSFields): Promise<any> => Promise.reject(false),
  // createTestPinnedMap: (): void | never => {
  //   throw new Error('createTestPinnedMap method should be implemented')
  // },
  removeNamespace: (_namespace: string, _lsField: ELSFields): void | never => {
    throw new Error('removeNamespace method should be implemented')
  },
  createNamespacePromise: async (_opts: any, _lsField: ELSFields): Promise<any> => {
    return Promise.reject('createNamespacePromise method should be implemented')
  },
  replaceNamespaceInLS: (_args: any, _lsField: ELSFields): void | never => {
    throw new Error('replaceNamespaceInLS method should be implemented')
  },
  saveLocalNote: (_arg: {
    id?: string
    title: string
    description: string
    cbSuccess: (localNotes: any[]) => void
  }): void | never => {
    throw new Error('saveLocalNote method should be implemented')
  },
  removeLocalNote: (_id: string): void | never => {
    throw new Error('removeLocalNote method should be implemented')
  },
  localNotes: [],
})

function reducer(state: any, action: any) {
  let newState = { ...state }

  switch (action.type) {
    case 'SEARCH_BY_TITLE@SET':
      return { ...state, searchByTitle: action.payload, localPage: 1 }
    case 'SEARCH_BY_DESCRIPTION@SET':
      return { ...state, searchByDescription: action.payload, localPage: 1 }
    case 'SEARCH_BY_ANYTHING@RESET':
      return { ...state, searchByDescription: '', searchByTitle: '', localPage: 1 }
    case 'ACTIVE_NOTE@SET':
      return { ...state, activeNote: action.payload }
    case 'ACTIVE_NOTE@RESET':
      return { ...state, activeNote: null }
    case 'NOTES_RESPONSE@SET':
      return {
        ...state,
        ...action.payload,
      }
    case 'INIT_STATE':
      return action.payload
    case 'SET_LOCAL_PAGE':
      return {
        ...state,
        localPage: action.payload,
      }
    case 'UPDATE_ONE_NOTE':
      const theNoteIndex = state.notes.findIndex(({ _id }: any) => _id === action.payload._id)

      if (theNoteIndex !== -1) {
        newState.notes[theNoteIndex] = action.payload
        return newState
      }

      return state
    case 'REMOVE_ONE_NOTE':
      newState.notes = newState.notes.filter(({ _id }: any) => _id !== action.payload)

      return newState
    case 'ADD_ONE_NOTE':
      newState.notes = [...newState.notes, action.payload]

      return newState
    default:
      return state
  }
}

const getMsgStr = (err: any) => (typeof err === 'string' ? err : err.message || 'No err.message')

export enum ELSFields {
  MainPinnedNamespaceMap = 'pinned-namespace-map',
  LocalNotesPinnedNamespaceMap = 'pinned-namespace-map.local',
  LocalNotes = 'my-local-notes',
}

export const GlobalAppContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, getInitialState({}))
  const debouncedSearchByTitle = useDebounce(state.searchByTitle, 1000)
  const debouncedSearchByDescription = useDebounce(state.searchByDescription, 1000)
  const handleScrollTop = (noAnimation: boolean = false) => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        if (window.location.href.indexOf('#') === -1) scrollTop(0, noAnimation)
        // else {
        //   console.log(
        //     window.location.href.substr(window.location.href.indexOf('#') + 1, window.location.href.length - 1)
        //     // OUTPUT: hash wihout #
        //   )
        // }
      }
    }, 0)
    return Promise.resolve()
  }

  const handlePageChange = (_ev: any, data: any) => {
    handleScrollTop(true).then(() => {
      dispatch({ type: 'SET_LOCAL_PAGE', payload: data.activePage })
    })
  }
  const debouncedPage = useDebounce(state.localPage, 1000)
  const renderCountRef = useRef(0)
  const { isLogged } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    renderCountRef.current += 1
    if (renderCountRef.current > 0 && renderCountRef.current <= 1) return

    const fetchData = async () => {
      setIsLoading(true)
      const queryParams: any = {
        limit: defaultPaginationData.limit,
      }
      if (!!debouncedSearchByTitle) {
        queryParams.q_title = debouncedSearchByTitle
      }
      if (!!debouncedSearchByDescription) {
        queryParams.q_description = debouncedSearchByDescription
      }
      if (!!debouncedPage && debouncedPage !== 1) {
        queryParams.page = debouncedPage
      }
      const url = buildUrl(NEXT_APP_API_ENDPOINT, {
        path: '/notes',
        queryParams,
      })
      const res = await fetch(url, {
        // @ts-ignore
        headers: getStandardHeadersByCtx(),
      })
      setIsLoading(false)
      const { data, pagination } = await res.json()

      dispatch({ type: 'NOTES_RESPONSE@SET', payload: { notes: data, pagination } })
    }

    fetchData()
  }, [debouncedPage, debouncedSearchByTitle, debouncedSearchByDescription, isLogged])
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('ROUTE')
  // }, [debouncedSearchByTitle, debouncedSearchByDescription])
  const handleSearchByTitleClear = () => {
    dispatch({ type: 'SEARCH_BY_TITLE@SET', payload: '' })
  }
  const handleSearchByDescriptionClear = () => {
    dispatch({ type: 'SEARCH_BY_DESCRIPTION@SET', payload: '' })
  }
  const handleSearchByAnythingClear = () => {
    dispatch({ type: 'SEARCH_BY_ANYTHING@RESET' })
  }
  const router = useRouter()

  useEffect(() => {
    handleScrollTop(true)
    handleSearchByAnythingClear()
  }, [router.pathname])

  // const { isDesktop } = useWindowSize()
  const handleSetAsActiveNote = (note: any) => {
    // eslint-disable-next-line no-console
    // console.log(windowParams)
    // if (isDesktop) scrollTop(125)
    // TODO: No scroll if current scroll position more than 125px
    dispatch({ type: 'ACTIVE_NOTE@SET', payload: note })
  }
  const handleResetActiveNote = () => {
    dispatch({ type: 'ACTIVE_NOTE@RESET' })
  }
  const initState = (state: any) => {
    dispatch({ type: 'INIT_STATE', payload: state })
  }
  const handleSearchByDescriptionSetText = (text: string) => {
    dispatch({ type: 'SEARCH_BY_DESCRIPTION@SET', payload: text })
  }
  const handleSearchByTitleSetText = (text: string) => {
    dispatch({ type: 'SEARCH_BY_TITLE@SET', payload: text })
  }
  const handleUpdateOneNote = (note: any) => {
    dispatch({ type: 'UPDATE_ONE_NOTE', payload: note })
  }
  const handleRemoveOneNote = (id: string) => {
    dispatch({ type: 'REMOVE_ONE_NOTE', payload: id })
  }
  const handleAddOneNote = (note: any) => {
    dispatch({ type: 'ADD_ONE_NOTE', payload: note })
  }
  const handleSetNotesResponse = ({ data, pagination }: any) => {
    dispatch({ type: 'NOTES_RESPONSE@SET', payload: { notes: data, pagination } })
  }

  // --- LS
  const [pinnedMap, setPinnedMap] = useState<any | null>(null)
  const [localNotesPinnedNamespaceMap, setLocalNotesPinnedNamespaceMap] = useState<any | null>(null)
  const [localNotes, setLocalNotes] = useState<any | null>(null)
  const { addInfoNotif, addDangerNotif, addWarningNotif } = useNotifsContext()
  const getFieldFromLS = (fieldName: ELSFields, shouldBeJson: boolean) => {
    // @ts-ignore
    if (!ls(fieldName)) {
      // createEmptyMap(fieldName, {}, (data) => setPinnedMap(data))
      return Promise.reject('Fuckup')
    }

    let dataFromLS

    if (shouldBeJson) {
      try {
        // @ts-ignore
        dataFromLS = JSON.parse(ls.get(fieldName))
      } catch (err) {
        return Promise.reject(getMsgStr(err))
      }
    } else {
      // @ts-ignore
      dataFromLS = ls.get(fieldName)
    }

    return Promise.resolve(dataFromLS)
  }
  const createEmptyMap = (lsFieldName: ELSFields, initialJson: any = {}, cb: (lsData: any) => void) => {
    setFieldToLS(lsFieldName, initialJson, true).then(() => {
      if (!!cb) cb(initialJson)
    })
  }
  useEffect(() => {
    // 1. Namespaces: Main global notes pinned namespace map
    getFieldFromLS(ELSFields.MainPinnedNamespaceMap, true)
      .then((lsData) => {
        setPinnedMap(lsData)
        // addInfoNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: JSON.stringify(lsData) })
      })
      .catch(() => {
        createEmptyMap(ELSFields.MainPinnedNamespaceMap, {}, (data) => setPinnedMap(data))
        // addDangerNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: getMsgStr(err) })
      })
    // 2. Namespaces: local pinned namespace map
    getFieldFromLS(ELSFields.LocalNotesPinnedNamespaceMap, true)
      .then((lsData) => {
        setLocalNotesPinnedNamespaceMap(lsData)
        // addInfoNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: JSON.stringify(lsData) })
      })
      .catch(() => {
        createEmptyMap(ELSFields.LocalNotesPinnedNamespaceMap, {}, (data) => setLocalNotesPinnedNamespaceMap(data))
        // addDangerNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: getMsgStr(err) })
      })
    // 3. Namespaces: Local notes
    getFieldFromLS(ELSFields.LocalNotes, true)
      .then((lsData) => {
        setLocalNotes(lsData)
        // addInfoNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: JSON.stringify(lsData) })
      })
      .catch(() => {
        createEmptyMap(ELSFields.LocalNotes, [], (data) => setLocalNotes(data))
        // addDangerNotif({ title: `cDM: ${ELSFields.MainPinnedNamespaceMap}`, message: getMsgStr(err) })
      })
  }, [])
  const setFieldToLS = (fieldName: string, value: any, asJson: boolean) => {
    const stuff = asJson ? JSON.stringify(value) : String(value)

    ls(fieldName, stuff)

    return Promise.resolve()
  }
  // const createTestPinnedMap = () => {
  //   const testPinnedMap = {
  //     'tst-namespace': {
  //       limit: 2,
  //       description: 'Test namespace descr',
  //       title: 'Test namespace title',
  //       ids: [],
  //     },
  //   }
  //   setFieldToLS(ELSFields.MainPinnedNamespaceMap, testPinnedMap, true).then(() => {
  //     setPinnedMap(testPinnedMap)
  //   })
  // }
  const defautOptions = {
    limit: 2,
    title: 'New',
    description: 'Descr',
    ids: [],
  }
  const createNamespacePromise = async (opts: any, lsField: ELSFields) => {
    const { namespace, title, description, limit = defautOptions.limit } = opts
    if (!namespace || !title || !limit) {
      const message = 'Condition warning: !namespace || !title || !limit'

      // addWarningNotif({ title: `ERROR: createNamespace("${namespace}")`, message })
      return Promise.reject(message)
    }
    const normalizedNamespace = slugify(namespace).toLowerCase()
    const result = await getFieldFromLS(lsField, true)
      .then((lsData) => {
        if (!!lsData[normalizedNamespace]) {
          throw new Error('Уже есть в LS; Задайте другое имя')
        }
        const newData = {
          [normalizedNamespace]: {
            ...defautOptions,
            title,
            description,
            limit,
            ts: new Date().getTime(),
          },
          ...lsData,
        }

        setFieldToLS(lsField, newData, true).then(() => {
          setPinnedMap(newData)
          return Promise.resolve()
        })
      })
      .catch((err) => {
        const message = getMsgStr(err)

        return Promise.reject(message)
      })
    return result
  }
  const removeNamespace = (namespace: any, lsField: ELSFields) => {
    getFieldFromLS(lsField, true)
      .then((lsData) => {
        if (!lsData[namespace]) {
          addDangerNotif({ title: `!lsData[${namespace}]}` })
          return
        }
        const newData = {}

        for (const _namespace in lsData) {
          // @ts-ignore
          if (_namespace !== namespace) newData[_namespace] = lsData[_namespace]
        }
        setFieldToLS(lsField, newData, true).then(() => {
          setPinnedMap(newData)
        })
      })
      .catch((err) => {
        addDangerNotif({ title: `cDM: ${lsField}`, message: getMsgStr(err) })
      })
  }
  const addItemToLS = ({ namespace, id }: any, lsField: ELSFields) => {
    if (!namespace || !id) {
      // addDangerNotif({ title: 'addItemToLs(): Incorrect params', message: '!namespace || !id' })
      addInfoNotif({ title: 'Select namespace...', message: 'TODO' })
      return
    }

    getFieldFromLS(lsField, true)
      .then((lsData) => {
        if (!lsData[namespace]) throw new Error(`No namespace "${namespace}" in ls`)
        if (!lsData[namespace].limit) throw new Error(`No limit in "${namespace}"`)
        const namespaceData = { ...lsData[namespace] }
        const { ids, limit } = namespaceData
        const newArr = [...new Set([id, ...ids])]
        const lastN = newArr.slice(0, limit)

        const newNamespaceData = { ...namespaceData, ids: lastN, ts: new Date().getTime() }
        const newLsData = { ...lsData, [namespace]: newNamespaceData }

        setFieldToLS(lsField, newLsData, true)
        setPinnedMap(newLsData)

        addInfoNotif({ title: 'Note pinned', message: id })
      })
      .catch((err) => {
        const message = getMsgStr(err)

        // V1:
        // setFieldToLS(ELSFields.MainPinnedNamespaceMap, [id], true)
        // setPinnedIds([id])

        // V2:
        // TODO
        addDangerNotif({ title: 'addItemToLS()', message })
      })
  }
  const replaceNamespaceInLS = ({ namespace, normalizedData }: any, lsField: ELSFields) => {
    // eslint-disable-next-line no-console

    getFieldFromLS(lsField, true)
      .then((lsData) => {
        if (!!lsData[namespace]) {
          // 1. REPLACE
          const newNameSpaceData = { ...normalizedData, ts: new Date().getTime() }
          const newLsData = { ...lsData, [namespace]: newNameSpaceData }

          setFieldToLS(lsField, newLsData, true)
          setPinnedMap(newLsData)
          addInfoNotif({ title: 'LS data updated', message: namespace })
        } else {
          // 2. ADD NEW?
          addWarningNotif({ title: 'replaceNamespaceInLS()', message: 'TODO: ADD NEW?' })
        }
      })
      .catch((err) => {
        addDangerNotif({ title: 'replaceNamespaceInLS()', message: getMsgStr(err) })
      })
  }

  const handlePinToLS = (arg: any, lsField: ELSFields) => {
    // eslint-disable-next-line no-console
    addItemToLS(arg, lsField)
  }
  const removeItemFromLS = (id: string, lsField: ELSFields) => {
    getFieldFromLS(lsField, true)
      .then((lsData) => {
        // 1. Find namespace:
        // const nss = Object.keys(lsData)
        let targetNSName = null
        for (const ns in lsData) {
          const ids = lsData[ns].ids
          if (!ids) continue
          if (ids.includes(id)) targetNSName = ns
        }
        if (!targetNSName) throw new Error('WTF? targetNSName not found')
        // 2. Filter
        const targetNS = lsData[targetNSName]
        if (!targetNS.ids) throw new Error('WTF? !targetNS.ids')

        const newIds = targetNS.ids.filter((_id: string) => _id !== id)
        const newTargetNS = { ...targetNS, ids: newIds }
        const newLsData = { ...lsData, [targetNSName]: newTargetNS }

        setFieldToLS(lsField, newLsData, true)
        setPinnedMap(newLsData)
      })
      .catch((err) => {
        addDangerNotif({ title: 'Error', message: getMsgStr(err) })
      })
  }
  const isPinnedToLS = async (id: string, lsField: ELSFields) => {
    // console.log('CALLED')
    let result = false
    let detectedNamespace

    await getFieldFromLS(lsField, true)
      .then((lsData) => {
        for (const key in lsData) {
          if (lsData[key].ids.includes(id)) {
            result = true
            detectedNamespace = key
          }
        }
        // addInfoNotif({ title: 'TST', message: `${String(arr.includes(id))}` })
        // result = arr.includes(id)
      })
      .catch(() => {
        result = false
      })

    return result ? Promise.resolve(detectedNamespace) : Promise.reject(false)
  }
  // ---

  // --- LOCAL NOTES:
  const saveLocalNote = ({
    id: __id,
    title,
    description,
    cbSuccess,
  }: {
    id?: string
    title: string
    description: string
    cbSuccess?: (notes: any[]) => void
  }) => {
    if (!title || !description) {
      addDangerNotif({ title: 'ERR: saveLocalNote', message: 'Укажите необходимые параметры' })
      return
    }

    const id = __id || String(new Date().getTime())

    const newNote = {
      id,
      title,
      description,
    }

    getFieldFromLS(ELSFields.LocalNotes, true)
      .then((arr: any[]) => {
        const newArr = [newNote, ...arr]

        setFieldToLS(ELSFields.LocalNotes, newArr, true)
          .then(() => {
            setLocalNotes(newArr)
            if (!!cbSuccess) cbSuccess(newArr)
          })
          .then(() => {
            addInfoNotif({ title: 'Local note saved', message: id })
          })
      })
      .catch((err) => {
        const message = typeof err === 'string' ? err : err.message || 'No err.message'

        addDangerNotif({ title: 'ERR: saveLocalNote', message })
      })
  }
  const removeLocalNote = (_id: string) => {
    getFieldFromLS(ELSFields.LocalNotes, true)
      .then((arr: any[]) => {
        if (!Array.isArray) {
          addDangerNotif({ title: 'ERR: removeLocalNote', message: 'Данные повреждены' })
          return
        }

        const targetIndex = arr.findIndex(({ id }) => id === _id)

        if (targetIndex === -1) {
          addDangerNotif({ title: 'ERR: removeLocalNote', message: 'Элемент не найден' })
          return
        }

        const newArr = arr.filter(({ id }) => _id !== id)

        setFieldToLS(ELSFields.LocalNotes, newArr, true)
          .then(() => {
            setLocalNotes(newArr)
          })
          .then(() => {
            addInfoNotif({ title: 'Local note removed', message: _id })
          })
      })
      .catch((err) => {
        const message = typeof err === 'string' ? err : err.message || 'No err.message'

        addDangerNotif({ title: 'ERR: removeLocalNote', message })
      })
  }
  // ---

  return (
    <GlobalAppContext.Provider
      value={{
        state,
        handleSearchByTitleClear,
        handleSearchByDescriptionClear,
        handleSetAsActiveNote,
        handleResetActiveNote,
        handlePageChange,
        isNotesLoading: isLoading,
        initState,
        // @ts-ignore
        page: state.localPage,
        handleSearchByDescriptionSetText,
        handleSearchByTitleSetText,
        handleUpdateOneNote,
        handleRemoveOneNote,
        handleAddOneNote,
        handleSetNotesResponse,
        handlePinToLS,
        handleUnpinFromLS: removeItemFromLS,
        pinnedMap,
        isPinnedToLS,
        // createTestPinnedMap,
        removeNamespace,
        createNamespacePromise,
        replaceNamespaceInLS,

        saveLocalNote,
        removeLocalNote,
        localNotes,
        localNotesPinnedNamespaceMap,
      }}
    >
      {children}
    </GlobalAppContext.Provider>
  )
}

export const useGlobalAppContext = () => useContext(GlobalAppContext)
