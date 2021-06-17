import { useEffect, useRef, useMemo } from 'react'
// import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Icon, Label } from 'semantic-ui-react'
import { ActiveNote, MobileDialogIfNecessary } from '~/common/components/ActiveNote'
import clsx from 'clsx'
import { useGlobalAppContext, getInitialState, useAuthContext } from '~/common/context'
import { useWindowSize } from '~/common/hooks'
import { EmptyTemplate } from '~/common/components/EmptyTemplate'
import { data as defaultPaginationData } from '~/common/constants/default-pagination'
import { Button as MuiButton, Box, TextField } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
// import AutorenewIcon from '@material-ui/icons/Autorenew'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import { useRouter } from 'next/router'
import { Tags } from '~/common/components/Tags'
import { getStandardHeadersByCtx } from '~/utils/next/getStandardHeadersByCtx'
import { Sample0 } from '~/common/styled-mui/custom-pagination'
import MdiIcon from '@mdi/react'
import { mdiPinOff, mdiAutorenew, mdiFile } from '@mdi/js'
// <MdiIcon path={mdiPin} size={0.7} />
import { PinNote } from '~/common/components/PinNote'
import { ELSFields } from '~/common/context/GlobalAppContext'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const InputFieldFlexContainer = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
)
const CloseBtn = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      marginLeft: '8px',
      minWidth: '35px',
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px dashed #3882C4',
      cursor: 'pointer',
    }}
  >
    {children}
  </div>
)

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT
const Index = ({ notes: initNotes, pagination: initPag, errMsg: ssrErrMsg }) => {
  const {
    state,
    isNotesLoading: isLoading,
    initState,
    handleSearchByTitleClear,
    handleSearchByDescriptionClear,
    handleSetAsActiveNote,
    page,
    handlePageChange,
    handleSearchByDescriptionSetText,
    handleSearchByTitleSetText,
    handleUnpinFromLS,
    // pinnedMap,
    localNotes,
    showLocalNotesInList,
    setShowLocalNotesInListToggler,
    isIdPinned,
  } = useGlobalAppContext()
  const init = () => {
    initState(getInitialState({ notes: initNotes, pagination: initPag }))
  }
  const filteredNotes = useMemo(
    () =>
      showLocalNotesInList && !!localNotes && localNotes.length > 0
        ? localNotes
            .filter(({ title }) =>
              !!state.searchByTitle ? title.toLowerCase().includes(state.searchByTitle.toLowerCase()) : true
            )
            .filter(({ description }) =>
              !!state.searchByDescription
                ? description.toLowerCase().includes(state.searchByDescription.toLowerCase())
                : true
            )
            .map(({ id, ...rest }) => ({ id, _id: id, ...rest, isLocal: true }))
        : [],
    [showLocalNotesInList, localNotes, state.searchByDescription, state.searchByTitle]
  )
  useEffect(() => {
    init()
  }, [])
  const { totalPages, totalNotes, currentPage } = state.pagination
  const renderCountRef = useRef(0)
  useEffect(() => {
    renderCountRef.current += 1
  })
  const notes = useMemo(() => (renderCountRef.current >= 1 ? state.notes : initNotes), [JSON.stringify(state.notes)])
  const { isLogged } = useAuthContext()
  const activeNote = useMemo(() => state.activeNote, [JSON.stringify(state.activeNote)])
  const { isMobile } = useWindowSize()
  const baseClasses = useBaseStyles()
  const router = useRouter()

  return (
    <>
      <div className="search-wrapper">
        {isMobile && (
          <div className="mobile-search-box">
            <InputFieldFlexContainer>
              <TextField
                size="small"
                label="Title"
                variant="outlined"
                value={state.searchByTitle}
                fullWidth
                type="text"
                // placeholder="Search by title..."
                autoComplete="off"
                onChange={(e) => {
                  handleSearchByTitleSetText(e.target.value)
                }}
              />
              {!!state.searchByTitle && (
                <CloseBtn onClick={handleSearchByTitleClear}>
                  {isLoading ? <MdiIcon path={mdiAutorenew} size={0.85} spin /> : <CloseIcon />}
                </CloseBtn>
              )}
            </InputFieldFlexContainer>
            <InputFieldFlexContainer>
              <TextField
                size="small"
                variant="outlined"
                label="Description"
                value={state.searchByDescription}
                fullWidth
                type="text"
                // placeholder="Search by description..."
                autoComplete="off"
                onChange={(e) => {
                  handleSearchByDescriptionSetText(e.target.value)
                }}
              />
              {!!state.searchByDescription && (
                <CloseBtn onClick={handleSearchByDescriptionClear}>
                  {isLoading ? <MdiIcon path={mdiAutorenew} size={0.85} spin /> : <CloseIcon />}
                </CloseBtn>
              )}
            </InputFieldFlexContainer>
          </div>
        )}

        {/* state.notes.length > 0 && totalPages > 0 && !!currentPage && !!state.pagination && (
          <Box m={1}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sample0
                page={page}
                defaultPage={page}
                hideNextButton={page >= totalPages}
                hidePrevButton={page <= 1}
                onChange={(_e, page) => {
                  handlePageChange(_e, { activePage: page })
                }}
                boundaryCount={3}
                color="primary"
                count={totalPages}
                variant="outlined"
              />
            </div>
          </Box>
        ) */}
      </div>
      {/* <div style={{ border: '1px solid red' }}>
        <pre
          style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', minHeight: '100px', overflowY: 'auto', margin: '0px' }}
        >
          {JSON.stringify(activeNote, null, 2)}
        </pre>
      </div> */}
      <MobileDialogIfNecessary />
      <div className="main">
        <div className="active-note-external-sticky-wrapper">
          {!!activeNote ? (
            <ActiveNote note={activeNote} key={activeNote._id} isTagsNessesary shouldTitleBeTruncated />
          ) : (
            <EmptyTemplate />
          )}
        </div>
        <div className="grid wrapper" style={{ marginBottom: '8px' }}>
          <div
            style={{
              lineHeight: '42px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '8px 0 0 0',
              padding: '0 8px 0 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', height: '42px' }}>
              <Label>
                <Icon name="file" />
                {showLocalNotesInList ? totalNotes + filteredNotes.length : totalNotes}
              </Label>
            </div>
            {!!ssrErrMsg && (
              <div style={{ border: '1px solid #fe7f2d', borderRadius: '10px', padding: '5px' }}>🔥 {ssrErrMsg}</div>
            )}
            {!!localNotes && localNotes.length > 0 && (
              <div style={{ border: '1px solid transparent' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showLocalNotesInList}
                      onChange={(_e, val) => {
                        setShowLocalNotesInListToggler(val)
                      }}
                      name="checkedA"
                      color="secondary"
                    />
                  }
                  label="Local Notes"
                  labelPlacement="start"
                />
              </div>
            )}
          </div>
          {[...filteredNotes, ...notes].map((note) => {
            const isActive = !!activeNote?._id && activeNote._id === note._id

            return (
              <div
                key={note._id}
                className={clsx(baseClasses.standardCard, {
                  'active-card-wrapper': isActive && !note.isLocal,
                  'active-card-wrapper_local': isActive && note.isLocal,
                  'private-card-wrapper': note.isPrivate,
                })}
              >
                <>
                  <>
                    <div
                      className={clsx(baseClasses.standardCardHeader, baseClasses.cursorPointer)}
                      onClick={() => handleSetAsActiveNote(note)}
                    >
                      <h4>
                        {note.title}
                        {/* !!note.id ? (
                          <span>
                            {' '}
                            <Rating disabled size="large" /> <span className="muted">{note.priority}</span>
                          </span>
                        ) : null */}
                      </h4>
                    </div>
                  </>
                  {isMobile && (
                    <div className={clsx(baseClasses.actionsBoxRight, baseClasses.standardCardFooter)}>
                      <>
                        <Tags title={note.title} />
                        {isLogged && !note.isLocal && (
                          <MuiButton
                            // disabled={isNotesLoading}
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => {
                              router.push(`/notes/${note._id}/edit`)
                            }}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </MuiButton>
                        )}
                        {!isIdPinned(note._id) ? (
                          <PinNote id={note._id} isLocal={note.isLocal} />
                        ) : (
                          <MuiButton
                            variant="outlined"
                            size="small"
                            color={note.isLocal ? 'secondary' : 'primary'}
                            onClick={() => {
                              handleUnpinFromLS(note._id, ELSFields.MainPinnedNamespaceMap)
                            }}
                            startIcon={<MdiIcon path={mdiPinOff} size={0.7} />}
                          >
                            Unpin
                          </MuiButton>
                        )}

                        <MuiButton
                          // disabled={isNotesLoading}
                          variant="contained"
                          size="small"
                          color={note.isLocal ? 'secondary' : 'primary'}
                          onClick={() => {
                            if (note.isLocal) {
                              router.push(`/local-notes/${note._id}`)
                            } else {
                              router.push(`/notes/${note._id}`)
                            }
                          }}
                          startIcon={<ArrowForwardIcon />}
                        >
                          View
                        </MuiButton>
                      </>
                    </div>
                  )}
                </>
              </div>
            )
          })}
          {state.notes.length > 0 && totalPages > 0 && !!currentPage && !!state.pagination && (
            // state.pagination.totalPages > 1 &&
            <div className="search-wrapper">
              <Box m={1}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Sample0
                    page={page}
                    defaultPage={page}
                    hideNextButton={page >= totalPages}
                    hidePrevButton={page <= 1}
                    onChange={(_e, page) => {
                      handlePageChange(_e, { activePage: page })
                    }}
                    boundaryCount={3}
                    color="primary"
                    count={totalPages}
                    variant="outlined"
                  />
                </div>
              </Box>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

Index.getInitialProps = async (ctx) => {
  const headers = getStandardHeadersByCtx(ctx)

  // const me = await fetch(`${NEXT_APP_EXPRESS_API_ENDPOINT}/users/me`, {
  //   method: 'GET',
  //   headers,
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error(res.status)
  //     return res.json()
  //   })
  //   .then((json) => ({ isOk: true, json }))
  //   .catch((err) => ({ isOk: false }))

  let data
  let pagination
  let errMsg
  try {
    const res = await fetch(`${NEXT_APP_API_ENDPOINT}/notes?limit=${defaultPaginationData.limit}`, { headers })
    // eslint-disable-next-line no-console
    console.log(res)
    const json = await res.json()
    data = json.data
    pagination = json.pagination
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    errMsg = err?.message || 'Has err, but no err.message'
  }

  return {
    notes: data || [],
    pagination: pagination || { totalPages: 1, totalNotes: 0, currentPage: 1 },
    errMsg,
  }
}

export default Index
