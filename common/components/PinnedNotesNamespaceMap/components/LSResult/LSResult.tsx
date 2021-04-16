import { useMemo, useCallback } from 'react'
import { useGlobalAppContext, useForm } from '~/common/hooks'
import TextField from '@material-ui/core/TextField'
import { useStyles } from './styles'
import { Namespace } from './components'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'
import clsx from 'clsx'

type TForm = {
  byTitleOrDescr: string
}

const initialState: TForm = {
  byTitleOrDescr: '',
}

export const LSResult = () => {
  const classes = useStyles()
  const { pinnedMap } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  const { formData, handleInputChange } = useForm(initialState)
  const checkByTitleOrDescr = useCallback(
    ({ title, description }) => {
      if (!!formData.byTitleOrDescr) {
        if (
          title.toLowerCase().includes(formData.byTitleOrDescr.toLowerCase()) ||
          description.toLowerCase().includes(formData.byTitleOrDescr.toLowerCase())
        ) {
          return true
        }
        return false
      }
      return true
    },
    [formData.byTitleOrDescr]
  )

  return (
    <div className={classes.wrapper}>
      {pinnedMapKeys.length === 0 && <em>No namespaces yet...</em>}
      {pinnedMapKeys.length > 0 && (
        <TextField
          className="search"
          // autoFocus
          size="small"
          label="Search by title or description"
          // required
          type="text"
          variant="outlined"
          fullWidth
          placeholder="Search..."
          name="byTitleOrDescr"
          value={formData.byTitleOrDescr}
          onChange={handleInputChange}
          autoComplete="off"
        />
      )}
      {!!pinnedMap &&
        pinnedMapKeys.map((key) => {
          // @ts-ignore
          const data = pinnedMap ? pinnedMap[key] : null
          const shouldBeDisplayed = checkByTitleOrDescr({
            // @ts-ignore
            title: pinnedMap[key].title,
            // @ts-ignore
            description: pinnedMap[key].description || '',
          })

          if (!shouldBeDisplayed) return null
          return (
            <div key={key} className={clsx(classes.collapsibleWrapper, 'collapsible-wrapper')}>
              <CollabsibleContent
                activeTitleColor="#3882C4"
                inactiveTitleColor="#949494"
                isRightSide
                title={`${data.title} ${data.ids.length}/${data.limit}`}
                // @ts-ignore
                contentRenderer={(_collabsiblePs) => <Namespace key={`${key}-${pinnedMap[key].ts}`} data={data} />}
              />
            </div>
          )
          // return <Namespace key={key} data={data} />
        })}
    </div>
  )
}
