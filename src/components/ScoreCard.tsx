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
    if (score >= 80) return 'text-status-complete'
    if (score >= 60) return 'text-status-progress'
    return 'text-status-broken'
  }

  const getGradeColor = (grade: string) => {
    if (['A', 'B'].includes(grade)) return 'bg-status-complete text-status-complete'
    if (['C', 'D'].includes(grade)) return 'bg-status-progress text-status-progress'
    return 'bg-status-broken text-status-broken'
  }

  if (score.total_votes === 0) {
    return (
      <div className={`bg-neutral-50 rounded-lg p-${isLarge ? '6' : '4'} text-center border border-default`}>
        <div className="text-muted">
          <div className={`text-${isLarge ? '2xl' : 'lg'} font-bold mb-2`}>No Votes Yet</div>
          <p className="text-sm">This politician needs community votes to generate a score</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-surface rounded-lg shadow p-${isLarge ? '6' : '4'} border border-default`}>
      <div className="text-center mb-4">
        <div className={`${getScoreColor(score.overall_score)} text-${isLarge ? '4xl' : '2xl'} font-bold`}>
          {score.overall_score}
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(score.grade)}`}>
          Grade {score.grade}
        </div>
        <div className="text-muted text-sm mt-2">
          VowTrack Score
        </div>
      </div>

      {isLarge && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-primary">{score.completion_rate}%</div>
              <div className="text-secondary">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-primary">{score.consensus_strength}%</div>
              <div className="text-secondary">Consensus</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Complete:</span>
              <span className="font-medium text-primary">{score.breakdown.complete} votes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">In Progress:</span>
              <span className="font-medium text-primary">{score.breakdown.in_progress} votes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Broken:</span>
              <span className="font-medium text-primary">{score.breakdown.broken} votes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Not Started:</span>
              <span className="font-medium text-primary">{score.breakdown.not_started} votes</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-default text-center text-xs text-muted">
            Based on {score.total_votes} votes across {score.total_promises} promises
          </div>
        </>
      )}
    </div>
  )
}