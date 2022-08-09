export interface UploadResp<
  T = {
    url: string
  }
> {
  code: number
  message: string
  data: T
}
export interface UploadError {
  error: any
  file: File
}

export interface UploadData {
  urls: string[]
}

export type RespUploadData = UploadResp<UploadData>


