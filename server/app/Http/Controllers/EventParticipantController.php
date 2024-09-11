<?php

namespace App\Http\Controllers;

use App\Models\Club_Manager;
use App\Models\Event_Participants;
use App\Models\EventClub;
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

    //GET => http://127.0.0.1:8000/api/getEventParticipants
    public function getEventParticipants()
    {
        try {
            // Fetch data from multiple tables with relationships
            $eventClubs = EventClub::with([
                'club:id,clubName', // Fetch club details
                'eventSport:id,sports_id,event_id,name,place,start_date,end_date,apply_due_date', // Fetch event sport details
                'eventSport.sportsCategory:id,name', // Fetch sports category details
                'participants.memberSport:id,sports_id,member_id', // Fetch member sport details
                'participants.memberSport.member:id,firstName,lastName,position', // Fetch member details
                'participants.memberSport.sport:id,name,image',
            ])->get();

            // Transform the data to a simplified structure
            $flattenedData = $eventClubs->map(function ($eventClub) {
                return [
                    'club_id' => $eventClub->club_id,
                    'clubName' => $eventClub->club->clubName,
                    'event_clubs_id' => $eventClub->id,
                    'sports_id' => $eventClub->eventSport->sports_id,
                    'event_id' => $eventClub->eventSport->event_id,
                    'event_sports' => [
                        'id' => $eventClub->eventSport->id,
                        'name' => $eventClub->eventSport->name,
                        'start_date' => $eventClub->eventSport->start_date,
                        'end_date' => $eventClub->eventSport->end_date,
                        'place' => $eventClub->eventSport->place,
                    ],
                    'participants' => $eventClub->participants->map(function ($participant) {
                        return [
                            'member' => [
                                'id' => $participant->memberSport->member->id,
                                'firstName' => $participant->memberSport->member->firstName,
                                'lastName' => $participant->memberSport->member->lastName,
                                'position' => $participant->memberSport->member->position,
                            ],
                            'sport' => [
                                'sports_id' => $participant->memberSport->sports_id,
                                'name' => $participant->memberSport->sport->name,
                                'image' => $participant->memberSport->sport->image,
                            ],

                        ];
                    }),
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

            // Fetch data from multiple tables with relationships based on club_id and event_id
            $eventClubs = EventClub::with([
                'club:id,clubName', // Fetch club details
                'eventSport:id,sports_id,event_id,name,place,start_date,end_date,apply_due_date', // Fetch event sport details
                'eventSport.sportsCategory:id,name', // Fetch sports category details
                'participants.memberSport:id,sports_id,member_id', // Fetch member sport details
                'participants.memberSport.member:id,firstName,lastName,position', // Fetch member details
                'participants.memberSport.sport:id,name,image',
            ])
                ->where('club_id', $clubId)
                ->whereHas('eventSport', function ($query) use ($eventId) {
                    $query->where('event_id', $eventId);
                })
                ->get();

            // Transform the data to a simplified structure
            $flattenedData = $eventClubs->map(function ($eventClub) {
                return [
                    'club_id' => $eventClub->club_id,
                    'clubName' => $eventClub->club->clubName,
                    'event_clubs_id' => $eventClub->id,
                    'sports_id' => $eventClub->eventSport->sports_id,
                    'event_id' => $eventClub->eventSport->event_id,
                    'event_sports' => [
                        'id' => $eventClub->eventSport->id,
                        'name' => $eventClub->eventSport->name,
                        'start_date' => $eventClub->eventSport->start_date,
                        'end_date' => $eventClub->eventSport->end_date,
                        'place' => $eventClub->eventSport->place,
                    ],
                    'participants' => $eventClub->participants->map(function ($participant) {
                        return [
                            'member' => [
                                'id' => $participant->memberSport->member->id,
                                'firstName' => $participant->memberSport->member->firstName,
                                'lastName' => $participant->memberSport->member->lastName,
                                'position' => $participant->memberSport->member->position,
                            ],
                            'sport' => [
                                'sports_id' => $participant->memberSport->sports_id,
                                'name' => $participant->memberSport->sport->name,
                                'image' => $participant->memberSport->sport->image,
                            ],
                        ];
                    }),
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
}
