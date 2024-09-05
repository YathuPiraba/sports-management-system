<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RankingController extends Controller
{
    /**
     * Create or update a ranking for a specific event sport.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventSportId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $eventSportId)
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'rank' => 'required|integer|min:1',
        ]);

        $ranking = Ranking::updateOrCreate(
            [
                'event_sport_id' => $eventSportId,
                'club_id' => $request->club_id
            ],
            [
                'rank' => $request->rank
            ]
        );

        return response()->json($ranking, Response::HTTP_OK);
    }

    /**
     * Get all rankings for a specific event sport.
     *
     * @param int $eventSportId
     * @return \Illuminate\Http\Response
     */
    public function index($eventSportId)
    {
        $rankings = Ranking::where('event_sport_id', $eventSportId)->orderBy('rank')->get();
        return response()->json($rankings);
    }

    /**
     * Get a specific ranking.
     *
     * @param int $eventSportId
     * @param int $clubId
     * @return \Illuminate\Http\Response
     */
    public function show($eventSportId, $clubId)
    {
        $ranking = Ranking::where('event_sport_id', $eventSportId)
                          ->where('club_id', $clubId)
                          ->firstOrFail();
        return response()->json($ranking);
    }

    /**
     * Update a specific ranking.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventSportId
     * @param int $clubId
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $eventSportId, $clubId)
    {
        $request->validate([
            'rank' => 'required|integer|min:1',
        ]);

        $ranking = Ranking::where('event_sport_id', $eventSportId)
                          ->where('club_id', $clubId)
                          ->firstOrFail();
        $ranking->update(['rank' => $request->rank]);

        return response()->json($ranking);
    }

    /**
     * Delete a specific ranking.
     *
     * @param int $eventSportId
     * @param int $clubId
     * @return \Illuminate\Http\Response
     */
    public function destroy($eventSportId, $clubId)
    {
        $ranking = Ranking::where('event_sport_id', $eventSportId)
                          ->where('club_id', $clubId)
                          ->firstOrFail();
        $ranking->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
