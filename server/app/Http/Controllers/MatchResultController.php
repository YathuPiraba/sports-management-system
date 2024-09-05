<?php

namespace App\Http\Controllers;

use App\Models\MatchResult;
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
        $request->validate([
            'match_schedule_id' => 'required|exists:match_schedules,id',
            'winner_club_id' => 'required|exists:clubs,id',
            'score_club_1' => 'required|integer',
            'score_club_2' => 'required|integer',
        ]);

        $matchResult = MatchResult::create([
            'match_schedule_id' => $request->match_schedule_id,
            'winner_club_id' => $request->winner_club_id,
            'score_club_1' => $request->score_club_1,
            'score_club_2' => $request->score_club_2,
        ]);

        return response()->json($matchResult, Response::HTTP_CREATED);
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
