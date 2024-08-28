<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;
use App\Models\Club_Manager;
use App\Models\Club_Sports;
use App\Models\Sports_Categories;
use App\Models\Sports_Arena;
use App\Models\Gs_Division;
use App\Models\Member;
use Exception;
use Cloudinary\Cloudinary;


class ClubController extends Controller
{
    protected $cloudinary;

    public function __construct(Cloudinary $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }


    //POST => http://127.0.0.1:8000/api/clubs/create
    public function clubCreate(Request $request)
    {
        // Validate the request data
        $request->validate([
            'clubName' => 'required|string|max:255',
            'clubDivisionName' => 'required|string|max:255',
            'clubAddress' => 'required|string|max:255',
            'club_history' => 'nullable|string',
            'clubContactNo' => 'required|string|max:15',
            'clubImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
        ]);

        try {
            // Find the gs_id based on the divisionName
            $gsDivision = Gs_Division::where('divisionName', $request->clubDivisionName)->first();

            if (!$gsDivision) {
                return response()->json(['error' => 'Invalid division name'], 404);
            }

            $clubImageUrl = null;
            if ($request->hasFile('clubImage')) {
                $result = $this->cloudinary->uploadApi()->upload($request->file('clubImage')->getRealPath());
                $clubImageUrl = $result['secure_url'];
            }

            // Create a new club
            $club = Club::create([
                'clubName' => $request->clubName,
                'gs_id' => $gsDivision->id,
                'clubAddress' => $request->clubAddress,
                'club_history' => $request->club_history,
                'clubContactNo' => $request->clubContactNo,
                'clubImage' => $clubImageUrl,
            ]);

            return response()->json(['message' => 'Club created successfully', 'club' => $club], 201);
        } catch (Exception $e) {
            // Handle any errors that may occur
            return response()->json(['error' => 'Failed to create club', 'details' => $e->getMessage()], 500);
        }
    }

    // DELETE => http://127.0.0.1:8000/api/clubs/{id}
    public function clubDelete($id)
    {
        try {
            // Find the club by its ID
            $club = Club::find($id);

            if (!$club) {
                return response()->json(['error' => 'Club not found'], 404);
            }

            // Store the club name for the response
            $clubName = $club->clubName;

            // Delete the club
            $club->delete();

            return response()->json(['message' => "Club $clubName deleted successfully"], 200);
        } catch (Exception $e) {
            // Handle any errors that may occur
            return response()->json(['error' => 'Failed to delete club', 'details' => $e->getMessage()], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/clubs/list
    public function getAllClubs()
    {
        try {
            // Fetch all club details
            $clubs = Club::all();

            return response()->json($clubs);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch club details.', 'message' => $e->getMessage()], 500);
        }
    }

    // PUT => http://127.0.0.1:8000/api/clubs/{id}
    public function clubUpdate(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'clubName' => 'sometimes|string|max:255',
            'clubDivisionName' => 'sometimes|string|max:255',
            'clubAddress' => 'sometimes|string|max:255',
            'club_history' => 'nullable|string',
            'clubContactNo' => 'sometimes|string|max:15',
            'clubImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
        ]);

        try {
            // Find the club by ID
            $club = Club::findOrFail($id);

            if ($request->has('clubName')) {

                $club->clubName = $request->clubName;
            }

            if ($request->has('clubDivisionName')) {
                // Find the gs_id based on the divisionName
                $gsDivision = Gs_Division::where('divisionName', $request->clubDivisionName)->first();

                if (!$gsDivision) {
                    return response()->json(['error' => 'Invalid division name'], 404);
                }

                $club->gs_id = $gsDivision->id;
            }
            // Handle the image upload if a new image is provided
            if ($request->hasFile('clubImage')) {

                if ($club->image) {
                    // Optionally delete the old image from Cloudinary
                    $this->cloudinary->uploadApi()->destroy($club->image);
                }

                $result = $this->cloudinary->uploadApi()->upload($request->file('clubImage')->getRealPath());
                $club->clubImage = $result['secure_url'];
            }

            if ($request->has('clubAddress')) {

                $club->clubAddress = $request->clubAddress;
            }

            if ($request->has('club_history')) {
                $club->club_history = $request->club_history;
            }

            if ($request->has('clubContactNo')) {
                $club->clubContactNo = $request->clubContactNo;
            }

            // Update the club with the new data
            $club->save();

            return response()->json(['message' => 'Club updated successfully', 'club' => $club], 200);
        } catch (Exception $e) {
            // Handle any errors that may occur
            return response()->json(['error' => 'Failed to update club', 'details' => $e->getMessage()], 500);
        }
    }


    //GET => http://127.0.0.1:8000/api/clubs-sports/get
    public function getAllClubSports()
    {
        try {
            $clubSports = Club_Sports::with(['club', 'sportsCategory'])->get();

            // Transform the data to include the related names
            $response = $clubSports->map(function ($item) {
                return [
                    'id' => $item->id,
                    'club_id' => $item->club_id,
                    'clubName' => $item->club->clubName,
                    'sports_id' => $item->sports_id,
                    'sportsName' => $item->sportsCategory->name,
                    'sports_arena_id' => $item->sports_arena_id,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            return response()->json($response);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch club sports.', 'message' => $e->getMessage()], 500);
        }
    }

    //POST => http://127.0.0.1:8000/api/clubs-sports/create
    public function createClubSports(Request $request)
    {
        try {
            $request->validate([
                'clubName' => 'required|string|max:255',
                'sportsName' => 'required|string|max:255',
                'sportsArenaName' => 'required|string|max:255',
            ]);

            // Find IDs based on provided names
            $club = Club::where('clubName', $request->input('clubName'))->firstOrFail();
            $sportsCategory = Sports_Categories::where('name', $request->input('sportsName'))->firstOrFail();
            $sportsArena = Sports_Arena::where('name', $request->input('sportsArenaName'))->firstOrFail();

            // Create a new club sports entry
            $clubSports = Club_Sports::create([
                'club_id' => $club->id,
                'sports_id' => $sportsCategory->id,
                'sports_arena_id' => $sportsArena->id,
            ]);

            return response()->json($clubSports, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create club sports entry.', 'message' => $e->getMessage()], 500);
        }
    }


    public function getAClubSports(Request $request)
    {
        try {
            // Validate the clubName parameter
            $request->validate([
                'clubName' => 'required|string|max:255|exists:clubs,clubName',
            ]);

            $clubName = $request->input('clubName');

            // Find the club_id based on the provided clubName
            $club = Club::where('clubName', $clubName)->firstOrFail();
            $clubId = $club->id;

            // Fetch club sports for the given club_id with related club and sports category
            $clubSports = Club_Sports::where('club_id', $clubId)
                ->with(['club', 'sportsCategory'])
                ->get();

            // Transform the data to include the related names
            $response = $clubSports->map(function ($item) {
                return [
                    'id' => $item->id,
                    'club_id' => $item->club_id,
                    'clubName' => $item->club->clubName,
                    'sports_id' => $item->sports_id,
                    'sportsName' => $item->sportsCategory->name,
                    'sports_arena_id' => $item->sports_arena_id,
                    'created_at' => $item->created_at,
                ];
            });

            return response()->json($response);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch club sports.', 'message' => $e->getMessage()], 500);
        }
    }

    public function getClubsByUserId(Request $request)
    {
        try {
            // Get the userId from the request
            $userId = $request->input('userId');
            if (!$userId) {
                return response()->json([
                    'error' => 'userId is required.',
                ], 400);
            }

            // Fetch the club ID associated with the userId from club_managers
            $clubId = Club_Manager::where('user_id', $userId)->value('club_id');

            // If no club found in club_managers, fetch the club ID from members
            if (!$clubId) {
                $clubId = Member::where('user_id', $userId)->value('club_id');
            }

            // If still no club ID found, return empty response
            if (!$clubId) {
                return response()->json([
                    'error' => 'No club found for the given userId.',
                ], 404);
            }

            // Fetch the club details using the club ID
            $club = Club::find($clubId);

            // If the club is not found, return an error response
            if (!$club) {
                return response()->json([
                    'error' => 'Club not found.',
                ], 404);
            }

            $clubDivision = Gs_Division::where('id', $club->gs_id)->first();

            // Fetch the club sports details
            $clubSports = Club_Sports::where('club_id', $clubId)
                ->with(['club', 'sportsCategory', 'sportsArena'])
                ->get();

            // Transform the data to include the related names
            $sportsDetails = $clubSports->map(function ($item) {
                return [
                    'id' => $item->id,
                    'club_id' => $item->club_id,
                    'sports_id' => $item->sports_id,
                    'sportsName' => $item->sportsCategory->name,
                    'sports_arena_id' => $item->sports_arena_id,
                    'sports_arena_name' => $item->sportsArena->name,
                    'sports_arena_location' => $item->sportsArena->location,
                    'sports_arena_address' => $item->sportsArena->address,
                    'sports_arena_image' => $item->sportsArena->image,
                ];
            });

            // Return the club and sports details
            return response()->json([
                'club' => [
                    'id' => $club->id,
                    'clubAddress' => $club->clubAddress,
                    'clubContactNo' => $club->clubContactNo,
                    'clubImage' => $club->clubImage,
                    'clubName' => $club->clubName,
                    'club_history' => $club->club_history,
                    'created_at' => $club->created_at,
                    'gs_id' => $club->gs_id,
                    'isVerified' => $club->isVerified,
                    'clubDivisionName' => $clubDivision->divisionName,
                ],
                'sports' => $sportsDetails,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch club details.', 'message' => $e->getMessage()], 500);
        }
    }
}
