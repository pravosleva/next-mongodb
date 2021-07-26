export enum EPageParams {
  Page = 'page',
  Limit = 'limit',
}
export type TQueryKey = {
  name: EPageParams
  type: string
}
export type TNormalizedQuery = {
  page?: number
  limit?: number
}
export const getNormalizedQuery = (q: any): TNormalizedQuery => {
  const result: TNormalizedQuery = {}
  const possibleQueryParams: TQueryKey[] = [
    {
      name: EPageParams.Page,
      type: 'number',
    },
    {
      name: EPageParams.Limit,
      type: 'number',
    },
  ]

  for (const paramData of possibleQueryParams) {
    const { name, type } = paramData

    if (!!q[name]) {
      switch (true) {
        case type === 'number':
          if (!isNaN(q[name])) result[name] = Number(q[name])
          break
        case type === 'string':
          result[name] = q[name]
          break
        default:
          break
      }
    }
  }

  return result
}
