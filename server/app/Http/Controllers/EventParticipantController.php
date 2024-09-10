<?php

namespace App\Http\Controllers;

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
}
