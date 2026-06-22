'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addProblem(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const platform = formData.get('platform') as string
  const difficulty = formData.get('difficulty') as string
  const topic = formData.get('topic') as string
  const notes = formData.get('notes') as string | null

  if (!title || !url || !platform || !difficulty || !topic) {
    throw new Error('All fields except notes are required.')
  }

  // Create the problem in the database
  const problem = await prisma.problem.create({
    data: {
      user_id: user.id,
      title,
      url,
      platform,
      difficulty,
      topic,
      notes,
    },
  })

  // We revalidate the dashboard or problems list so the new problem shows up
  revalidatePath('/dashboard')
  
  // After adding, redirect back to dashboard (or you could redirect to the problem's page)
  redirect('/dashboard')
}
