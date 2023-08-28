/*================================ Response ==============================*/

export interface IResponse<T> {
  success: boolean
  message?: string
  data?: T
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

/*================================ Records ==============================*/

export interface IRecordUser {
  name: string
  username: string
  password: string
  id: number
}

export interface IRecordPost {
  id?: number
  user_id?: number
  title: string
  content: string
  message?: string //TODO: remove after api cleanup
  comments?: IRecordComment[]
}

export interface IRecordPostDelete {
  post_id: number
}

export interface IRecordComment {
  id?: number
  user_id?: number
  content: string
}

export interface IRecordCommentDelete {
  post_id: number
  comment_id: number
}

/*================================ Records ==============================*/
