<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;
use App\Models\Gs_Division;
use Illuminate\Support\Facades\DB;
use Exception;
use Cloudinary\Cloudinary;


class ClubController extends Controller
{
    protected $cloudinary;

    public function __construct(Cloudinary $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    public function uploadImage(Request $request)
    {
        $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());

        // $result now contains the details of the uploaded image
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
        ]);

        try {
            // Find the gs_id based on the divisionName
            $gsDivision = Gs_Division::where('divisionName', $request->clubDivisionName)->first();

            if (!$gsDivision) {
                return response()->json(['error' => 'Invalid division name'], 404);
            }

            // Create a new club
            $club = Club::create([
                'clubName' => $request->clubName,
                'gs_id' => $gsDivision->id,
                'clubAddress' => $request->clubAddress,
                'club_history' => $request->club_history,
                'clubContactNo' => $request->clubContactNo,
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
}
