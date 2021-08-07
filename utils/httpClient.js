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
    this.getMeCancelTokenSource = null
    this.crossdeviceSaveCancelTokenSource = null
    this.crossdeviceGetCancelTokenSource = null
    this.axiosInstance = axios.create({
      baseURL: `${NEXT_APP_API_ENDPOINT}/`,
      // timeout: 1000,
      // headers: { 'X-Custom-Header': 'foobar' },
    })
    this.axiosEApiInstance = axios.create({
      baseURL: `${NEXT_APP_EXPRESS_API_ENDPOINT}/`,
    })
    // this.getMyLocalNotes = this.getMyLocalNotes.bind(this)
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

  async getNotes(url, { searchByTitle, searchByDescription }) {
    if (!!this.getNotesCancelTokenSource) this.getNotesCancelTokenSource.cancel('axios request cancelled')

    const source = createCancelTokenSource()
    this.getNotesCancelTokenSource = source
    const params = {}
    if (!!searchByTitle) params.q_title = encodeURIComponent(searchByTitle)
    if (!!searchByDescription) params.q_description = encodeURIComponent(searchByDescription)

    const result = await this.axiosInstance({
      method: 'GET',
      params,
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

  async getNoteNoCancel(id) {
    const result = await this.axiosInstance({
      method: 'GET',
      url: `/notes/${id}`,
      // mode: 'cors',
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

    if (result.isOk) {
      return Promise.resolve(result.res.data)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }

  async getMe(token) {
    if (!!this.getMeCancelTokenSource) this.getMeCancelTokenSource.cancel('axios request cancelled')

    this.getMeCancelTokenSource = createCancelTokenSource()

    const headers = {}

    if (!!token) headers.token = token
    const result = await this.axiosEApiInstance({
      method: 'GET',
      url: '/users/me',
      cancelToken: this.getMeCancelTokenSource.token,
      headers,
    })
      .then(httpErrorHandler)
      .then(this.responseDataHandlerAfterHttpErrorHandler(({ _id }) => !!_id))
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    this.getMeCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }
  async checkMe(token) {
    let result = false
    const user = await this.getMe(token)
      .then((user) => {
        // console.log(user)
        result = true
      })
      .catch((msg) => {
        console.log(msg)
      })

    return result
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

  async saveMyLocalNotes({ lsData, socketId }, url = '/crossdevice/local-notes') {
    if (!socketId) return Promise.reject('ERR: socketId should be provided')

    if (!!this.crossdeviceSaveCancelTokenSource) this.crossdeviceSaveCancelTokenSource.cancel('axios request cancelled')

    const source = createCancelTokenSource()
    this.crossdeviceSaveCancelTokenSource = source

    const result = await this.axiosInstance({
      method: 'POST',
      url,
      // mode: 'cors',
      data: {
        lsData,
        socketId,
      },
      cancelToken: this.crossdeviceSaveCancelTokenSource.token,
    })
      .then(httpErrorHandler)
      .then(this.responseDataHandlerAfterHttpErrorHandler(({ success }) => success))
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    this.crossdeviceSaveCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(this.getErrorMsg(result.res))
  }
  async getMyLocalNotes({ payload }, url = '/crossdevice/local-notes') {
    const self = HttpClientSingletone._instance

    if (!!self.crossdeviceGetCancelTokenSource) self.crossdeviceGetCancelTokenSource.cancel('axios request cancelled')
    const source = createCancelTokenSource()
    self.crossdeviceGetCancelTokenSource = source

    const result = await self
      .axiosInstance({
        method: 'GET',
        url: `${url}?payload=${payload}`,
        // mode: 'cors',
        cancelToken: self.crossdeviceGetCancelTokenSource.token,
        validateStatus: (status) => status >= 200 && status < 500,
      })
      .then(httpErrorHandler)
      .then(
        self.responseDataHandlerAfterHttpErrorHandler((res) => {
          const { success, data } = res

          return success && !!data
        })
      )
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, res: err }
      })

    self.crossdeviceGetCancelTokenSource = null
    if (result.isOk) {
      return Promise.resolve(result.res)
    }
    if (result.res instanceof HttpError) {
      return Promise.reject(result.res.getErrorMsg())
    }
    return Promise.reject(self.getErrorMsg(result.res))
  }
}

export const httpClient = HttpClientSingletone.getInstance()
