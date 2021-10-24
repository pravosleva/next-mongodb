// useUnscrolledBody.ts

import { useState, useEffect, useCallback } from 'react'
import { useWindowSize } from '~/common/hooks'
// import { widgetWidthDesktop } from '~/common/components/Widget/styles'
import { useWidgetContext, EWidgetNames } from '~/common/components/Widget'

interface IUseUnscrolledBody {
  isBodyUnscrolled: boolean
  toggleScrollBody: (shouldBeUnscrolled: boolean) => void
}

export const useUnscrolledBody = (initialShouldBodyUnscrolled: boolean): IUseUnscrolledBody => {
  const [isBodyUnscrolled, setIsBodyUnscrolled] = useState(initialShouldBodyUnscrolled)
  const { isDesktop } = useWindowSize()
  const { state } = useWidgetContext()
  const doIt = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (isBodyUnscrolled) {
        document.body.style.overflow = 'hidden'
        // @ts-ignore
        // if (isDesktop && state[EWidgetNames.Chat] === true) document.body.style.paddingLeft = `${widgetWidthDesktop}px`
      } else {
        document.body.style.overflow = 'auto'
        // document.body.style.paddingLeft = '0px'
      }
    }
    // @ts-ignore
  }, [state[EWidgetNames.Chat], isDesktop, isBodyUnscrolled, typeof window])

  useEffect(() => {
    doIt()
  }, [isBodyUnscrolled, doIt])

  return {
    isBodyUnscrolled,
    toggleScrollBody: (isModalOpened: boolean) => {
      setIsBodyUnscrolled(isModalOpened)
    },
  }
}
