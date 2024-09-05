<?php

namespace App\Http\Controllers;

use App\Models\MatchSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MatchScheduleController extends Controller
{
    /**
     * Create a new match schedule.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_sport_id' => 'required|exists:event_sports,id',
            'club_1_id' => 'required|exists:clubs,id',
            'club_2_id' => 'required|exists:clubs,id',
            'match_date' => 'required|date',
            'match_time' => 'required|date_format:H:i',
            'venue' => 'required|string|max:255',
        ]);

        $matchSchedule = MatchSchedule::create([
            'event_sport_id' => $request->event_sport_id,
            'club_1_id' => $request->club_1_id,
            'club_2_id' => $request->club_2_id,
            'match_date' => $request->match_date,
            'match_time' => $request->match_time,
            'venue' => $request->venue,
        ]);

        return response()->json($matchSchedule, Response::HTTP_CREATED);
    }

    /**
     * Get all matches for a specific event sport.
     *
     * @param int $eventSportId
     * @return \Illuminate\Http\Response
     */
    public function index($eventSportId)
    {
        $matches = MatchSchedule::where('event_sport_id', $eventSportId)->get();
        return response()->json($matches);
    }

    /**
     * Get a specific match.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $match = MatchSchedule::findOrFail($id);
        return response()->json($match);
    }

    /**
     * Update a specific match schedule.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'event_sport_id' => 'sometimes|required|exists:event_sports,id',
            'club_1_id' => 'sometimes|required|exists:clubs,id',
            'club_2_id' => 'sometimes|required|exists:clubs,id',
            'match_date' => 'sometimes|required|date',
            'match_time' => 'sometimes|required|date_format:H:i',
            'venue' => 'sometimes|required|string|max:255',
        ]);

        $match = MatchSchedule::findOrFail($id);
        $match->update($request->all());

        return response()->json($match);
    }

    /**
     * Delete a specific match schedule.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $match = MatchSchedule::findOrFail($id);
        $match->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
