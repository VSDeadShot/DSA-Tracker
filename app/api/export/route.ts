import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const problems = await prisma.problem.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
    include: {
      reviews: {
        orderBy: { reviewed_at: 'desc' },
        take: 1,
      },
    },
  })

  // Create CSV Header
  const headers = ['Title', 'URL', 'Platform', 'Difficulty', 'Topic', 'Total Reviews', 'Next Review Date', 'Added On']
  
  // Format rows
  const rows = problems.map(p => {
    const nextReview = p.reviews[0]?.next_review_date ? new Date(p.reviews[0].next_review_date).toLocaleDateString() : 'N/A'
    
    return [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.url}"`,
      p.platform,
      p.difficulty,
      p.topic,
      p.reviews.length.toString(),
      nextReview,
      p.created_at.toLocaleDateString()
    ].join(',')
  })

  const csvContent = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="dsa-tracker-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
