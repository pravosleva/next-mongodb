import { HttpError } from '~/utils/errors/http'
// import { AxiosResponse } from 'axios'

export const httpErrorHandler = (obj) => {
  if (obj?.status === 200) {
    return obj.data
  }
  if (obj.request?.status === 200) {
    return obj.data
  } else {
    if (!!obj.status) {
      throw new HttpError(obj.status, obj.data?.message || obj.statusText)
    }
    throw new HttpError(obj.request?.status, obj.request?.statusText)
  }
}
