import { IResponseError } from 'types/api'

export const alertError = (error: IResponseError) => {
  console.error(error)
}
export const alertErrorApi = () => {
  console.error('API Bad Response')
}
