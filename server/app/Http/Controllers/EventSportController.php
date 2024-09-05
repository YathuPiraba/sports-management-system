<?php

namespace App\Http\Controllers;

use App\Models\EventSports;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventSportController extends Controller
{
    /**
     * Add a new sport to an event.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $eventId)
    {
        $request->validate([
            'sports_id' => 'required|exists:sports,id',
            'name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'place' => 'required|string|max:255',
        ]);

        $eventSport = EventSports::create([
            'event_id' => $eventId,
            'sports_id' => $request->sports_id,
            'name' => $request->name,
            'event_date' => $request->event_date,
            'place' => $request->place,
        ]);

        return response()->json($eventSport, Response::HTTP_CREATED);
    }

    /**
     * Get all sports for a specific event.
     *
     * @param int $eventId
     * @return \Illuminate\Http\Response
     */
    public function index($eventId)
    {
        $eventSports = EventSports::where('event_id', $eventId)->get();
        return response()->json($eventSports);
    }

    /**
     * Get a specific sport for a specific event.
     *
     * @param int $eventId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($eventId, $id)
    {
        $eventSport = EventSports::where('event_id', $eventId)->findOrFail($id);
        return response()->json($eventSport);
    }

    /**
     * Update a specific sport in an event.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $eventId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $eventId, $id)
    {
        $request->validate([
            'sports_id' => 'sometimes|required|exists:sports,id',
            'name' => 'sometimes|required|string|max:255',
            'event_date' => 'sometimes|required|date',
            'place' => 'sometimes|required|string|max:255',
        ]);

        $eventSport = EventSports::where('event_id', $eventId)->findOrFail($id);
        $eventSport->update($request->all());

        return response()->json($eventSport);
    }

    /**
     * Delete a specific sport from an event.
     *
     * @param int $eventId
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($eventId, $id)
    {
        $eventSport = EventSports::where('event_id', $eventId)->findOrFail($id);
        $eventSport->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
