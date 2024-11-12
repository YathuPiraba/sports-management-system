<?php

namespace App\Http\Controllers;

use App\Models\EventClub;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventClubController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $clubId, $eventSportsId)
    {
        // Validate the rank field
        $request->validate([
            'rank' => 'required|string|max:50',
        ]);

        // Find the EventClub record by club_id and event_sports_id
        $eventClub = EventClub::where('club_id', $clubId)
            ->where('event_sports_id', $eventSportsId)
            ->first();

        // Check if the record exists
        if (!$eventClub) {
            return response()->json([
                'success' => false,
                'message' => 'Event club not found for the given club and event'
            ], Response::HTTP_NOT_FOUND);
        }

        // Update the rank
        $eventClub->rank = $request->rank;
        $eventClub->save();

        return response()->json([
            'success' => true,
            'data' => $eventClub,
            'message' => 'Rank updated successfully'
        ], Response::HTTP_OK);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
