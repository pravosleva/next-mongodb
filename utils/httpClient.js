/* eslint-disable no-console */
import { HttpError } from '~/utils/errors/http/HttpError'
import { httpErrorHandler } from '~/utils/errors/http/axios'
import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 5 })

const createCancelTokenSource = () => new axios.CancelToken.source()

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT
const NEXT_APP_EXPRESS_API_ENDPOINT = process.env.NEXT_APP_EXPRESS_API_ENDPOINT

class HttpClientSingletone {
  static _instance = new HttpClientSingletone()

  constructor() {
    if (HttpClientSingletone._instance) {
      throw new Error('Instantiation failed: use HttpClientSingletone.getInstance() instead of new.')
    }
    this.getNotesCancelTokenSource = null
    this.getNoteCancelTokenSource = null
    this.getMyIPCancelTokenSource = null
    this.axiosInstance = axios.create({
      baseURL: `${NEXT_APP_API_ENDPOINT}/`,
      // timeout: 1000,
      // headers: { 'X-Custom-Header': 'foobar' },
    })
    this.axiosEApiInstance = axios.create({
      baseURL: `${NEXT_APP_EXPRESS_API_ENDPOINT}/`,
    })
  }

  static getInstance() {
    return HttpClientSingletone._instance
  }
  universalAxiosResponseHandler(validator) {
    return (axiosRes) => {
      // console.log(axiosRes)
      if (!validator(axiosRes)) {
        throw new Error('Data is incorrect')
      }
      try {
        return { isOk: true, res: axiosRes.data }
      } catch (err) {
        throw new Error(err.message)
      }
    }
  }
  responseDataHandlerAfterHttpErrorHandler(dataValidator) {
    return (resData) => {
      if (!dataValidator(resData)) {
        throw new Error('Data is incorrect')
      }
      try {
        return { isOk: true, res: resData }
      } catch (err) {
        throw new Error(err.message)
      }
    }
  }
  getErrorMsg(data) {
    // TODO: Should be modified
    return !!data?.message ? data?.message : 'Извините, что-то пошло не так'
  }

  async getNotes(url) {
    if (!!this.getNotesCancelTokenSource) this.getNotesCancelTokenSource.cancel('axios request cancelled')

    const source = createCancelTokenSource()
    this.getNotesCancelTokenSource = source

    const result = await this.axiosInstance({
      method: 'GET',
      url,
      // mode: 'cors',
      cancelToken: this.getNotesCancelTokenSource.token,
    })
      .then(httpErrorHandler)
      .then(
        this.responseDataHandlerAfterHttpErrorHandler(
          ({ data, pagination, success }) => success && !!data && Array.isArray(data) && !!pagination
        )
      )
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    this.getNotesCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }

  async getNote(id) {
    if (!!this.getNoteCancelTokenSource) this.getNoteCancelTokenSource.cancel('axios request cancelled')

    const source = createCancelTokenSource()
    this.getNoteCancelTokenSource = source

    const result = await this.axiosInstance({
      method: 'GET',
      url: `/notes/${id}`,
      // mode: 'cors',
      cancelToken: this.getNoteCancelTokenSource.token,
    })
      .then(httpErrorHandler)
      .then(this.responseDataHandlerAfterHttpErrorHandler(({ data, success }) => success && !!data?._id))
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    this.getNoteCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res.data)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }

  async getMyIP(url = '/common/my-ip') {
    if (!!this.getMyIPCancelTokenSource) this.getMyIPCancelTokenSource.cancel('axios request cancelled')

    const source = createCancelTokenSource()
    this.getMyIPCancelTokenSource = source

    const result = await this.axiosEApiInstance({
      method: 'GET',
      url,
      // mode: 'cors',
      cancelToken: this.getMyIPCancelTokenSource.token,
    })
      .then(httpErrorHandler)
      .then(this.responseDataHandlerAfterHttpErrorHandler(({ ip, success }) => success && !!ip))
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    this.getMyIPCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }
}

export const httpClient = HttpClientSingletone.getInstance()
