<?php

namespace App\Http\Controllers;

use App\Models\Event_Participants;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
            'participatedDate' => 'required|date',
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
}
