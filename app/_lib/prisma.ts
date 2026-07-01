/** @format */

import { Prisma, PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const SERVER_ERROR_MESSAGE = '服务端异常，请稍后重试'

export type NormalizedPrismaException = {
  name: string
  message: string
  clientVersion?: string
  code?: string
  errorCode?: string
  meta?: unknown
}

export class ServerException extends Error {
  constructor(cause?: unknown) {
    super(SERVER_ERROR_MESSAGE, { cause })
    this.name = 'ServerException'
  }
}

export function isServerException(error: unknown): error is ServerException {
  return error instanceof ServerException
}

export function normalizePrismaException(
  error: unknown,
): NormalizedPrismaException {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      name: error.name,
      message: error.message,
      clientVersion: error.clientVersion,
      code: error.code,
      meta: error.meta,
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      name: error.name,
      message: error.message,
      clientVersion: error.clientVersion,
    }
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      name: error.name,
      message: error.message,
      clientVersion: error.clientVersion,
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      name: error.name,
      message: error.message,
      clientVersion: error.clientVersion,
      errorCode: error.errorCode,
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      name: error.name,
      message: error.message,
      clientVersion: error.clientVersion,
    }
  }

  return {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
  }
}

export async function withPrismaException<T>(
  prismaOperate: () => Promise<T>,
): Promise<T> {
  try {
    return await prismaOperate()
  } catch (error) {
    console.error('[prisma]', normalizePrismaException(error))
    throw new ServerException(error)
  }
}

export default prisma
