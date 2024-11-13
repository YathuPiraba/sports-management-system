<?php

namespace App\Http\Controllers;

use App\Models\Events;
use App\Models\MatchSchedule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function getMatchSchedulesByEvent($eventId, Request $request)
    {
        try {
            // Get pagination and search parameters from request
            $perPage = $request->input('per_page', 1);
            $page = $request->input('page', 1);
            $searchDate = $request->input('date');

            // Base query
            $query = MatchSchedule::whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with([
                'homeClub:id,clubName,clubImage',
                'awayClub:id,clubName,clubImage',
                'eventSport:id,name,start_date,end_date,place,sports_id',
            ]);

            // Add date search if provided
            if ($searchDate) {
                // Convert the search date to Y-m-d format for consistent comparison
                $formattedSearchDate = \Carbon\Carbon::parse($searchDate)->format('Y-m-d');
                $query->whereDate('match_date', $formattedSearchDate);
            }

            // Get sorted results
            $matchSchedules = $query->orderBy('match_date', 'asc')
                ->orderBy('time', 'asc')
                ->get();

            // Group matches by date
            $groupedMatches = $matchSchedules->groupBy(function ($match) {
                return \Carbon\Carbon::parse($match->match_date)->format('Y-m-d');
            });

            // Format the response for each match schedule
            $formattedData = [];
            foreach ($groupedMatches as $date => $matches) {
                $matchesForDate = $matches->map(function ($match) {
                    return [
                        'id' => $match->id,
                        'time' => $match->time,
                        'sport' => $match->eventSport->name,
                        'sportImage' => $match->eventSport->sportsCategory ? $match->eventSport->sportsCategory->image : null,
                        'club1' => [
                            'id' => $match->homeClub->id,
                            'name' => $match->homeClub->clubName,
                            'image' => $match->homeClub->clubImage ?? null,
                        ],
                        'club2' => [
                            'id' => $match->awayClub->id,
                            'name' => $match->awayClub->clubName,
                            'image' => $match->awayClub->clubImage ?? null,
                        ],
                        'place' => $match->eventSport->place,
                        'event_sport_id' => $match->eventSport->id,
                        'event_start_date' => $match->eventSport->start_date,
                        'event_end_date' => $match->eventSport->end_date,
                        'home_club_id' => $match->homeClub->id,
                        'away_club_id' => $match->awayClub->id,
                    ];
                });

                $formattedData[] = [
                    'date' => \Carbon\Carbon::parse($date)->format('F d, Y'),
                    'matches' => $matchesForDate
                ];
            }

            // Calculate pagination
            $total = count($formattedData);
            $lastPage = ceil($total / $perPage);
            $offset = ($page - 1) * $perPage;

            // Slice the data according to pagination
            $paginatedData = array_slice($formattedData, $offset, $perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'matches' => $paginatedData,
                    'pagination' => [
                        'current_page' => (int)$page,
                        'last_page' => $lastPage,
                        'per_page' => (int)$perPage,
                        'total' => $total
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching match schedules by event ID: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching match schedules by event ID: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function generateMatchSchedulePDF($eventId)
    {
        try {
            // Get match schedules with relationships
            $query = MatchSchedule::whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with([
                'homeClub:id,clubName,clubImage',
                'awayClub:id,clubName,clubImage',
                'eventSport:id,name,start_date,end_date,place,sports_id',
            ]);

            // Get sorted results
            $matchSchedules = $query->orderBy('match_date', 'asc')
                ->orderBy('time', 'asc')
                ->get();

            // Get event details
            $event = Events::find($eventId);

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found.',
                ], 404);
            }

            // Group matches by date
            $groupedMatches = $matchSchedules->groupBy(function ($match) {
                return \Carbon\Carbon::parse($match->match_date)->format('Y-m-d');
            });

            // Format data for PDF
            $formattedData = [];
            foreach ($groupedMatches as $date => $matches) {
                $matchesForDate = $matches->map(function ($match) {
                    return [
                        'time' => $match->time,
                        'sport' => $match->eventSport->name,
                        'sportImage' => $match->eventSport->sportsCategory ? $match->eventSport->sportsCategory->image : null,
                        'homeClub' => [
                            'name' => $match->homeClub->clubName,
                            'image' => $match->homeClub->clubImage ?? null,
                        ],
                        'awayClub' => [
                            'name' => $match->awayClub->clubName,
                            'image' => $match->awayClub->clubImage ?? null,
                        ],
                        'place' => $match->eventSport->place,
                    ];
                });

                $formattedData[] = [
                    'date' => \Carbon\Carbon::parse($date)->format('F d, Y'),
                    'matches' => $matchesForDate
                ];
            }

            $viewData = [
                'eventName' => $event->name,
                'matchDays' => $formattedData
            ];

            // Generate PDF
            $pdf = PDF::loadView('match_schedules', ['data' => $viewData]);

            // Generate filename
            $filename = 'match_schedules_' . preg_replace('/[^A-Za-z0-9\-]/', '_', $event->name) . '.pdf';

            // Return PDF for download
            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('Error generating match schedules PDF: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getMatchSchedules($eventId)
    {
        try {
            // Base query
            $query = MatchSchedule::whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with([
                'homeClub:id,clubName,clubImage',
                'awayClub:id,clubName,clubImage',
                'eventSport:id,name,start_date,end_date,place,sports_id',
            ]);

            // Get sorted results
            $matchSchedules = $query->orderBy('match_date', 'asc')
                ->orderBy('time', 'asc')
                ->get();

            // Group matches by date
            $groupedMatches = $matchSchedules->groupBy(function ($match) {
                return \Carbon\Carbon::parse($match->match_date)->format('Y-m-d');
            });

            // Initialize arrays for formatted data and unique sports
            $formattedData = [];
            $uniqueSports = collect();

            // Format the response for each match schedule
            foreach ($groupedMatches as $date => $matches) {
                $matchesForDate = $matches->map(function ($match) use (&$uniqueSports) {
                    // Add sport to unique sports collection
                    $uniqueSports->push([
                        'id' => $match->eventSport->id,
                        'name' => $match->eventSport->name,
                    ]);

                    return [
                        'id' => $match->id,
                        'time' => $match->time,
                        'sport' => $match->eventSport->name,
                        'sportImage' => $match->eventSport->sportsCategory ? $match->eventSport->sportsCategory->image : null,
                        'club1' => [
                            'id' => $match->homeClub->id,
                            'name' => $match->homeClub->clubName,
                            'image' => $match->homeClub->clubImage ?? null,
                        ],
                        'club2' => [
                            'id' => $match->awayClub->id,
                            'name' => $match->awayClub->clubName,
                            'image' => $match->awayClub->clubImage ?? null,
                        ],
                        'place' => $match->eventSport->place,
                        'event_sport_id' => $match->eventSport->id,
                        'event_start_date' => $match->eventSport->start_date,
                        'event_end_date' => $match->eventSport->end_date,
                        'home_club_id' => $match->homeClub->id,
                        'away_club_id' => $match->awayClub->id,
                    ];
                });

                $formattedData[] = [
                    'date' => \Carbon\Carbon::parse($date)->format('F d, Y'),
                    'matches' => $matchesForDate
                ];
            }

            // Remove duplicate sports based on 'id' and format unique sports
            $uniqueSports = $uniqueSports->unique('id')->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'matches' => $formattedData,
                    'uniqueSports' => $uniqueSports,
                ]
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
