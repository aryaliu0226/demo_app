/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export type ChatSessionListItem = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  latestMessage: {
    id: string
    role: string
    content: string
    createdAt: Date
  } | null
}

export type CreatedChatSession = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export type ChatMessageRole = 'user' | 'assistant'

export type ChatDisplayMessage = {
  role: ChatMessageRole
  content: string
}

export type CreatedChatMessage = {
  id: string
  role: string
  content: string
  sessionId: string
  createdAt: Date
}

export type CreatedChatSessionWithMessage = {
  session: CreatedChatSession
  message: CreatedChatMessage
}

export async function prismaCreateChatSession(
  userId: string,
  title?: string,
): Promise<CreatedChatSession> {
  return prisma.chatSession.create({
    data: { userId, ...(title && { title }) },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function prismaCreateChatSessionWithMessage(params: {
  userId: string
  title: string
  content: string
}): Promise<CreatedChatSessionWithMessage> {
  return prisma.$transaction(async tx => {
    const session = await tx.chatSession.create({
      data: { userId: params.userId, title: params.title },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const message = await tx.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: params.content,
      },
      select: {
        id: true,
        role: true,
        content: true,
        sessionId: true,
        createdAt: true,
      },
    })

    return { session, message }
  })
}

export async function prismaCreateChatMessage(params: {
  sessionId: string
  role: ChatMessageRole
  content: string
}): Promise<CreatedChatMessage> {
  return prisma.$transaction(async tx => {
    const message = await tx.chatMessage.create({
      data: params,
      select: {
        id: true,
        role: true,
        content: true,
        sessionId: true,
        createdAt: true,
      },
    })

    await tx.chatSession.update({
      where: { id: params.sessionId },
      data: { updatedAt: new Date() },
      select: { id: true },
    })

    return message
  })
}

export async function prismaChatSessionBelongsToUser(
  userId: string,
  sessionId: string,
): Promise<boolean> {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  })

  return Boolean(session)
}

export async function prismaCreateUserChatMessageIfNeeded(params: {
  sessionId: string
  content: string
}): Promise<CreatedChatMessage | null> {
  return prisma.$transaction(async tx => {
    const latest = await tx.chatMessage.findFirst({
      where: { sessionId: params.sessionId },
      orderBy: { createdAt: Prisma.SortOrder.desc },
      select: {
        role: true,
        content: true,
      },
    })

    if (latest?.role === 'user' && latest.content === params.content) {
      return null
    }

    const message = await tx.chatMessage.create({
      data: {
        sessionId: params.sessionId,
        role: 'user',
        content: params.content,
      },
      select: {
        id: true,
        role: true,
        content: true,
        sessionId: true,
        createdAt: true,
      },
    })

    await tx.chatSession.update({
      where: { id: params.sessionId },
      data: { updatedAt: new Date() },
      select: { id: true },
    })

    return message
  })
}

export async function prismaGetChatSessionsByUser(
  userId: string,
): Promise<ChatSessionListItem[]> {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: Prisma.SortOrder.desc },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: Prisma.SortOrder.desc },
        take: 1,
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })

  return sessions.map(session => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session._count.messages,
    latestMessage: session.messages[0] ?? null,
  }))
}

export async function prismaDeleteChatSession(
  userId: string,
  sessionId: string,
): Promise<boolean> {
  const result = await prisma.chatSession.deleteMany({
    where: { id: sessionId, userId },
  })

  return result.count > 0
}

function isChatMessageRole(role: string): role is ChatMessageRole {
  return role === 'user' || role === 'assistant'
}

export async function prismaGetChatSessionMessages(
  userId: string,
  sessionId: string,
): Promise<ChatDisplayMessage[] | null> {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
    select: {
      messages: {
        orderBy: { createdAt: Prisma.SortOrder.asc },
        select: {
          role: true,
          content: true,
        },
      },
    },
  })

  if (!session) return null

  return session.messages.flatMap(message => {
    if (!isChatMessageRole(message.role)) return []

    return [{
      role: message.role,
      content: message.content,
    }]
  })
}
