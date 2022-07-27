import { message } from 'ant-design-vue'
interface CheckCondition {
  format?: string[];
  // 使用多少 M 为单位
  size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
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
  return [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index)
  ]
}

export function isMobile (mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob)
    })
  })
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
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const objToQueryString = (queryObj: { [key: string]: any }) => {
  return Object.keys(queryObj).map(key => `${key}=${queryObj[key]}`).join('&')
}
