<?php

namespace App\Http\Controllers;

use App\Events\EventApplied;
use App\Models\Club_Manager;
use App\Models\Event_Participants;
use App\Models\EventClub;
use App\Models\EventSports;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventParticipantController extends Controller
{
    /**
     * Add a new participant to an event.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventClubId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $eventClubId)
    {
        $request->validate([
            'member_sports_id' => 'required|exists:member_sports,id',
            'participatedDate' => 'nullable|date',
            'rank' => 'nullable|string|max:255',
        ]);

        $eventParticipant = Event_Participants::create([
            'event_clubs_id' => $eventClubId,
            'member_sports_id' => $request->member_sports_id,
            'participatedDate' => $request->participatedDate,
            'rank' => $request->rank,
        ]);

        return response()->json($eventParticipant, Response::HTTP_CREATED);
    }

    /**
     * Get all participants for a specific event club.
     *
     * @param int $eventClubId
     * @return \Illuminate\Http\Response
     */
    public function index($eventClubId)
    {
        $participants = Event_Participants::where('event_clubs_id', $eventClubId)->get();
        return response()->json($participants);
    }

    /**
     * Get a specific participant.
     *
     * @param int $eventClubId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($eventClubId, $id)
    {
        $participant = Event_Participants::where('event_clubs_id', $eventClubId)->findOrFail($id);
        return response()->json($participant);
    }

    /**
     * Update a specific participant.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventClubId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $eventClubId, $id)
    {
        $request->validate([
            'member_sports_id' => 'sometimes|required|exists:member_sports,id',
            'participatedDate' => 'sometimes|required|date',
            'rank' => 'nullable|string|max:255',
        ]);

        $participant = Event_Participants::where('event_clubs_id', $eventClubId)->findOrFail($id);
        $participant->update($request->all());

        return response()->json($participant);
    }

    /**
     * Delete a specific participant.
     *
     * @param int $eventClubId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($eventClubId, $id)
    {
        $participant = Event_Participants::where('event_clubs_id', $eventClubId)->findOrFail($id);
        $participant->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    //POST => http://127.0.0.1:8000/api/addEventParticipants
    public function addEventParticipants(Request $request)
    {
        $request->validate([
            'club_id' => 'required|integer|exists:clubs,id',
            'event_sports_id' => 'required|integer|exists:event_sports,id',
            'participants' => 'required|array',
            'participants.*.member_sports_id' => 'required|integer|exists:member_sports,id',
        ]);

        try {
            // Begin a transaction
            DB::beginTransaction();

            // Create a new event_club record
            $eventClub = EventClub::create([
                'club_id' => $request->club_id,
                'event_sports_id' => $request->event_sports_id,
            ]);

            // Create event_participants records
            foreach ($request->participants as $participant) {
                Event_Participants::create([
                    'event_clubs_id' => $eventClub->id,
                    'member_sports_id' => $participant['member_sports_id'],
                ]);
            }

            $notification = Notification::create([
                'event_sports_id' => $request->event_sports_id,
                'club_id' => $request->club_id,
                'is_read' => false,
            ]);

            // Dispatch the event for real-time notification
            event(new EventApplied($notification));

            // Commit the transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Participants added successfully.',
            ], 201);
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            Log::error('Error adding event participants: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error adding participants: ' . $e->getMessage(),
            ], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/getEventParticipants/{eventId}
    public function getEventParticipants($eventId)
    {
        try {
            // Fetch data from multiple tables with relationships based on eventId
            $eventSports = EventSports::where('event_id', $eventId)
                ->with([
                    'eventClubs.club:id,clubName',
                    'eventClubs.participants.memberSport:id,sports_id,member_id',
                    'eventClubs.participants.memberSport.member:id,firstName,lastName,position',
                    'eventClubs.participants.memberSport.sport:id,name,image',
                    'sportsCategory:id,name,image',
                ])->get();

            // Transform the data to a simplified structure
            $flattenedData = $eventSports->map(function ($eventSport) {
                return [
                    'event_sports' => [
                        'id' => $eventSport->id,
                        'name' => $eventSport->name,
                        'start_date' => $eventSport->start_date,
                        'end_date' => $eventSport->end_date,
                        'place' => $eventSport->place,
                        'sports' => $eventSport->sportsCategory ? [
                            'sports_id' => $eventSport->sportsCategory->id,
                            'name' => $eventSport->sportsCategory->name,
                            'image' => $eventSport->sportsCategory->image,
                        ] : null,
                        'clubs' => $eventSport->eventClubs->map(function ($eventClub) {
                            return [
                                'club_id' => $eventClub->club_id,
                                'clubName' => $eventClub->club->clubName ?? null,
                                'event_clubs_id' => $eventClub->id,
                                'participants' => $eventClub->participants->map(function ($participant) {
                                    return [
                                        'member' => $participant->memberSport->member ? [
                                            'id' => $participant->memberSport->member->id,
                                            'firstName' => $participant->memberSport->member->firstName,
                                            'lastName' => $participant->memberSport->member->lastName,
                                            'position' => $participant->memberSport->member->position,
                                        ] : null,
                                    ];
                                }),
                            ];
                        }),
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $flattenedData,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching event participants: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching event participants: ' . $e->getMessage(),
            ], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/getSpecificEventParticipants
    public function getSpecificEventParticipants(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'user_id' => 'required|integer',
                'event_id' => 'required|integer',
            ]);

            $userId = $request->input('user_id');
            $eventId = $request->input('event_id');

            // Find the club associated with the user
            $clubManager = Club_Manager::where('user_id', $userId)->first();

            if (!$clubManager) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club manager not found.',
                ], 404);
            }

            $clubId = $clubManager->club_id;

            // Fetch all event sports data with participants based on event_id and club_id
            $eventSports = EventSports::with([
                'eventClubs.club:id,clubName', // Fetch club details
                'eventClubs.participants.memberSport:id,sports_id,member_id', // Fetch member sport details
                'eventClubs.participants.memberSport.member:id,firstName,lastName,position', // Fetch member details
                'eventClubs.participants.memberSport.sport:id,name,image', // Fetch sport details
            ])
                ->where('event_id', $eventId)
                ->whereHas('eventClubs', function ($query) use ($clubId) {
                    $query->where('club_id', $clubId);
                })
                ->get();

            if ($eventSports->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No event sports data found.',
                ], 200);
            }

            // Transform the data to the desired structure
            $flattenedData = $eventSports->map(function ($eventSport) {
                return [
                    'event_sports' => [
                        'id' => $eventSport->id,
                        'name' => $eventSport->name,
                        'start_date' => $eventSport->start_date,
                        'end_date' => $eventSport->end_date,
                        'place' => $eventSport->place,
                        'sports' => [
                            'sports_id' => $eventSport->sportsCategory->id, // Assuming sportsCategory represents the sport
                            'name' => $eventSport->sportsCategory->name,
                            'image' => $eventSport->sportsCategory->image, // Ensure this field exists in the sportsCategory model
                        ],
                        'club_id' => $eventSport->eventClubs->first()->club_id,
                        'event_club_id' => $eventSport->eventClubs->first()->id,
                        'participants' => $eventSport->eventClubs->flatMap(function ($eventClub) {
                            return $eventClub->participants->map(function ($participant) {
                                return [
                                    'member' => [
                                        'id' => $participant->memberSport->member->id,
                                        'firstName' => $participant->memberSport->member->firstName,
                                        'lastName' => $participant->memberSport->member->lastName,
                                        'position' => $participant->memberSport->member->position,
                                    ],
                                ];
                            });
                        }),
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $flattenedData,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching specific event participants: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching specific event participants: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getEventParticipantDetails($eventId)
    {
        try {
            // Fetch data from multiple tables with relationships based on eventId
            $eventSports = EventSports::where('event_id', $eventId) // Filter by eventId
                ->with([
                    'eventClubs.club:id,clubName', // Fetch clubs associated with the event sport
                    'eventClubs.participants.memberSport:id,sports_id,member_id', // Fetch member sport details
                    'eventClubs.participants.memberSport.member:id,firstName,lastName,position', // Fetch member details
                    'eventClubs.participants.memberSport.sport:id,name,image', // Fetch sport details
                ])->findOrFail($eventId);

            // Transform the data to a simplified structure
            $eventData = [
                'event_sports' => [
                    'id' => $eventSports->id,
                    'name' => $eventSports->name,
                    'start_date' => $eventSports->start_date,
                    'end_date' => $eventSports->end_date,
                    'place' => $eventSports->place,
                    'sports' => [
                        'sports_id' => $eventSports->sportsCategory->id,
                        'name' => $eventSports->sportsCategory->name,
                        'image' => $eventSports->sportsCategory->image,
                    ],
                    'clubs' => $eventSports->eventClubs->map(function ($eventClub) {
                        return [
                            'club_id' => $eventClub->club_id,
                            'clubName' => $eventClub->club->clubName,
                            'event_clubs_id' => $eventClub->id,
                            'participants' => $eventClub->participants->map(function ($participant) {
                                return [
                                    'member' => [
                                        'id' => $participant->memberSport->member->id,
                                        'firstName' => $participant->memberSport->member->firstName,
                                        'lastName' => $participant->memberSport->member->lastName,
                                        'position' => $participant->memberSport->member->position,
                                    ],
                                    'sport' => [
                                        'id' => $participant->memberSport->sport->id,
                                        'name' => $participant->memberSport->sport->name,
                                        'image' => $participant->memberSport->sport->image,
                                    ],
                                ];
                            }),
                        ];
                    }),
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $eventData,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching event details: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching event details: ' . $e->getMessage(),
            ], 500);
        }
    }
}
