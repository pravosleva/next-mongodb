/* eslint-disable no-useless-escape */
// NOTE: v2. Совпадение по хотябы одному слову
export const testStringByAnyWord = ({ targetString, words }: { targetString: string; words: string[] }): boolean => {
  const modifiedWords = words.join(' ').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regexpGroups = modifiedWords.split(' ').map((w) => ['(?=.*' + w + ')'])
  const regexp = new RegExp('^' + regexpGroups.join('|') + '.*$', 'im')

  return regexp.test(targetString)
}
