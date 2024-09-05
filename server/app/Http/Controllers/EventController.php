<?php

namespace App\Http\Controllers;

use App\Models\Events;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventController extends Controller
{
    /**
     * Create a new event.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $event = Events::create([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json($event, Response::HTTP_CREATED);
    }

    /**
     * Get all events.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $events = Events::all();
        return response()->json($events);
    }

    /**
     * Get a specific event.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $event = Events::findOrFail($id);
        return response()->json($event);
    }

    /**
     * Update a specific event.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
        ]);

        $event = Events::findOrFail($id);
        $event->update($request->all());

        return response()->json($event);
    }

    /**
     * Delete a specific event.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $event = Events::findOrFail($id);
        $event->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
