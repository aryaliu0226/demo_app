/** @format */
'use server'

import { prismaGetPosts, prismaGetSearchSuggestions, type Post, type PostQuery } from '@/lib/dal/post'

export { type PostQuery }

export async function fetchSearchSuggestionsAction(keywords: string): Promise<string[]> {
  return prismaGetSearchSuggestions(keywords)
}

export async function fetchPostsAction(
  params: PostQuery,
): Promise<{ data: Post[]; total: number }> {
  return prismaGetPosts(params)
}
