import QRCode from 'qrcode'
import { promisify } from 'es6-promisify'
import buildUrl from 'build-url'

const { NEXT_APP_QR_BASE_URL } = process.env

if (!NEXT_APP_QR_BASE_URL) throw new Error('ENV ERR: NEXT_APP_QR_BASE_URL should be provided')

const genDataUrl = promisify(QRCode.toDataURL.bind(QRCode))

// NOTE: Несколько других устройств для аутентификации по QR коду:
// TODO: Could be moved to envs
const authOnOtherDevicesLimit = 1

/**
 * Класс Одиночка предоставляет метод getInstance, который позволяет клиентам
 * получить доступ к уникальному экземпляру одиночки.
 */
class CrossDeviceSingleton {
  /**
   * Конструктор Одиночки всегда должен быть скрытым, чтобы предотвратить
   * создание объекта через оператор new.
   */
  constructor() {
    this.state = new Map()
  }

  /**
   * Статический метод, управляющий доступом к экземпляру одиночки.
   *
   * Эта реализация позволяет вам расширять класс Одиночки, сохраняя повсюду
   * только один экземпляр каждого подкласса.
   */
  static getInstance() {
    if (!CrossDeviceSingleton.instance) {
      CrossDeviceSingleton.instance = new CrossDeviceSingleton()
    }

    return CrossDeviceSingleton.instance
  }

  /**
   * Наконец, любой одиночка должен содержать некоторую бизнес-логику, которая
   * может быть выполнена на его экземпляре.
   */
  async getQR(payload) {
    const url = buildUrl(NEXT_APP_QR_BASE_URL, {
      path: '/crossdevice/set-local-notes',
      queryParams: {
        payload,
      },
    })

    const dataUrl = await genDataUrl(url)

    return dataUrl
  }
  getState() {
    const state = {}

    this.state.forEach((value, key) => {
      state[key] = value
    })

    return state
  }
  async addSomeonesLocalNotes({ reqId, lsData, qrPayload, ip, geo, socketId }) {
    const qr = await this.getQR(qrPayload)

    this.state.set(reqId, {
      ip,
      geo,
      qr,
      qrUsageCounter: 0,
      lsData,
      qrPayload,
      ts: new Date().getTime(),
      socketId,
    })

    return qr
  }
  replaceSocketId({ newSocketId, reqIdAsUniqueKey, ip, geo }) {
    let success = false
    const data = this.state.get(reqIdAsUniqueKey)

    if (!!data) {
      const modifiedData = {
        ...data,
        socketId: newSocketId,
        ts: new Date().getTime(),
        ip,
        geo,
      }

      this.state.set(reqIdAsUniqueKey, modifiedData)
      success = true
    }

    return { success, oldSocketId: data?.socketId }
  }
  getSomeonesLocalNotesOrDeletePromise(reqId) {
    if (this.state.has(reqId)) {
      const targetLSData = this.state.get(reqId)

      if (!targetLSData) return Promise.reject('ERR: Внутренняя ошибка ts (impossible case)')

      const currentCounter = targetLSData.qrUsageCounter

      if (currentCounter + 1 >= authOnOtherDevicesLimit) {
        this.state.delete(reqId)
        return Promise.resolve({
          message: 'Запрос с другого устройства',
          data: targetLSData,
          haveToBeKilled: true,
        })
      } else {
        const newQRUsageCounter = currentCounter + 1
        const newData = {
          ...targetLSData,
          qrUsageCounter: newQRUsageCounter,
        }

        this.state.set(reqId, newData)
        return Promise.resolve({
          message: `Запрос с другого устройства ${newQRUsageCounter} раз из ${authOnOtherDevicesLimit} возможных`,
          data: newData,
          haveToBeKilled: false,
        })
      }
    } else {
      return Promise.reject({
        message: '🚫 Извините, мы про#6@ли Ваши данные. С уважением, code-samples.space',
        data: null,
      })
    }
  }
  clearState() {
    this.state.clear()
  }
}

export const crossDeviceState = CrossDeviceSingleton.getInstance()
