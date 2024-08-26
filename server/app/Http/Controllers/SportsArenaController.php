<?php

namespace App\Http\Controllers;

use App\Models\Club_Sports;
use App\Models\Sports_Arena;
use Illuminate\Http\Request;

class SportsArenaController extends Controller
{
    public function createSportsArena(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'image' => 'nullable|string|max:255',
            'club_id' => 'required|exists:clubs,id',
            'sports_id' => 'required|exists:sports_categories,id',
        ]);

        try {
            // Create the sports arena
            $sportsArena = Sports_Arena::create($validatedData);

            // Create the entry in Club_Sports
            Club_Sports::create([
                'club_id' => $validatedData['club_id'],
                'sports_id' => $validatedData['sports_id'],
                'sports_arena_id' => $sportsArena->id,
            ]);

            return response()->json(['message' => 'Sports Arena created successfully', 'data' => $sportsArena], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create Sports Arena', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSportsArena($id)
    {
        try {
            $sportsArena = Sports_Arena::findOrFail($id);
            return response()->json(['data' => $sportsArena], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Sports Arena not found', 'message' => $e->getMessage()], 404);
        }
    }

    public function updateSportsArena(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        try {
            $sportsArena = Sports_Arena::findOrFail($id);
            $sportsArena->update($validatedData);

            return response()->json(['message' => 'Sports Arena updated successfully', 'data' => $sportsArena], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update Sports Arena', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSportsArenas()
    {
        try {
            // Retrieve all sports arenas
            $sportsArenas = Sports_Arena::all();

            return response()->json(['data' => $sportsArenas], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sports arenas', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSportsArenasByClub($clubId)
    {
        try {
            // Fetch all sports arenas associated with the given club ID
            $clubSports = Club_Sports::where('club_id', $clubId)
                ->with(['sportsArena'])
                ->get();

            if ($clubSports->isEmpty()) {
                return response()->json(['message' => 'No sports arenas found for this club'], 404);
            }

            // Transform the data to include the related sports arena details
            $response = $clubSports->map(function ($item) {
                return [
                    'club_sports_id' => $item->id,
                    'sports_arena_id' => $item->sportsArena->id,
                    'sports_arena_name' => $item->sportsArena->name,
                    'sports_arena_location' => $item->sportsArena->location,
                    'sports_arena_address' => $item->sportsArena->address,
                    'sports_arena_image' => $item->sportsArena->image,
                    'sports_id' => $item->sports_id,
                ];
            });

            return response()->json(['data' => $response], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sports arenas', 'message' => $e->getMessage()], 500);
        }
    }
}
