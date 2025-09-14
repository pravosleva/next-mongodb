// import { testStringByAnyWord } from './testStringByAnyWord'

const getWrappedToTag = ({
  tag,
  innerHTML,
  style,
  className,
}: {
  tag: string
  innerHTML: string
  style?: string
  className: string[]
}): string => {
  return `<${tag}${!!style ? ` style="${style}"` : ''}${
    !!className ? ` class="${className.join(' ')}"` : ''
  }>${innerHTML}</${tag}>`
}

export const getHighlightedTitleHTML = ({ str, searchString }: { str: string; searchString?: string }): string => {
  const words = str.split(' ')
  const result = []

  for (const word of words) {
    if (!!word) {
      // NOTE: If started width hash, then wrap to <b style="color:red;"></b>
      if (!!word && word[0] === '#') {
        const className = ['tag']
        if (!!searchString && word === searchString) className.push('search-coincidence')
        // if (!!searchString && testStringByAnyWord({ targetString: word, words })) className.push('search-coincidence')

        result.push(
          getWrappedToTag({
            tag: 'b',
            innerHTML: word,
            // style: 'color:red;',
            className,
          })
        )
      } else result.push(word)
    }
  }

  return result.join(' ')
}
