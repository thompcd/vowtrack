interface Promise {
  id: number
  promise_votes: Array<{ vote_status: string }>
}

interface ScoreResult {
  overall_score: number
  total_promises: number
  completion_rate: number
  consensus_strength: number
  total_votes: number
  breakdown: {
    complete: number
    in_progress: number
    broken: number
    not_started: number
  }
  grade: string
}

export function calculatePoliticianScore(promises: Promise[]): ScoreResult {
  if (!promises || promises.length === 0) {
    return {
      overall_score: 0,
      total_promises: 0,
      completion_rate: 0,
      consensus_strength: 0,
      total_votes: 0,
      breakdown: { complete: 0, in_progress: 0, broken: 0, not_started: 0 },
      grade: 'N/A'
    }
  }

  let totalWeightedScore = 0
  let totalWeight = 0
  let totalVotes = 0
  const breakdown = { complete: 0, in_progress: 0, broken: 0, not_started: 0 }

  // Calculate score for each promise
  promises.forEach(promise => {
    const votes = promise.promise_votes || []
    const voteCount = votes.length

    if (voteCount === 0) return // Skip promises with no votes

    totalVotes += voteCount

    // Count votes by status
    const voteCounts = votes.reduce((acc: any, vote) => {
      acc[vote.vote_status] = (acc[vote.vote_status] || 0) + 1
      return acc
    }, {})

    const complete = voteCounts['Complete'] || 0
    const inProgress = voteCounts['In Progress'] || 0
    const broken = voteCounts['Broken'] || 0
    const notStarted = voteCounts['Not Started'] || 0

    // Add to breakdown
    breakdown.complete += complete
    breakdown.in_progress += inProgress
    breakdown.broken += broken
    breakdown.not_started += notStarted

    // Calculate promise score (0-100)
    // Complete = 100 points, In Progress = 50 points, Broken = 0 points, Not Started = 25 points
    const promiseScore = (
      (complete * 100) + 
      (inProgress * 50) + 
      (broken * 0) + 
      (notStarted * 25)
    ) / voteCount

    // Weight by number of votes (more votes = more reliable)
    const weight = Math.min(voteCount, 10) // Cap weight at 10 votes to prevent single promises from dominating
    totalWeightedScore += promiseScore * weight
    totalWeight += weight
  })

  // Calculate metrics
  const overall_score = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
  const completion_rate = totalVotes > 0 ? Math.round((breakdown.complete / totalVotes) * 100) : 0
  
  // Consensus strength: higher when votes are concentrated (not split evenly)
  const consensus_strength = totalVotes > 0 ? calculateConsensusStrength(breakdown, totalVotes) : 0

  // Letter grade
  const grade = getLetterGrade(overall_score)

  return {
    overall_score,
    total_promises: promises.length,
    completion_rate,
    consensus_strength,
    total_votes: totalVotes,
    breakdown,
    grade
  }
}

function calculateConsensusStrength(breakdown: any, totalVotes: number): number {
  const percentages = [
    breakdown.complete / totalVotes,
    breakdown.in_progress / totalVotes,
    breakdown.broken / totalVotes,
    breakdown.not_started / totalVotes
  ]

  // Calculate entropy (lower entropy = higher consensus)
  const entropy = -percentages.reduce((sum, p) => {
    return p > 0 ? sum + p * Math.log2(p) : sum
  }, 0)

  // Convert to 0-100 scale (2 is max entropy for 4 categories)
  return Math.round((1 - entropy / 2) * 100)
}

function getLetterGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}