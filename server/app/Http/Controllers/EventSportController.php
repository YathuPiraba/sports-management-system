<?php

namespace App\Http\Controllers;

use App\Models\Events;
use App\Models\EventSports;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

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
        // Fetch the event to get its start_date and end_date
        $event = Events::findOrFail($eventId);

        // Validate the request input
        $request->validate([
            'sports_id' => 'required|exists:sports_categories,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date|after_or_equal:' . $event->start_date,
            'end_date' => 'required|date|before_or_equal:' . $event->end_date,
            'apply_due_date' => 'required|date|before:' . $request->start_date,
            'place' => 'required|string|max:255',
        ]);

        // Create the event sport
        $eventSport = EventSports::create([
            'event_id' => $eventId,
            'sports_id' => $request->sports_id,
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'apply_due_date' => $request->apply_due_date,
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

     public function getEventSportsWithClubs($eventId)
     {
         try {
             // Fetch event sports with associated clubs for the given event ID, eager loading clubs
             $eventSports = EventSports::where('event_id', $eventId)
                 ->with([
                     'eventClubs.club:id,clubName,clubImage',
                     'sportsCategory:id,name,image',
                 ])
                 ->get()
                 ->filter(function ($eventSport) {
                     // Filter out event sports without associated event clubs
                     return $eventSport->eventClubs->isNotEmpty();
                 });

             // Check if any filtered event sports data exists
             if ($eventSports->isEmpty()) {
                 return response()->json([
                     'success' => true,
                     'data' => [],
                     'message' => 'No event sports with clubs found.',
                 ], 200);
             }

             // Transform the filtered data to a simplified structure
             $data = $eventSports->map(function ($eventSport) {
                 return [
                     'event_sport_id' => $eventSport->id,
                     'name' => $eventSport->name,
                     'start_date' => $eventSport->start_date,
                     'end_date' => $eventSport->end_date,
                     'place' => $eventSport->place,
                     'sports' => $eventSport->sportsCategory ? [
                         'id' => $eventSport->sportsCategory->id,
                         'name' => $eventSport->sportsCategory->name,
                         'image' => $eventSport->sportsCategory->image,
                     ] : null,
                     'clubs' => $eventSport->eventClubs->map(function ($eventClub) {
                         return [
                             'club_id' => $eventClub->club_id,
                             'clubName' => $eventClub->club->clubName ?? null,
                             'clubImage' => $eventClub->club->clubImage ?? null,
                             'event_clubs_id' => $eventClub->id,
                         ];
                     }),
                 ];
             });

             return response()->json([
                 'success' => true,
                 'data' => $data,
             ], 200);
         } catch (\Exception $e) {
             Log::error('Error fetching event sports with clubs: ' . $e->getMessage());

             return response()->json([
                 'success' => false,
                 'message' => 'Error fetching event sports with clubs: ' . $e->getMessage(),
             ], 500);
         }
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
        // Fetch the event to get its start_date and end_date
        $event = Events::findOrFail($eventId);

        $request->validate([
            'sports_id' => 'sometimes|required|exists:sports_categories,id',
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|date|after_or_equal:' . $event->start_date,
            'end_date' => 'sometimes|date|before_or_equal:' . $event->end_date,
            'apply_due_date' => 'sometimes|date|before:' . $request->start_date,
            'place' => 'sometimes|string|max:255',
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
