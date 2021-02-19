import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { httpClient } from '~/utils/httpClient'

// const NEXT_APP_EXPRESS_API_ENDPOINT = process.env.NEXT_APP_EXPRESS_API_ENDPOINT
const NEXT_APP_COOKIE_MAXAGE_IN_DAYS = process.env.NEXT_APP_COOKIE_MAXAGE_IN_DAYS
  ? parseInt(process.env.NEXT_APP_COOKIE_MAXAGE_IN_DAYS)
  : 1

type TState = {
  isLoading: boolean
  isLogged: boolean
  [key: string]: any
}

export const getInitialState = (base: Partial<TState>): TState => ({
  isLoading: false,
  isLogged: false,

  ...base,
})

type TAuthContextProps = {
  isLoading: boolean
  isLogged: boolean
  state: TState
  handleLogin: (token: string) => void
  handleLogout: () => void
}
export const AuthContext = createContext<TAuthContextProps>({
  isLoading: false,
  isLogged: false,
  state: getInitialState({}),
  handleLogout: () => {
    throw new Error('handleLogout method should be implemented')
  },
  handleLogin: () => {
    throw new Error('handleLogin method should be implemented')
  },
})

function reducer(state: TState, action: any) {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_IS_LOGGED':
      return { ...state, isLogged: action.payload }
    default:
      return state
  }
}

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState({}))
  const setIsLoading = useCallback(
    (val: boolean) => {
      dispatch({ type: 'SET_IS_LOADING', payload: val })
    },
    [dispatch]
  )
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const {
    pathname,
    events,
    // push,
  } = useRouter()

  useEffect(() => {
    const handleRouteChange = async (_url: string) => {
      setIsLoading(true)
      // @ts-ignore
      const isLoggedIn = await httpClient.checkMe(cookies['token'])

      // log(`ROUTER LOG: ${url} | isLoggedIn= ${isLoggedIn}`);

      dispatch({ type: 'SET_IS_LOGGED', payload: isLoggedIn })
      setIsLoading(false)

      // switch (true) {
      //     case url !== '/' && !isLoggedIn:
      //         push('/');
      //         break;
      //     case url === '/' && isLoggedIn:
      //         push('/posts');
      //         break;
      //     default:
      //         break;
      // }
    }
    handleRouteChange(pathname)

    events.on('routeChangeStart', handleRouteChange)

    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [dispatch, setIsLoading, cookies['token']])
  const handleLogout = (): void => {
    removeCookie('token', { path: '/' })
    dispatch({ type: 'SET_IS_LOGGED', payload: false })
  }
  const handleLogin = (token: string): void => {
    // TODO: Make request by httpClient!

    setCookie('token', token, {
      path: '/',
      maxAge: NEXT_APP_COOKIE_MAXAGE_IN_DAYS * 24 * 60 * 60,
    })
    dispatch({ type: 'SET_IS_LOGGED', payload: true })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        isLoading: state.isLoading,
        isLogged: state.isLogged,
        handleLogout,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
