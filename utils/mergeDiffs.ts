/* eslint-disable no-console */
// NOTE: https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3571894

export const mergeDeep = (target: any, source: any, isMergingArrays = false) => {
  target = ((obj) => {
    let cloneObj
    try {
      cloneObj = JSON.parse(JSON.stringify(obj))
    } catch (err) {
      // If the stringify fails due to circular reference, the merge defaults
      //   to a less-safe assignment that may still mutate elements in the target.
      // You can change this part to throw an error for a truly safe deep merge.
      cloneObj = Object.assign({}, obj)
    }
    return cloneObj
  })(target)

  const isObject = (obj: any) => obj && typeof obj === 'object'

  if (!isObject(target) || !isObject(source)) return source

  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue))
      if (isMergingArrays) {
        target[key] = targetValue.map((x, i) =>
          sourceValue.length <= i ? x : mergeDeep(x, sourceValue[i], isMergingArrays)
        )
        if (sourceValue.length > targetValue.length)
          target[key] = target[key].concat(sourceValue.slice(targetValue.length))
      } else {
        target[key] = targetValue.concat(sourceValue)
      }
    else if (isObject(targetValue) && isObject(sourceValue))
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue, isMergingArrays)
    else target[key] = sourceValue
  })

  return target
}

const testTarget = {
  one: 'one',
  two: ['one', 'two'],
  three: {
    one: 'one',
    two: ['one', 'two'],
    three: {
      one: 'one',
      two: 'two',
      three: 'three',
    },
  },
}
const testSource = {
  one: 1,
  two: [1, 1.5, 2],
  three: {
    one: 1,
    two: [1],
    three: {
      one: 1,
      two: 2,
      three: 3,
    },
    four: 4,
  },
  four: 4,
  five: [1, 2, 3, 4, 5],
}

;[
  mergeDeep(testTarget, testSource), // Case #1 - Standard Usage: Concatenates Arrays
  mergeDeep(testTarget, testSource, true), // Case #2 - MergedArrays = true: Merges Arrays
  testTarget, // Confirming Unchanged testTarget
].forEach((testCase) => console.log(testCase))

/* RESULTS:

Case #1 - Standard Usage: Concatenates Arrays
  { one: 1,
    two: [ 'one', 'two', 1, 1.5, 2 ],
    three:
     { one: 1,
       two: [ 'one', 'two', 1 ],
       three: { one: 1, two: 2, three: 3 },
       four: 4 },
    four: 4,
    five: [ 1, 2, 3, 4, 5 ] }

Case #2 - MergedArrays = true: Merges Arrays
  { one: 1,
    two: [ 1, 1.5, 2 ],
    three:
     { one: 1,
       two: [ 1, 'two' ],
       three: { one: 1, two: 2, three: 3 },
       four: 4 },
    four: 4,
    five: [ 1, 2, 3, 4, 5 ] }

Confirming Unchanged testTarget

  { one: 'one',
    two: [ 'one', 'two' ],
    three:
     { one: 'one',
       two: [ 'one', 'two' ],
       three: { one: 'one', two: 'two', three: 'three' } } }
*/
