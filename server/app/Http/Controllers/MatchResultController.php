<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\MatchResult;
use App\Models\MatchSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MatchResultController extends Controller
{
    /**
     * Create a new match result.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'match_id' => 'required|exists:matches,id',
            'home_club_id' => 'required|exists:clubs,id',
            'away_club_id' => 'required|exists:clubs,id',
            'home_score' => 'required|integer',
            'away_score' => 'required|integer',
            'winner_club_id' => 'nullable|exists:clubs,id',
        ]);

        // Determine the result based on winner_club_id
        $result = null;
        if ($request->winner_club_id) {
            // If a winner is provided, the result should be a win for that club
            $result = $request->winner_club_id === $request->home_club_id ? 'Home Win' : 'Away Win';
        } else {
            // If no winner, it's a draw
            $result = 'Draw';
        }

        // Create a new match result record
        $matchResult = MatchResult::create([
            'match_id' => $request->match_id,
            'home_score' => $request->home_score,
            'away_score' => $request->away_score,
            'winner_club_id' => $request->winner_club_id,
            'result' => $result,
        ]);

        // Return the created match result in the response
        return response()->json($matchResult, Response::HTTP_CREATED);
    }

    public function getClubStats($eventId)
    {
        // First, get all clubs that participated in matches for this event
        $participatingClubs = Club::whereHas('homeMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->orWhereHas('awayMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->get();

        $clubStats = $participatingClubs->map(function ($club) use ($eventId) {
            // Get all matches where this club participated
            $matches = MatchSchedule::where(function ($query) use ($club) {
                $query->where('home_club_id', $club->id)
                      ->orWhere('away_club_id', $club->id);
            })->whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with('matchResults')->get();

            // Initialize counters
            $wins = 0;
            $draws = 0;
            $losses = 0;

            foreach ($matches as $match) {
                if ($match->matchResults) {
                    $result = $match->matchResults;

                    if ($result->winner_club_id === $club->id) {
                        // Club won
                        $wins++;
                    } elseif ($result->winner_club_id === null) {
                        // Match was a draw
                        $draws++;
                    } else {
                        // Club lost
                        $losses++;
                    }
                }
            }

            return [
                'club_id' => $club->id,
                'club_name' => $club->clubName,
                'total_matches' => count($matches),
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'points' => ($wins * 3) + ($draws * 1) // Standard scoring: 3 points for win, 1 for draw
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $clubStats,
        ], 200);
    }

    /**
     * Get all results for a specific match schedule.
     *
     * @param int $matchScheduleId
     * @return \Illuminate\Http\Response
     */
    public function index($matchScheduleId)
    {
        $results = MatchResult::where('match_schedule_id', $matchScheduleId)->get();
        return response()->json($results);
    }

    /**
     * Get a specific match result.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = MatchResult::findOrFail($id);
        return response()->json($result);
    }

    /**
     * Update a specific match result.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'match_schedule_id' => 'sometimes|required|exists:match_schedules,id',
            'winner_club_id' => 'sometimes|required|exists:clubs,id',
            'score_club_1' => 'sometimes|required|integer',
            'score_club_2' => 'sometimes|required|integer',
        ]);

        $result = MatchResult::findOrFail($id);
        $result->update($request->all());

        return response()->json($result);
    }

    /**
     * Delete a specific match result.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $result = MatchResult::findOrFail($id);
        $result->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
