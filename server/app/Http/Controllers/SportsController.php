<?php

namespace App\Http\Controllers;

use App\Models\Skills;
use Illuminate\Http\Request;
use App\Models\Sports_Categories;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Support\Facades\Log;

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
            // Validate the sportsId parameter
            $request->validate([
                'sportsId' => 'required|integer',
            ]);

            // Fetch skills related to the sports ID
            $skills = Skills::where('sports_id', $request->input('sportsId'))->get();

            // Transform the data to include only the skill names
            $response = $skills->map(function ($item) {
                return [
                    'skill' => $item->skill,
                    'skillId' => $item->id,
                ];
            });

            return response()->json($response);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch skills.', 'message' => $e->getMessage()], 500);
        }
    }

    //PUT/PATCH => http://127.0.0.1:8000/api/sports/{id}
    public function updateSports(Request $request, $id)
    {
        try {
            // Validate incoming data
            $request->validate([
                'name' => 'nullable|string|max:255',
                'type' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,jfif,webp,svg|max:2048',
            ]);

            Log::info('Incoming request data', $request->all());

            // Find the existing sports category
            $sportsCategory = Sports_Categories::findOrFail($id);

            // Update fields if provided
            if ($request->has('name')) {
                $sportsCategory->name = $request->input('name');
            }
            if ($request->has('type')) {
                $sportsCategory->type = $request->input('type');
            }
            if ($request->has('description')) {
                $sportsCategory->description = $request->input('description');
            }

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                // Optionally delete the old image from Cloudinary
                if ($sportsCategory->image) {
                    $this->cloudinary->uploadApi()->destroy($sportsCategory->image);
                }

                $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
                $sportsCategory->image = $result['secure_url'];
            }

            // Save the updated sports category
            $sportsCategory->save();

            return response()->json($sportsCategory, 200);
        } catch (Exception $e) {
            // Handle any errors that occur
            return response()->json(['error' => 'Failed to update sports category.', 'message' => $e->getMessage()], 500);
        }
    }
}
