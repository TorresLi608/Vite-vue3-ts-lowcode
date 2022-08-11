import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'
import axios from 'axios'
import { RespUploadData } from '@/types/extraType'
interface CheckCondition {
  format?: string[]
  // 使用多少 M 为单位
  size?: number
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png'],
    size: 1,
  })
  const { passed, error } = result
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (error === 'size') {
    message.error('上传图片大小不能超过 1Mb')
  }
  return passed
}

export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.src = typeof url === 'string' ? url : URL.createObjectURL(url)
    img.addEventListener('load', () => {
      const { naturalWidth: width, naturalHeight: height } = img
      resolve({ width, height })
    })
    img.addEventListener('error', () => {
      reject(new Error('There was some problem with the image.'))
    })
  })
}

export const getParentElement = (element: HTMLElement, className: string) => {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element
    } else {
      element = element.parentNode as HTMLElement
    }
  }
  return null
}

export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)]
}

export function copyToClipboard(text: string) {
  // create a fake textarea, set value to text
  const textarea = document.createElement('textarea')
  textarea.value = text
  // define styles to be hidden
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '-9999px'
  // append to body and select
  document.body.appendChild(textarea)
  textarea.select()
  // run execCommand in try/catch
  try {
    return document.execCommand('copy')
  } catch (e) {
    console.warn('copy failed', e)
  } finally {
    document.body.removeChild(textarea)
  }
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const objToQueryString = (queryObj: { [key: string]: any }) => {
  return Object.keys(queryObj)
    .map((key) => `${key}=${queryObj[key]}`)
    .join('&')
}

export const debounceChange = (
  callback: (...args: any) => void,
  timeout = 500
) => {
  let timer = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      timer = 0
      callback(...args)
    }, timeout)
  }
}

export async function uploadFile<R = any>(
  file: Blob,
  url = '/utils/upload-img',
  fileName = 'screenshot.png'
) {
  const newFile = file instanceof File ? file : new File([file], fileName)
  const formData = new FormData()
  formData.append(newFile.name, newFile)
  try {
    const { data } = await axios.post<R>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    message.error('上传失败')
    return false
  }
}

function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}
export async function takeScreenshotAndUpload(ele: HTMLElement) {
  const canvas = await html2canvas(ele, { width: 375, useCORS: true, scale: 1 })
  const canvasBlob = await getCanvasBlob(canvas)
  if (canvasBlob) {
    const data = await uploadFile<RespUploadData>(canvasBlob)
    return data
  }
}

export function generateQRCode(id: string, url: string, width = 100) {
  const ele = document.getElementById(id) as HTMLCanvasElement
  return QRCode.toCanvas(ele, url, { width, margin: 0 })
}

export function downloadFile(src: string, fileName = 'default') {
  const link = document.createElement('a')
  link.download = fileName
  link.rel = 'noopener'
  // 判断文件是否跨域
  if (link.origin !== location.origin) {
    axios
      .get(src, { responseType: 'blob' })
      .then((data) => {
        // 返回二进制文件
        link.href = URL.createObjectURL(data.data)
        setTimeout(() => {
          link.dispatchEvent(new MouseEvent('click'))
        })
        // 释放URL.createObjectURL 缓存
        setTimeout(() => {
          URL.revokeObjectURL(link.href)
        }, 10000)
      })
      .catch(() => {
        link.target = '_blank'
        link.href = src
        link.dispatchEvent(new MouseEvent('click'))
      })
  } else {
    link.href = src
    link.dispatchEvent(new MouseEvent('click'))
  }
}

export function downloadImage(src: string, fileName = 'default') {
  saveAs(src, fileName)
}
