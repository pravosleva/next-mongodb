import QRCode from 'qrcode'
import { promisify } from 'es6-promisify'
import buildUrl from 'build-url'

const { NEXT_APP_QR_BASE_URL } = process.env

if (!NEXT_APP_QR_BASE_URL) throw new Error('ENV ERR: NEXT_APP_QR_BASE_URL should be provided')

const genDataUrl: (payload: string) => Promise<string> = promisify(QRCode.toDataURL.bind(QRCode))

// NOTE: Несколько других устройств для аутентификации по QR коду:
// TODO: Could be moved to envs
const authOnOtherDevicesLimit: number = 1

export type TMapValue = {
  ip?: string
  geo?: { [key: string]: any }
  qr: string
  qrUsageCounter: number
  lsData: any[]
  qrPayload: string
  ts: number
  socketId: string
}

/**
 * Класс Одиночка предоставляет метод getInstance, который позволяет клиентам
 * получить доступ к уникальному экземпляру одиночки.
 */
export class CrossDeviceSingleton {
  private static instance: CrossDeviceSingleton
  state: Map<string, TMapValue>

  /**
   * Конструктор Одиночки всегда должен быть скрытым, чтобы предотвратить
   * создание объекта через оператор new.
   */
  private constructor() {
    this.state = new Map()
  }

  /**
   * Статический метод, управляющий доступом к экземпляру одиночки.
   *
   * Эта реализация позволяет вам расширять класс Одиночки, сохраняя повсюду
   * только один экземпляр каждого подкласса.
   */
  public static getInstance(): CrossDeviceSingleton {
    if (!CrossDeviceSingleton.instance) {
      CrossDeviceSingleton.instance = new CrossDeviceSingleton()
    }

    return CrossDeviceSingleton.instance
  }

  /**
   * Наконец, любой одиночка должен содержать некоторую бизнес-логику, которая
   * может быть выполнена на его экземпляре.
   */
  public async getQR(payload: string) {
    // @ts-ignore
    const url = buildUrl(NEXT_APP_QR_BASE_URL, {
      path: '/crossdevice/set-local-notes',
      queryParams: {
        payload,
      },
    })

    const dataUrl = await genDataUrl(url)

    return dataUrl
  }
  public getState(): { [key: string]: TMapValue } {
    const state: { [key: string]: TMapValue } = {}

    this.state.forEach((value, key) => {
      state[key] = value
    })

    return state
  }
  public async addSomeonesLocalNotes({
    ip,
    geo,
    reqId,
    lsData,
    qrPayload,
    socketId,
  }: {
    ip?: string
    geo?: { [key: string]: any }
    reqId: string
    lsData: any[]
    qrPayload: string
    socketId: string
  }): Promise<string> {
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
  public getSomeonesLocalNotesOrDeletePromise(
    reqId: string
  ): Promise<{ data: TMapValue | null; message: string; haveToBeKilled: boolean }> {
    if (this.state.has(reqId)) {
      const targetLSData = this.state.get(reqId)

      if (!targetLSData) return Promise.reject('ERR: Внутренняя ошибка ts (impossible case)')

      const currentCounter = targetLSData.qrUsageCounter

      if (currentCounter + 1 >= authOnOtherDevicesLimit) {
        this.state.delete(reqId)
        return Promise.resolve({
          message: 'Заметки были запрошены с другого устройства и удалены из временной памяти в облаке',
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
          message: `Заметки были запрошены с другого устройства ${newQRUsageCounter} раз из ${authOnOtherDevicesLimit} возможных`,
          data: newData,
          haveToBeKilled: false,
        })
      }
    } else {
      return Promise.reject({
        message: 'Извините, мы про#6@ли Ваши данные. С уважением, code-samples.space',
        data: null,
      })
    }
  }
  public clearState(): void {
    this.state.clear()
  }
}

export const crossDeviceState = CrossDeviceSingleton.getInstance()
