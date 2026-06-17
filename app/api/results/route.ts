import { createSupabaseServer } from '@/lib/supabase-server';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): { points: number; exactScore: boolean; correctWinner: boolean } {
  const exactScore = predictedHome === actualHome && predictedAway === actualAway
  if (exactScore) return { points: 8, exactScore: true, correctWinner: true }

  const predictedWinner = predictedHome > predictedAway ? 'home'
    : predictedHome < predictedAway ? 'away' : 'draw'
  const actualWinner = actualHome > actualAway ? 'home'
    : actualHome < actualAway ? 'away' : 'draw'

  const correctWinner = predictedWinner === actualWinner
  if (correctWinner) return { points: 3, exactScore: false, correctWinner: true }

  return { points: 0, exactScore: false, correctWinner: false }
}

export async function POST(request: NextRequest) {
 const supabase = await createSupabaseServer()

  const { matchId, homeScore, awayScore, secret } = await request.json()

  // بسيطة عشان الـ n8n workflow يقدر يكلمها
  if (secret !== process.env.RESULTS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. حدث نتيجة الماتش
  const { error: matchError } = await supabase
    .from('matches')
    .update({
      home_score: homeScore,
      away_score: awayScore,
      status: 'finished'
    })
    .eq('id', matchId)

  if (matchError) return NextResponse.json({ error: matchError.message }, { status: 500 })

  // 2. جيب كل predictions للماتش ده
  const { data: predictions } = await supabase
    .from('user_predictions')
    .select('*')
    .eq('match_id', matchId)

  if (!predictions || predictions.length === 0) {
    return NextResponse.json({ message: 'No predictions found', processed: 0 })
  }

  // 3. احسب النقط لكل يوزر وحدثها
  for (const prediction of predictions) {
    const { points, exactScore, correctWinner } = calculatePoints(
      prediction.predicted_home_score,
      prediction.predicted_away_score,
      homeScore,
      awayScore
    )

    // حدث الـ prediction
    await supabase
      .from('user_predictions')
      .update({ points_earned: points })
      .eq('id', prediction.id)

    // حدث الـ leaderboard
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', prediction.user_id)
      .single()

    if (existing) {
      await supabase
        .from('leaderboard')
        .update({
          total_points: existing.total_points + points,
          exact_scores: existing.exact_scores + (exactScore ? 1 : 0),
          correct_winners: existing.correct_winners + (correctWinner ? 1 : 0),
          matches_predicted: existing.matches_predicted + 1,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', prediction.user_id)
    } else {
      await supabase
        .from('leaderboard')
        .insert({
          user_id: prediction.user_id,
          total_points: points,
          exact_scores: exactScore ? 1 : 0,
          correct_winners: correctWinner ? 1 : 0,
          matches_predicted: 1,
        })
    }
  }

  // 4. احسب نقط الـ AI كمان
  const { data: aiPrediction } = await supabase
    .from('ai_predictions')
    .select('*')
    .eq('match_id', matchId)
    .single()

  if (aiPrediction) {
    const { points, exactScore, correctWinner } = calculatePoints(
      aiPrediction.predicted_home_score,
      aiPrediction.predicted_away_score,
      homeScore,
      awayScore
    )

    const AI_USER_ID = '00000000-0000-0000-0000-000000000001'
    const { data: aiLeaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', AI_USER_ID)
      .single()

    if (aiLeaderboard) {
      await supabase
        .from('leaderboard')
        .update({
          total_points: aiLeaderboard.total_points + points,
          exact_scores: aiLeaderboard.exact_scores + (exactScore ? 1 : 0),
          correct_winners: aiLeaderboard.correct_winners + (correctWinner ? 1 : 0),
          matches_predicted: aiLeaderboard.matches_predicted + 1,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', AI_USER_ID)
    }
  }

  return NextResponse.json({ message: 'Results processed', processed: predictions.length })
}