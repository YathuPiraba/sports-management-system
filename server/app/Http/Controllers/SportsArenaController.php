<?php

namespace App\Http\Controllers;

use App\Models\Club_Sports;
use App\Models\Sports_Arena;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SportsArenaController extends Controller
{

    protected $cloudinary;

    public function __construct(Cloudinary $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }


    public function updateSportsArena(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg,webp,jfif|max:2048',
        ]);

        try {
            $sportsArena = Sports_Arena::findOrFail($id);

            // Handle image upload if provided
            if ($request->hasFile('image')) {

                if ($sportsArena->image) {
                    // Optionally delete the old image from Cloudinary
                    $this->cloudinary->uploadApi()->destroy($sportsArena->image);
                }

                $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
                $sportsArena->image = $result['secure_url'];
            }

            if ($request->has('name')) {
                $sportsArena->name = $request->name;
            }

            if ($request->has('location')) {
                $sportsArena->location = $request->location;
            }
            if ($request->has('address')) {
                $sportsArena->address = $request->address;
            }

            $sportsArena->save();

            return response()->json(['message' => 'Sports Arena updated successfully', 'data' => $sportsArena], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update Sports Arena', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSportsArenas()
    {
        try {
            // Retrieve all sports arenas with related club sports and club data
            $sportsArenas = Sports_Arena::with(['clubSports.club' => function ($query) {
                $query->select('id', 'clubName'); // Select only necessary fields from Club
            }])
            ->orderBy('name') // Sort by the 'name' of the arena
            ->get();

            if ($sportsArenas->isEmpty()) {
                return response()->json(['error' => 'Sports Arenas not found'], 404);
            }

            // Transform the data to include all club_ids and clubNames in a simpler format
            $sportsArenas = $sportsArenas->map(function ($arena) {
                $clubs = $arena->clubSports->map(function ($clubSport) {
                    return [
                        'club_id' => $clubSport->club_id,
                        'clubName' => $clubSport->club ? $clubSport->club->clubName : null,
                    ];
                });

                return [
                    'id' => $arena->id,
                    'name' => $arena->name,
                    'location' => $arena->location,
                    'address' => $arena->address,
                    'image' =>  $arena->image,
                    'clubs' => $clubs,
                ];
            });

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

    public function getSportsBySportsArena($clubId, $arenaId)
    {
        try {

            $clubSports = Club_Sports::where('club_id', $clubId)
                ->where('sports_arena_id', $arenaId)
                ->with('sportsCategory')
                ->get();


            if ($clubSports->isEmpty()) {
                return response()->json(['message' => 'No sports found for this sports arena'], 404);
            }


            $response = $clubSports->map(function ($item) {
                return [
                    'sports' => $item->sportsCategory,
                    'club_id' => $item->club_id,
                ];
            });

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sports', 'message' => $e->getMessage()], 500);
        }
    }


    public function deleteSportsArena($clubId, $arenaId)
    {
        try {
            // Validate that the sports arena exists
            $sportsArena = Sports_Arena::findOrFail($arenaId);

            // Fetch entries to be deleted
            $entriesToDelete = Club_Sports::where('club_id', $clubId)
                ->where('sports_arena_id', $sportsArena->id)
                ->get();

            if ($entriesToDelete->isEmpty()) {
                return response()->json(['message' => 'No Club Sports entries found for the given club and arena IDs'], 404);
            }


            // Delete associated club sports entries based on club_id and sports_arena_id
            $deletedRows = Club_Sports::where('club_id', $clubId)
                ->where('sports_arena_id', $sportsArena->id)
                ->delete();

            if ($deletedRows > 0) {
                return response()->json([
                    'message' => 'Club Sports entries deleted successfully',
                    'deleted_entries' => $entriesToDelete
                ], 200);
            } else {
                return response()->json(['message' => 'No Club Sports entries found for the given club and arena IDs'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete Club Sports', 'message' => $e->getMessage()], 500);
        }
    }
}
