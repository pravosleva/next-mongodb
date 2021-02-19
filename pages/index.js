import { useEffect, useRef, useMemo } from 'react'
// import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Card, Icon, Label, Rating } from 'semantic-ui-react'
import { ActiveNote, MobileDialogIfNecessary } from '~/common/components/ActiveNote'
import clsx from 'clsx'
import { useGlobalAppContext, getInitialState, useAuthContext } from '~/common/context'
import { useWindowSize } from '~/common/hooks'
import { EmptyTemplate } from '~/common/components/EmptyTemplate'
import { data as defaultPaginationData } from '~/common/constants/default-pagination'
import { Button as MuiButton, Box, Container, TextField } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import { useRouter } from 'next/router'
import { Tags } from '~/common/components/Tags'
import { getStandardHeadersByCtx } from '~/utils/next/getStandardHeadersByCtx'
import { Sample0 } from '~/common/styled-mui/custom-pagination'

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
      border: '2px dashed #fff',
      cursor: 'pointer',
    }}
  >
    {children}
  </div>
)

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

const Index = ({ notes: initNotes, pagination: initPag }) => {
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
  } = useGlobalAppContext()
  const init = () => {
    initState(getInitialState({ notes: initNotes, pagination: initPag }))
  }
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
          <>
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
                <CloseBtn onClick={handleSearchByTitleClear}>{isLoading ? <AutorenewIcon /> : <CloseIcon />}</CloseBtn>
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
                  {isLoading ? <AutorenewIcon /> : <CloseIcon />}
                </CloseBtn>
              )}
            </InputFieldFlexContainer>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label>
            <Icon name="file" /> {totalNotes}
          </Label>
        </div>
        {state.notes.length > 0 && totalPages > 0 && !!currentPage && !!state.pagination && (
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
                variant="otlined"
              />
            </div>
          </Box>
        )}
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
        <div className="grid wrapper">
          {notes.map((note) => {
            const isActive = !!activeNote?._id && activeNote._id === note._id

            return (
              <div
                key={note._id}
                className={clsx({ 'active-card-wrapper': isActive, 'private-card-wrapper': note.isPrivate })}
              >
                <Card>
                  <Card.Content>
                    <Card.Header>
                      <div onClick={() => handleSetAsActiveNote(note)} className="note-title-wrapper">
                        <b>
                          {note.title}
                          {!!note.id ? (
                            <span>
                              {' '}
                              <Rating disabled size="large" /> <span className="muted">{note.priority}</span>
                            </span>
                          ) : null}
                        </b>
                      </div>
                    </Card.Header>
                  </Card.Content>
                  {isMobile && (
                    <Card.Content extra className={baseClasses.actionsBoxRight}>
                      <Tags title={note.title} />
                      {isLogged && (
                        <MuiButton
                          // disabled={isNotesLoading}
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => {
                            router.push(`/notes/${note._id}/edit`)
                          }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </MuiButton>
                      )}
                      <MuiButton
                        // disabled={isNotesLoading}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => {
                          router.push(`/notes/${note._id}`)
                        }}
                        startIcon={<ArrowForwardIcon />}
                      >
                        View
                      </MuiButton>
                    </Card.Content>
                  )}
                </Card>
              </div>
            )
          })}
        </div>
      </div>
      {state.notes.length > 0 && totalPages > 0 && !!currentPage && !!state.pagination && (
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
                variant="otlined"
              />
            </div>
          </Box>
        </div>
      )}
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

  const res = await fetch(`${NEXT_APP_API_ENDPOINT}/notes?limit=${defaultPaginationData.limit}`, { headers })
  const { data, pagination } = await res.json()

  return { notes: data || [], pagination }
}

export default Index
