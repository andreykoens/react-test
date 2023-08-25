/*================================ Response ==============================*/

export interface IResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface IResponseError {
  success: boolean
  message: string
}

/*================================ Auth ==============================*/

export interface ILogin {
  username: string
  password: string
}

export interface IRegister {
  name: string
  username: string
  password: string
  passwordconfirm?: string
}

export interface IUser {
  name: string
  username: string
  password: string //TODO: Maybe not a good idea, bad security
  id: number
}
