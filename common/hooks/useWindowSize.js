import { useState, useEffect } from 'react'
import { md, lg, xl } from '~/common/styled-mui/theme'

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
    isDesktop: false,
    upMd: false,
    upLg: false,
    upXl: false,

    downMd: false,
    downLg: false,
    downXl: false,
  })

  useEffect(() => {
    function handleResize() {
      const width = window?.innerWidth
      const height = window?.innerHeight
      const isMobile = width <= md
      const isDesktop = width > md
      const upMd = width >= md
      const upLg = width >= lg
      const upXl = width >= xl

      const downMd = width <= md
      const downLg = width <= lg
      const downXl = width <= xl

      // Set window width/height to state
      setWindowSize({
        width,
        height,
        isMobile,
        isDesktop,

        upMd,
        upLg,
        upXl,

        downMd,
        downLg,
        downXl,
      })
    }

    // Handler to call on window resize
    if (typeof window !== 'undefined') {
      // Add event listener
      window.addEventListener('resize', handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()
    }

    // Remove event listener on cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [typeof window]) // Empty array ensures that effect is only run on mount

  return windowSize
}
