import { useCallback, useState, useMemo } from 'react'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import MdiIcon from '@mdi/react'
import { mdiPencil } from '@mdi/js'
import { Stepper } from '~/common/components/Stepper'
import { useStyles } from './styles'
import { ELSFields } from '~/common/context/GlobalAppContext'
import { useForm, useGlobalAppContext } from '~/common/hooks'
import { TextField, Grid } from '@material-ui/core'
// import { getJSONDiffs } from '~/utils/getJSONDiffs'
import { Badge } from '~/common/components/PinnedNotes/components/Badge'
import { useStyles as useListStyles } from '~/common/components/PinnedNotes/styles'

export type TNamespaceData = {
  ids: string[]
  title: string
  description: string
  limit: number
}
type TProps = {
  data: TNamespaceData
  namespace: string
  leftBtn: React.FC
}

type TStepContentProps = {
  data: TNamespaceData
  onInputChange: (e: any) => void
  formData: any
  normalizedForm: TNamespaceData
  formErrors: {
    [key: string]: any
    blockedSteps?: number[]
  }
  onRemoveId: (namespace: string, id: string) => void
}

const steps = [
  {
    title: 'Set Title',
    content: ({ data, onInputChange, normalizedForm, formErrors }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Title"
            required
            error={!!formErrors.title}
            helperText={formErrors.title}
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="title"
            defaultValue={data.title}
            value={normalizedForm.title}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre>
        </>
      )
    },
  },
  {
    title: 'Set Description',
    content: ({ data, onInputChange, normalizedForm }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Description"
            // required
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="description"
            defaultValue={data.description}
            value={normalizedForm.description}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre>
        </>
      )
    },
  },
  {
    title: 'Set Limit',
    description: 'Количество заметок при привышении которого более старые будут удалены',
    content: ({ data, onInputChange, /* normalizedForm, */ formData, formErrors, onRemoveId }: TStepContentProps) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const listClasses = useListStyles()
      return (
        <>
          <TextField
            size="small"
            label="Limit"
            required
            error={!!formErrors.limit}
            helperText={formErrors.limit}
            type="number"
            // variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="limit"
            defaultValue={data.limit}
            value={formData.limit}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          {/* <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre> */}
          {formData.ids?.length > 0 && (
            <ul className={listClasses.list}>
              {formData.ids.map((id: any) => {
                return (
                  <Badge
                    key={id}
                    id={id}
                    isActive={false}
                    onClick={() => {
                      onRemoveId(data.title, id)
                      // eslint-disable-next-line no-console
                      // console.log('In progress...')
                    }}
                    leftSymbol="🚫"
                    style={{
                      // color: '#f44336',
                      cursor: 'pointer',
                    }}
                  >
                    {id}
                  </Badge>
                )
              })}
            </ul>
          )}
        </>
      )
    },
  },
]

const initialState = {
  title: '',
  description: '',
  limit: 5,
  ids: [],
}

// @ts-ignore
export const EditBtn = ({ namespace, data, leftBtn }: TProps) => {
  const classes = useStyles()
  const [isFormOpened, setIsFormOpened] = useState<boolean>(false)
  const handleOpen = useCallback(() => {
    setIsFormOpened(true)
  }, [setIsFormOpened])
  const handleClose = useCallback(() => {
    setIsFormOpened(false)
  }, [setIsFormOpened])
  const { formData, handleInputChange, resetForm, setValue } = useForm({ ...initialState, ...data })
  const getNormalizedForm = useCallback((formData) => {
    const normalizedForm: Partial<TNamespaceData> | any = {}

    for (const key in formData) {
      switch (true) {
        case key === 'limit':
          normalizedForm[key] = Number(formData[key])
          break
        default:
          normalizedForm[key] = formData[key]
          break
      }
    }

    return normalizedForm
  }, [])
  const normalizedData = useMemo(() => getNormalizedForm(formData), [JSON.stringify(formData)])
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log(normalizedData)
  // }, [normalizedData])
  const getFormErrorsObj = (normalizedData: TNamespaceData) => {
    const result: { [key: string]: any } = {
      blockedSteps: [],
    }

    for (const key in normalizedData) {
      switch (true) {
        case key === 'title' && !normalizedData[key]:
          result[key] = 'Could not be empty'
          result.blockedSteps.push(0)
          break
        case key === 'limit' && (!normalizedData[key] || normalizedData[key] < 0):
          result[key] = 'Could not be empty or zero'
          result.blockedSteps.push(2)
          break
        default:
          break
      }
    }

    return result
  }
  const formErrors = useMemo(() => getFormErrorsObj(normalizedData), [normalizedData])
  const { replaceNamespaceInLS } = useGlobalAppContext()
  const handleSave = useCallback(() => {
    replaceNamespaceInLS({ normalizedData, namespace }, ELSFields.MainPinnedNamespaceMap)
  }, [normalizedData])
  const handleCancel = useCallback(() => {
    resetForm()
  }, [resetForm])
  // const diffs = useMemo(() => getJSONDiffs(data, normalizedData), [data, normalizedData, normalizedData?.ids.length])
  // const showDiffs = useMemo(() => Object.keys(diffs).length > 0, [diffs])
  const handleRemoveIdFromNamespace = useCallback(
    (_ns: string, id: string) => {
      // eslint-disable-next-line no-console
      // handleUnpinFromLS(id, ELSFields.MainPinnedNamespaceMap)
      const newIds = formData.ids.filter((_id: string) => _id !== id)
      // eslint-disable-next-line no-console
      // console.log(newIds)
      setValue('ids', newIds)
    },
    [
      // handleUnpinFromLS,
      setValue,
    ]
  )

  return (
    <div className={classes.wrapper}>
      {!isFormOpened ? (
        <>
          {!!leftBtn ? (
            <>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  {leftBtn({})}
                </Grid>
                <Grid item xs={6}>
                  <ThemedButton
                    size="small"
                    color={EColorValue.grey}
                    variant="contained"
                    onClick={handleOpen}
                    fullWidth
                    endIcon={<MdiIcon path={mdiPencil} size={0.7} />}
                    style={{ borderRadius: !!leftBtn ? '0px 8px 0px 0px' : '8px 8px 0px 0px' }}
                  >
                    Edit
                  </ThemedButton>
                </Grid>
              </Grid>
            </>
          ) : (
            <ThemedButton
              size="small"
              color={EColorValue.grey}
              variant="contained"
              onClick={handleOpen}
              fullWidth
              endIcon={<MdiIcon path={mdiPencil} size={0.7} />}
              style={{ borderRadius: !!leftBtn ? '0px 8px 8px 0px' : '8px 8px 0px 0px' }}
            >
              Edit
            </ThemedButton>
          )}
        </>
      ) : (
        <Stepper
          onRemoveId={handleRemoveIdFromNamespace}
          onClose={handleClose}
          onSave={handleSave}
          steps={steps}
          onCancel={handleCancel}
          // REST:
          data={data}
          formData={formData}
          onInputChange={handleInputChange}
          normalizedForm={normalizedData}
          formErrors={formErrors}
        />
      )}
      {/*showDiffs && (
        <div style={{ color: '#ff1744', margin: '16px 0px 8px 0px' }}>
          <b>
            <em>Diffs:</em>
          </b>
          <pre style={{ margin: '0px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(diffs, null, 2)}
          </pre>
        </div>
      )*/}
    </div>
  )
}
