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

export const apiGet = <K, T>(url: string, props: K, action: Dispatcher<T>) => {
  window.FakerApi.get(url, props)
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

export const apiDelete = <K, T>(url: string, props: K, action: Dispatcher<T>) => {
  window.FakerApi.delete(url, props)
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

export const apiPut = <K, T>(url: string, post_id: string, props: K, action: Dispatcher<T>) => {
  window.FakerApi.put(url, { post_id, post: props })
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
