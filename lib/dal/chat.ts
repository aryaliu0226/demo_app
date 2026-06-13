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

export type CreatedChatMessage = {
  id: string
  role: string
  content: string
  sessionId: string
  createdAt: Date
}

export async function prismaCreateChatSession(
  userId: string,
): Promise<CreatedChatSession> {
  return prisma.chatSession.create({
    data: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function prismaCreateChatMessage(params: {
  sessionId: string
  role: ChatMessageRole
  content: string
}): Promise<CreatedChatMessage> {
  return prisma.chatMessage.create({
    data: params,
    select: {
      id: true,
      role: true,
      content: true,
      sessionId: true,
      createdAt: true,
    },
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
