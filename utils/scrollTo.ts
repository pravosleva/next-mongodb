const scrollToRef = (ref: any, headerPx: number = 0, additionalPx: number = 0) => {
  if (!!ref?.current && !!window) {
    // ref.current.scrollIntoView()
    window.scrollTo({ left: 0, behavior: 'smooth', top: ref.current.offsetTop - headerPx - additionalPx })
  }
}
export const scrollTo = (ref: any) => {
  scrollToRef(ref, 37, 8)
}
export const scrollTop = (offseTop: number = 0, noAnimated?: boolean) => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: offseTop, behavior: noAnimated ? undefined : 'smooth' })
  }
}
