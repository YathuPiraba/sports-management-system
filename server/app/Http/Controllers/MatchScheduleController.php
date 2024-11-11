<?php

namespace App\Http\Controllers;

use App\Models\MatchSchedule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

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
        // Validate request for multiple matches
        $validator = Validator::make($request->all(), [
            'event_sports_id' => 'required|exists:event_sports,id',
            'matches' => 'required|array|min:1',
            'matches.*.home_club_id' => 'required|exists:clubs,id',
            'matches.*.away_club_id' => 'required|exists:clubs,id',
            'matches.*.match_date' => 'required|date',
            'matches.*.time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $matchSchedules = [];

        foreach ($request->matches as $match) {
            $matchSchedule = MatchSchedule::create([
                'event_sports_id' => $request->event_sports_id,
                'home_club_id' => $match['home_club_id'],
                'away_club_id' => $match['away_club_id'],
                'match_date' => $match['match_date'],
                'time' => $match['time'],
            ]);

            $matchSchedules[] = $matchSchedule;
        }

        return response()->json(['data' => $matchSchedules], Response::HTTP_CREATED);
    }

    /**
     * Get all matches for a specific event sport.
     *
     * @param int $eventSportId
     * @return \Illuminate\Http\Response
     */
    public function index($eventSportId)
    {
        $matches = MatchSchedule::where('event_sports_id', $eventSportId)->get();
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

    public function getMatchSchedulesByEvent($eventId)
    {
        try {
            // Fetch match schedules for the specific event with related home club, away club, and event sport details
            $matchSchedules = MatchSchedule::whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })
                ->with([
                    'homeClub:id,clubName,clubImage',
                    'awayClub:id,clubName,clubImage',
                    'eventSport:id,name,start_date,end_date,place,sports_id',
                ])
                ->get(); // Fetch all match schedules without grouping

            // Format the response for each match schedule
            $matchData = $matchSchedules->map(function ($match) {
                return [
                    'date' => \Carbon\Carbon::parse($match->match_date)->format('F d, Y'), // format match_date as "November 12, 2024"
                    'sport' => $match->eventSport->name, // event sport name
                    'sportImage' => $match->eventSport->sportsCategory ? $match->eventSport->sportsCategory->image : null, // Use sportsCategory image or null
                    'club1' => [
                        'id' => $match->homeClub->id, // Home club ID
                        'name' => $match->homeClub->clubName, // Home club name
                        'image' => $match->homeClub->clubImage ?? null, // Default placeholder if club image is null
                    ],
                    'club2' => [
                        'id' => $match->awayClub->id, // Away club ID
                        'name' => $match->awayClub->clubName, // Away club name
                        'image' => $match->awayClub->clubImage ?? null, // Default placeholder if club image is null
                    ],
                    'time' => $match->time, // Match time
                    'place' => $match->eventSport->place, // Event sport place
                    'event_sport_id' => $match->eventSport->id,
                    'event_start_date' => $match->eventSport->start_date,
                    'event_end_date' => $match->eventSport->end_date,
                    'home_club_id' => $match->homeClub->id, // Home club ID
                    'away_club_id' => $match->awayClub->id, // Away club ID
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $matchData, // Return the formatted match schedules directly (without grouping)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching match schedules by event ID: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching match schedules by event ID: ' . $e->getMessage(),
            ], 500);
        }
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
