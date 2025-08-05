interface ScoreCardProps {
  score: {
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
  size?: 'small' | 'large'
}

export default function ScoreCard({ score, size = 'large' }: ScoreCardProps) {
  const isLarge = size === 'large'

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeColor = (grade: string) => {
    if (['A', 'B'].includes(grade)) return 'bg-green-100 text-green-800'
    if (['C', 'D'].includes(grade)) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (score.total_votes === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-${isLarge ? '6' : '4'} text-center`}>
        <div className="text-gray-500">
          <div className={`text-${isLarge ? '2xl' : 'lg'} font-bold mb-2`}>No Votes Yet</div>
          <p className="text-sm">This politician needs community votes to generate a score</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow p-${isLarge ? '6' : '4'}`}>
      <div className="text-center mb-4">
        <div className={`${getScoreColor(score.overall_score)} text-${isLarge ? '4xl' : '2xl'} font-bold`}>
          {score.overall_score}
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(score.grade)}`}>
          Grade {score.grade}
        </div>
        <div className="text-gray-600 text-sm mt-2">
          VowTrack Score
        </div>
      </div>

      {isLarge && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{score.completion_rate}%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{score.consensus_strength}%</div>
              <div className="text-gray-600">Consensus</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Complete:</span>
              <span className="font-medium">{score.breakdown.complete} votes</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <span className="font-medium">{score.breakdown.in_progress} votes</span>
            </div>
            <div className="flex justify-between">
              <span>Broken:</span>
              <span className="font-medium">{score.breakdown.broken} votes</span>
            </div>
            <div className="flex justify-between">
              <span>Not Started:</span>
              <span className="font-medium">{score.breakdown.not_started} votes</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
            Based on {score.total_votes} votes across {score.total_promises} promises
          </div>
        </>
      )}
    </div>
  )
}