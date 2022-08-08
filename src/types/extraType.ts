export interface UploadResp {
  code: number;
  message: string;
  data: {
    url: string;
  };
}
export interface UploadError{
  error:any;
  file:File;
}