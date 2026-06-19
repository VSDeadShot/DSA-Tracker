import { describe, it, expect, beforeEach, vi } from 'vitest'
import { calculateSM2 } from './sm2'

describe('SM-2 Algorithm', () => {
  beforeEach(() => {
    // Mock the current date to a fixed point in time for consistent testing
    // Let's say today is Jan 1, 2026
    const date = new Date(2026, 0, 1)
    vi.useFakeTimers()
    vi.setSystemTime(date)
  })

  it('should set interval to 1 day for a brand new problem regardless of high confidence', () => {
    const result = calculateSM2(5, 0, 2.5)
    expect(result.intervalDays).toBe(1)
    expect(result.easeFactor).toBe(2.6) // EF increases slightly on a 5
    expect(result.nextReviewDate).toEqual(new Date(2026, 0, 2))
  })

  it('should reset interval to 1 day if confidence is < 3', () => {
    // Let's pretend they were on a 10 day interval and did poorly
    const result = calculateSM2(2, 10, 2.5)
    expect(result.intervalDays).toBe(1)
    expect(result.easeFactor).toBe(2.5) // EF remains unchanged on poor performance
    expect(result.nextReviewDate).toEqual(new Date(2026, 0, 2))
  })

  it('should set interval to 6 days for the second successful review', () => {
    const result = calculateSM2(4, 1, 2.5)
    expect(result.intervalDays).toBe(6)
    expect(result.easeFactor).toBe(2.5) // EF remains unchanged on a 4
    expect(result.nextReviewDate).toEqual(new Date(2026, 0, 7))
  })

  it('should scale the interval using the ease factor for the third review', () => {
    const result = calculateSM2(4, 6, 2.5)
    expect(result.intervalDays).toBe(15) // 6 * 2.5 = 15
    expect(result.easeFactor).toBe(2.5)
    expect(result.nextReviewDate).toEqual(new Date(2026, 0, 16))
  })

  it('should not let the ease factor drop below 1.3', () => {
    const result = calculateSM2(3, 10, 1.3)
    // On a 3, EF should drop by 0.14. But since it's already 1.3, it shouldn't drop further.
    expect(result.easeFactor).toBe(1.3)
  })
})
