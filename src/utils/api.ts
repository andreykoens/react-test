import { IResponse, IResponseError } from 'types/api'
import { alertError, alertErrorApi } from './alerts'

interface Dispatcher<T> {
  (data: T): void
}

export const apiPost = <K, T>(url: string, props: K, action: Dispatcher<T>) => {
  window.FakerApi.post(url, props)
    .catch((err: IResponseError) => {
      alertError(err)
    })
    .then((response: IResponse<T>) => {
      if (!response) {
        alertErrorApi()
        return
      }
      // Todo: adding message here to normalize API responses, bad practice
      action({ ...response.data, message: response.message || '' })
    })
}
