export const getLSSpace = (toFixedArg = 2, theFieldName?: string) => {
  if (typeof window === 'undefined') return 0

  let allStrings = ''
  if (!!theFieldName) {
    if (window.localStorage.hasOwnProperty(theFieldName)) {
      allStrings += window.localStorage[theFieldName]
    }
  } else {
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        allStrings += window.localStorage[key]
      }
    }
  }

  return allStrings ? (3 + (allStrings.length * 16) / (8 * 1024)).toFixed(toFixedArg) + ' KB' : '0 KB'
}
