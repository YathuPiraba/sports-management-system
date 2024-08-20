<?php

namespace App\Http\Controllers;

use App\Models\Skills;
use Illuminate\Http\Request;
use App\Models\Sports_Categories;
use Cloudinary\Cloudinary;
use Exception;

class SportsController extends Controller
{
    protected $cloudinary;

    public function __construct(Cloudinary $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    //GET => http://127.0.0.1:8000/api/sports/list
    public function getSports()
    {
        try {
            // Fetch all sports categories
            $sportsCategories = Sports_Categories::all();
            return response()->json($sportsCategories);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch sports categories.'], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/sports/create
    public function createSports(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $imageUrl = null;

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
                $imageUrl = $result['secure_url'];
            }

            // Create a new sports category
            $sportsCategory = Sports_Categories::create([
                'name' => $request->input('name'),
                'type' => $request->input('type'),
                'description' => $request->input('description'),
                'image' => $imageUrl,
            ]);

            return response()->json($sportsCategory, 201);
        } catch (Exception $e) {
            // Handle any errors that occur
            return response()->json(['error' => 'Failed to create sports category.', 'message' => $e->getMessage()], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/skills/by-sport
    public function getSkillsBySport(Request $request)
    {
        try {
            // Validate the sportsName parameter
            $request->validate([
                'sportsName' => 'required|string|max:255',
            ]);

            // Find the sports category by name
            $sportsCategory = Sports_Categories::where('name', $request->input('sportsName'))->firstOrFail();

            // Fetch skills related to the sports category
            $skills = Skills::where('sports_id', $sportsCategory->id)->get();

            // Transform the data to include the sports name
            $response = $skills->map(function ($item) use ($sportsCategory) {
                return [
                    'skill' => $item->skill,
                ];
            });

            return response()->json($response);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch skills.', 'message' => $e->getMessage()], 500);
        }
    }
}
