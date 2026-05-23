import { HttpException, HttpStatus } from '@nestjs/common'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  meta?: any
}

export const success = <T = any>(
  data?: T,
  message = 'Request successful',
  meta?: any,
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta,
  }
}

export const error = (
  message = 'Request failed',
  code = HttpStatus.BAD_REQUEST,
): never => {
  throw new HttpException(
    {
      success: false,
      message,
    },
    code,
  )
}