'use server'

import prisma from '@/lib/prisma'
import { getOwnedProblem } from '@/lib/problems'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function deleteProblem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const problemId = formData.get('id') as string
  if (!problemId) return

  // Verify ownership before deleting
  const problem = await getOwnedProblem(problemId, user.id)
  if (!problem) return

  await prisma.problem.delete({
    where: { id: problemId }
  })

  revalidatePath('/dashboard')
}

export async function updateTopic(problemId: string, topic: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Verify ownership before updating
  const problem = await getOwnedProblem(problemId, user.id)
  if (!problem) return

  await prisma.problem.update({
    where: { id: problemId },
    data: { topic }
  })

  revalidatePath('/dashboard')
  revalidatePath('/analytics')
}
