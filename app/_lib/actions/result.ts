/** @format */

import {
  isServerException,
  SERVER_ERROR_MESSAGE,
} from '@/app/_lib/prisma'

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export function serverActionError(error: unknown): { success: false; error: string } {
  if (!isServerException(error)) {
    console.error('[server-action]', error)
  }

  return { success: false, error: SERVER_ERROR_MESSAGE }
}

export function serverActionMessage(error: unknown): string {
  if (!isServerException(error)) {
    console.error('[server-action]', error)
  }

  return SERVER_ERROR_MESSAGE
}
