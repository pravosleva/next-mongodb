import { createContext, useContext, useState, useCallback } from 'react'

const WidgetContext = createContext({
  state: {},
  widgetToggler: (_widgetName: string): void => {
    throw new Error('widgetToggler method should be implemented')
  },
})

export const WidgetContextProvider = ({ children }: any) => {
  const [state, setState] = useState({})
  const widgetToggler = useCallback(
    (widgetName: string) => {
      // console.log(widgetName)
      setState((oldState: any) => {
        const newState = {}

        if (!oldState[widgetName]) {
          for (const key in oldState) {
            // @ts-ignore
            newState[key] = false
          }
          // @ts-ignore
          newState[widgetName] = true
        } else {
          for (const key in oldState) {
            if (widgetName === key && !!oldState[key]) {
              // @ts-ignore
              newState[key] = false
            } else {
              // @ts-ignore
              newState[key] = true
            }
          }
        }

        return {
          ...oldState,
          ...newState,
        }
      })
    },
    [setState]
  )

  return (
    <WidgetContext.Provider
      value={{
        state,
        widgetToggler,
      }}
    >
      {children}
    </WidgetContext.Provider>
  )
}

export const useWidgetContext = () => useContext(WidgetContext)
