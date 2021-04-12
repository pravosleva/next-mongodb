import { createContext, useReducer, useState, useEffect, useRef, useContext } from 'react'
import buildUrl from 'build-url'
import { useAuthContext, useDebounce, useNotifsContext } from '~/common/hooks'
import { useRouter } from 'next/router'
import { data as defaultPaginationData } from '~/common/constants/default-pagination'
import { scrollTop } from '~/utils/scrollTo'
import { getStandardHeadersByCtx } from '~/utils/next/getStandardHeadersByCtx'
import { useWindowSize } from '~/common/hooks'
import ls from 'local-storage'
import slugify from 'slugify'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

export const getInitialState = (base) => ({
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
  handleSearchByTitleClear: () => {
    throw new Error('handleSearchByTitleClear method should be implemented')
  },
  handleSearchByDescriptionClear: () => {
    throw new Error('handleSearchByDescriptionClear method should be implemented')
  },
  handleSetAsActiveNote: (note) => {
    throw new Error('handleSetAsActiveNote method should be implemented')
  },
  handleResetActiveNote: () => {
    throw new Error('handleResetActiveNote method should be implemented')
  },
  handlePageChange: () => {
    throw new Error('handlePageChange method should be implemented')
  },
  isNotesLoading: false,
  initPagination: () => {
    throw new Error('initPagination method should be implemented')
  },
  initState: () => {
    throw new Error('initState method should be implemented')
  },
  handleSearchByDescriptionSetText: () => {
    throw new Error('handleSearchByDescriptionSetText method should be implemented')
  },
  handleSearchByTitleSetText: (text) => {
    throw new Error('handleSearchByTitleSetText method should be implemented')
  },
  handleUpdateOneNote: (note) => {
    throw new Error('handleUpdateOneNote method should be implemented')
  },
  handleRemoveOneNote: (id) => {
    throw new Error('handleRemoveOneNote method should be implemented')
  },
  handleAddOneNote: (note) => {
    throw new Error('handleAddOneNote method should be implemented')
  },
  handleSetNotesResponse: (notesAndPag) => {
    throw new Error('handleSetNotesResponse method should be implemented')
  },
  handlePinToLS: ({ namespace, id }) => {
    throw new Error('handlePinToLS method should be implemented')
  },
  handleUnpinFromLS: (noteId) => {
    throw new Error('handleUnpinFromLS method should be implemented')
  },
  pinnedIds: [],
  pinnedMap: null,
  isPinnedToLS: (noteId) => {
    throw new Error('isPinnedToLS method should be implemented')
  },
  createTestPinnedMap: () => {
    throw new Error('createTestPinnedMap method should be implemented')
  },
  removeNamespace: (key) => {
    throw new Error('removeNamespace method should be implemented')
  },
  createNamespacePromise: ({ namespace, title, description, limit }) => {
    return Promise.reject('createNamespacePromise method should be implemented')
  },
  replaceNamespaceInLS: ({ namespace, normalizedData }) => {
    return Promise.reject('replaceNamespaceInLS method should be implemented')
  },
})

function reducer(state, action) {
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
      const theNoteIndex = state.notes.findIndex(({ _id }) => _id === action.payload._id)

      if (theNoteIndex !== -1) {
        newState.notes[theNoteIndex] = action.payload
        return newState
      }

      return state
    case 'REMOVE_ONE_NOTE':
      newState.notes = newState.notes.filter(({ _id }) => _id !== action.payload)

      return newState
    case 'ADD_ONE_NOTE':
      newState.notes = [...newState.notes, action.payload]

      return newState
    default:
      return state
  }
}

const getMsgStr = (err) => (typeof err === 'string' ? err : err.message || 'No err.message')

export const GlobalAppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState({}))
  const debouncedSearchByTitle = useDebounce(state.searchByTitle, 1000)
  const debouncedSearchByDescription = useDebounce(state.searchByDescription, 1000)
  const handleScrollTop = (noAnimation) => {
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

  const handlePageChange = (_ev, data) => {
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
      const queryParams = {
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
  const { isDesktop, ...windowParams } = useWindowSize()
  const handleSetAsActiveNote = (note) => {
    // eslint-disable-next-line no-console
    // console.log(windowParams)
    // if (isDesktop) scrollTop(125)
    // TODO: No scroll if current scroll position more than 125px
    dispatch({ type: 'ACTIVE_NOTE@SET', payload: note })
  }
  const handleResetActiveNote = (note) => {
    dispatch({ type: 'ACTIVE_NOTE@RESET', payload: note })
  }
  const initState = (state) => {
    dispatch({ type: 'INIT_STATE', payload: state })
  }
  const handleSearchByDescriptionSetText = (text) => {
    dispatch({ type: 'SEARCH_BY_DESCRIPTION@SET', payload: text })
  }
  const handleSearchByTitleSetText = (text) => {
    dispatch({ type: 'SEARCH_BY_TITLE@SET', payload: text })
  }
  const handleUpdateOneNote = (note) => {
    dispatch({ type: 'UPDATE_ONE_NOTE', payload: note })
  }
  const handleRemoveOneNote = (id) => {
    dispatch({ type: 'REMOVE_ONE_NOTE', payload: id })
  }
  const handleAddOneNote = (note) => {
    dispatch({ type: 'ADD_ONE_NOTE', payload: note })
  }
  const handleSetNotesResponse = ({ data, pagination }) => {
    dispatch({ type: 'NOTES_RESPONSE@SET', payload: { notes: data, pagination } })
  }

  // --- LS
  // const [pinnedIds, setPinnedIds] = useState([])
  const [pinnedMap, setPinnedMap] = useState(null)
  const { addInfoNotif, addDangerNotif, addWarningNotif } = useNotifsContext()
  const lsMainField = 'pinned-namespace-map' // 'pinned-ids'
  const msgAsFlasEmpty = 'Not found in ls'
  const getFieldFromLS = (fieldName, shouldBeJson) => {
    if (!ls(fieldName)) {
      createEmptyMap()
      setPinnedMap({})
      // return Promise.reject(msgAsFlasEmpty)
    }

    let dataFromLS

    if (shouldBeJson) {
      try {
        dataFromLS = JSON.parse(ls.get(fieldName))
      } catch (err) {
        return Promise.reject(getMsgStr(err))
      }
    } else {
      dataFromLS = ls.get(fieldName)
    }

    // console.log(dataFromLS)

    return Promise.resolve(dataFromLS)
  }
  const createEmptyMap = () => {
    const emptyPinnedMap = {}
    setFieldToLS(lsMainField, emptyPinnedMap, true).then(() => {
      setPinnedMap(emptyPinnedMap)
    })
  }
  useEffect(() => {
    getFieldFromLS(lsMainField, true)
      .then((lsData) => {
        // setPinnedIds(lsData)
        setPinnedMap(lsData)
        // addInfoNotif({ title: `cDM: ${lsMainField}`, message: JSON.stringify(lsData) })
      })
      .catch((err) => {
        createEmptyMap()
        // addDangerNotif({ title: `cDM: ${lsMainField}`, message: getMsgStr(err) })
      })
  }, [])
  const setFieldToLS = (fieldName, value, asJson) => {
    const stuff = asJson ? JSON.stringify(value) : String(value)

    ls(fieldName, stuff)

    return Promise.resolve()
  }
  const createTestPinnedMap = () => {
    const testPinnedMap = {
      'tst-namespace': {
        limit: 2,
        description: 'Test namespace descr',
        title: 'Test namespace title',
        ids: [],
      },
    }
    setFieldToLS(lsMainField, testPinnedMap, true).then(() => {
      setPinnedMap(testPinnedMap)
    })
  }
  const defautOptions = {
    limit: 2,
    title: 'New',
    description: 'Descr',
    ids: [],
  }
  const createNamespacePromise = async (opts) => {
    const { namespace, title, description, limit = defautOptions.limit } = opts
    if (!namespace || !title || !limit) {
      const message = 'Condition warning: !namespace || !title || !limit'

      // addWarningNotif({ title: `ERROR: createNamespace("${namespace}")`, message })
      return Promise.reject(message)
    }
    const normalizedNamespace = slugify(namespace)
    const result = await getFieldFromLS(lsMainField, true)
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

        setFieldToLS(lsMainField, newData, true).then(() => {
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
  const removeNamespace = (namespace) => {
    getFieldFromLS(lsMainField, true)
      .then((lsData) => {
        if (!lsData[namespace]) {
          addDangerNotif({ title: `!lsData[${namespace}]}` })
          return
        }
        const newData = {}

        for (const _namespace in lsData) {
          if (_namespace !== namespace) newData[_namespace] = lsData[_namespace]
        }
        setFieldToLS(lsMainField, newData, true).then(() => {
          setPinnedMap(newData)
        })
      })
      .catch((err) => {
        addDangerNotif({ title: `cDM: ${lsMainField}`, message: getMsgStr(err) })
      })
  }
  const addItemToLS = ({ namespace, id }) => {
    if (!namespace || !id) {
      // addDangerNotif({ title: 'addItemToLs(): Incorrect params', message: '!namespace || !id' })
      addInfoNotif({ title: 'Select namespace...', message: 'TODO' })
      return
    }

    getFieldFromLS(lsMainField, true)
      .then((lsData) => {
        if (!lsData[namespace]) throw new Error(`No namespace "${namespace}" in ls`)
        if (!lsData[namespace].limit) throw new Error(`No limit in "${namespace}"`)
        const namespaceData = { ...lsData[namespace] }
        const { ids, limit } = namespaceData
        const newArr = [...new Set([id, ...ids])]
        const lastN = newArr.slice(0, limit)

        const newNamespaceData = { ...namespaceData, ids: lastN, ts: new Date().getTime() }
        const newLsData = { ...lsData, [namespace]: newNamespaceData }

        setFieldToLS(lsMainField, newLsData, true)
        // V1:
        // setPinnedIds(lastN)
        // V2:
        setPinnedMap(newLsData)

        addInfoNotif({ title: 'Note pinned', message: id })
      })
      .catch((err) => {
        const message = getMsgStr(err)

        // V1:
        // setFieldToLS(lsMainField, [id], true)
        // setPinnedIds([id])

        // V2:
        // TODO
        addDangerNotif({ title: 'addItemToLS()', message })
      })
  }
  const replaceNamespaceInLS = ({ namespace, normalizedData }) => {
    // eslint-disable-next-line no-console
    // console.log(namespace, normalizedData)

    getFieldFromLS(lsMainField, true)
      .then((lsData) => {
        if (!!lsData[namespace]) {
          // 1. REPLACE
          const newNameSpaceData = { ...normalizedData, ts: new Date().getTime() }
          const newLsData = { ...lsData, [namespace]: newNameSpaceData }

          setFieldToLS(lsMainField, newLsData, true)
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

  const handlePinToLS = (arg) => {
    // eslint-disable-next-line no-console
    addItemToLS(arg)
  }
  const removeItemFromLS = (id) => {
    getFieldFromLS(lsMainField, true)
      .then((lsData) => {
        /* V1:
        if (!Array.isArray(idsArr)) throw new Error("ids from LS isn't an Array")
        const newArr = idsArr.filter((_id) => _id !== id)
        setFieldToLS(lsMainField, newArr, true)
        setPinnedIds(newArr)
        */

        // V2:
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

        const newIds = targetNS.ids.filter((_id) => _id !== id)
        const newTargetNS = { ...targetNS, ids: newIds }
        const newLsData = { ...lsData, [targetNSName]: newTargetNS }
        setFieldToLS(lsMainField, newLsData, true)
        setPinnedMap(newLsData)
      })
      .catch((err) => {
        addDangerNotif({ title: 'Error', message: getMsgStr(err) })
      })
  }
  const isPinnedToLS = async (id) => {
    // console.log('CALLED')
    let result = false

    await getFieldFromLS(lsMainField, true)
      .then((arr) => {
        addInfoNotif({ title: 'TST', message: `${String(arr.includes(id))}` })
        result = arr.includes(id)
      })
      .catch((err) => {
        result = false
      })

    return result
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
        page: state.localPage,
        handleSearchByDescriptionSetText,
        handleSearchByTitleSetText,
        handleUpdateOneNote,
        handleRemoveOneNote,
        handleAddOneNote,
        handleSetNotesResponse,
        handlePinToLS,
        handleUnpinFromLS: removeItemFromLS,
        // pinnedIds,
        pinnedMap,
        isPinnedToLS,
        createTestPinnedMap,
        removeNamespace,
        createNamespacePromise,
        replaceNamespaceInLS,
      }}
    >
      {children}
    </GlobalAppContext.Provider>
  )
}

export const useGlobalAppContext = () => useContext(GlobalAppContext)
