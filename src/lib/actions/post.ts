/** @format */
'use server'

import { getPostsApi, type Post, type PostQuery } from '@/lib/dal/post'

export async function fetchPostsAction(
  params: PostQuery,
): Promise<{ data: Post[]; total: number }> {
  return getPostsApi(params)
}
