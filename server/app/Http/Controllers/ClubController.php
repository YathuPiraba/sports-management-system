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
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // Import the DB facade
use Illuminate\Support\Facades\Log;

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
            // Fetch all club details and sort by clubName in ascending order
            $clubs = Club::where('isVerified', 1)
                ->whereHas('clubSports')
                ->orderBy('clubName', 'asc')
                ->get();

            return response()->json($clubs);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch club details.', 'message' => $e->getMessage()], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api//club-details
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
                    'sportsImage' => $item->sportsCategory->image,
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
                    'club_regNo' => $club->regNo,
                    'created_at' => $club->created_at,
                    'gs_id' => $club->gs_id,
                    'isVerified' => $club->isVerified,
                    'clubDivisionName' => $clubDivision->divisionName,
                ],
                'sports' => $sportsDetails,
                'gsDivision' => $clubDivision,
            ]);
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
            'regNo' => 'nullable|string|unique:clubs,regNo,' . $id, // Ensure unique regNo except for current club
        ]);

        try {
            // Find the club by ID
            $club = Club::findOrFail($id);

            // Update clubName if provided
            if ($request->has('clubName')) {
                $club->clubName = $request->clubName;
            }

            // Update clubDivisionName and set gs_id if provided
            if ($request->has('clubDivisionName')) {
                $gsDivision = Gs_Division::where('divisionName', $request->clubDivisionName)->first();

                if (!$gsDivision) {
                    return response()->json(['error' => 'Invalid division name'], 404);
                }

                $club->gs_id = $gsDivision->id;
            }

            // Handle the image upload if a new image is provided
            if ($request->hasFile('clubImage')) {
                if ($club->clubImage) {
                    // Optionally delete the old image from Cloudinary
                    $this->cloudinary->uploadApi()->destroy($club->clubImage);
                }

                $result = $this->cloudinary->uploadApi()->upload($request->file('clubImage')->getRealPath());
                $club->clubImage = $result['secure_url'];
            }

            // Update clubAddress if provided
            if ($request->has('clubAddress')) {
                $club->clubAddress = $request->clubAddress;
            }

            // Update club_history if provided
            if ($request->has('club_history')) {
                $club->club_history = $request->club_history;
            }

            // Update clubContactNo if provided
            if ($request->has('clubContactNo')) {
                $club->clubContactNo = $request->clubContactNo;
            }

            // Update regNo if provided
            if ($request->has('regNo')) {
                $club->regNo = $request->regNo;
            }

            // Save the updated club data
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
        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'clubName' => 'required|string|max:255',
            'sportsName' => 'required_without:newSport|string|max:255',
            'newSportName' => 'required_if:newSport,true|string|max:255',
            'sportType' => 'required_if:newSport,true|string|max:255|in:indoor,outdoor',
            'sportDescription' => 'required_if:newSport,true|string|max:500',
            'sportImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sportsArenaName' => 'required_without:newArena|string|max:255',
            'newArenaName' => 'required_if:newArena,true|string|max:255',
            'arenaLocation' => 'nullable|string|max:255',
            'arenaAddress' => 'nullable|string|max:255',
            'arenaImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction(); // Start a transaction

        try {
            // Find or create the club
            $club = Club::firstOrCreate(['clubName' => $request->input('clubName')]);

            // Handle sport
            if ($request->input('newSport') === 'true') {
                $sportsCategory = new Sports_Categories();
                $sportsCategory->name = $request->input('newSportName');
                $sportsCategory->type = $request->input('sportType');
                $sportsCategory->description = $request->input('sportDescription');

                // Handle sport image upload if exists
                if ($request->hasFile('sportImage')) {
                    if ($sportsCategory->image) {
                        $this->cloudinary->uploadApi()->destroy($sportsCategory->image);
                    }
                    $result = $this->cloudinary->uploadApi()->upload($request->file('sportImage')->getRealPath());
                    $sportsCategory->image = $result['secure_url'];
                }

                $sportsCategory->save();
            } else {
                $sportsCategory = Sports_Categories::where('name', $request->input('sportsName'))->firstOrFail();
            }

            // Handle arena
            if ($request->input('newArena') === 'true') {
                $sportsArena = new Sports_Arena();
                $sportsArena->name = $request->input('newArenaName');
                $sportsArena->location = $request->input('arenaLocation');
                $sportsArena->address = $request->input('arenaAddress');

                if ($request->hasFile('arenaImage')) {
                    if ($sportsArena->image) {
                        $this->cloudinary->uploadApi()->destroy($sportsArena->image);
                    }
                    $result = $this->cloudinary->uploadApi()->upload($request->file('arenaImage')->getRealPath());
                    $sportsArena->image = $result['secure_url'];
                }

                $sportsArena->save();
            } else {
                $sportsArena = Sports_Arena::where('name', $request->input('sportsArenaName'))->firstOrFail();
            }

            // Check if the combination already exists
            $existingClubSports = Club_Sports::where('club_id', $club->id)
                ->where('sports_id', $sportsCategory->id)
                ->where('sports_arena_id', $sportsArena->id)
                ->first();

            if ($existingClubSports) {
                DB::rollBack(); // Rollback transaction
                return response()->json(['error' => 'This combination of club, sport, and arena already exists.'], 409);
            }

            // Create a new club sports entry
            $clubSports = Club_Sports::create([
                'club_id' => $club->id,
                'sports_id' => $sportsCategory->id,
                'sports_arena_id' => $sportsArena->id,
            ]);

            DB::commit(); // Commit transaction

            return response()->json([
                'message' => 'Club sports entry created successfully',
                'data' => $clubSports
            ], 201);
        } catch (Exception $e) {
            DB::rollBack(); // Rollback transaction
            return response()->json(['error' => 'Failed to create club sports entry.', 'message' => $e->getMessage()], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/clubs-sports/one
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

    // DELETE => http://127.0.0.1:8000/api/clubs-sports?club_id={club_id}&sports_id={sports_id}
    public function deleteClubSports(Request $request)
    {
        try {
            // Validate incoming data
            $validator = Validator::make($request->all(), [
                'club_id' => 'required|integer',
                'sports_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Get the club_id and sports_id from the request
            $clubId = $request->input('club_id');
            $sportsId = $request->input('sports_id');

            // Find the Club_Sports entry with the given club_id and sports_id
            $entryToDelete = Club_Sports::where('club_id', $clubId)
                ->where('sports_id', $sportsId)
                ->get();

            $deletedRows = Club_Sports::where('club_id', $clubId)
                ->where('sports_id', $sportsId)
                ->delete();

            if ($deletedRows > 0) {
                return response()->json([
                    'message' => 'Club Sports entries deleted successfully',
                    'deletedRows' => $entryToDelete,
                ], 200);
            } else {
                return response()->json(['message' => 'No Club Sports entry found for the given club_id and sports_id'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete Club Sports', 'message' => $e->getMessage()], 500);
        }
    }


    //PUT => http://127.0.0.1:8000/api/clubs-sports/{clubId}
    public function updateClubSports(Request $request, $clubId)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'sport_id' => 'required|integer|exists:sports_categories,id',
                'sports_arena_ids' => 'required|array|min:1',
                'sports_arena_ids.*' => 'integer|exists:sports_arenas,id',
            ]);

            $sportId = $validatedData['sport_id'];
            $arenaIds = $validatedData['sports_arena_ids'];

            // Delete existing Club_Sports entries for this club and sport
            Club_Sports::where('club_id', $clubId)
                ->where('sports_id', $sportId)
                ->delete();

            // Store the newly created entries
            $newEntries = [];

            // Create new entries for each selected arena
            foreach ($arenaIds as $arenaId) {
                $newEntry = Club_Sports::create([
                    'club_id' => $clubId,
                    'sports_id' => $sportId,
                    'sports_arena_id' => $arenaId,
                ]);

                // Add the newly created entry to the array
                $newEntries[] = $newEntry;
            }

            return response()->json([
                'message' => 'Club Sports entries updated successfully',
                'updatedEntries' => $newEntries,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update Club Sports', 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteRegNo($id)
    {
        try {
            // Find the club by ID
            $club = Club::findOrFail($id);

            // Set regNo to null to "delete" it
            $club->regNo = null;

            // Save the updated club data
            $club->save();

            return response()->json(['message' => 'Club registration number deleted successfully'], 200);
        } catch (Exception $e) {
            // Handle any errors that may occur
            return response()->json(['error' => 'Failed to delete registration number', 'details' => $e->getMessage()], 500);
        }
    }


    //GET => http://127.0.0.1:8000/api/clubs/details
    public function getAllClubsDetails(Request $request)
    {
        try {
            // Get pagination and sorting parameters from the request
            $perPage = $request->input('per_page', 10);
            $clubNameSortOrder = $request->input('club_name_sort');
            $divisionNameSortOrder = $request->input('division_name_sort');
            $searchQuery = $request->input('search');

            // Start building the base query
            $clubs = Club::where('isVerified', 1)
                ->with(['clubManagers' => function ($query) {
                    $query->whereHas('user', function ($query) {
                        $query->where('is_verified', 1);
                    });
                }, 'members' => function ($query) {
                    $query->whereHas('user', function ($query) {
                        $query->where('is_verified', 1);
                    });
                }, 'gsDivision']);

            // Apply search filters
            if ($searchQuery) {
                $clubs->where(function ($query) use ($searchQuery) {
                    $query->where('clubName', 'like', "%$searchQuery%")
                        ->orWhereHas('gsDivision', function ($query) use ($searchQuery) {
                            $query->where('divisionName', 'like', "%$searchQuery%");
                        })
                        ->orWhereHas('clubManagers.user', function ($query) use ($searchQuery) {
                            $query->where('firstName', 'like', "%$searchQuery%")
                                ->orWhere('lastName', 'like', "%$searchQuery%");
                        })
                        ->orWhereHas('members.user', function ($query) use ($searchQuery) {
                            $query->where('firstName', 'like', "%$searchQuery%")
                                ->orWhere('lastName', 'like', "%$searchQuery%");
                        });
                });
            }

            // Apply sorting
            if ($clubNameSortOrder && !$divisionNameSortOrder) {
                $clubs->orderBy('clubName', $clubNameSortOrder);
            } elseif ($divisionNameSortOrder && !$clubNameSortOrder) {
                $clubs->join('gs_divisions', 'clubs.gs_id', '=', 'gs_divisions.id')
                    ->orderBy('gs_divisions.divisionName', $divisionNameSortOrder)
                    ->select('clubs.*');
            }

            // Get total count before pagination
            $totalCount = $clubs->count();

            // Calculate last page
            $lastPage = ceil($totalCount / $perPage);

            // Adjust current page if it exceeds last page
            $currentPage = $request->input('page', 1);
            if ($currentPage > $lastPage && $lastPage > 0) {
                $currentPage = $lastPage;
            }

            // Apply pagination with adjusted page
            $paginatedClubs = $clubs->paginate($perPage, ['*'], 'page', $currentPage);

            // Format the response
            $response = [
                'data' => $paginatedClubs->items(),
                'pagination' => [
                    'total' => $totalCount,
                    'per_page' => $perPage,
                    'current_page' => $currentPage,
                    'last_page' => $lastPage,
                    'from' => $paginatedClubs->firstItem(),
                    'to' => $paginatedClubs->lastItem(),
                ]
            ];

            return response()->json($response);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch club details.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadDetails($id)
    {
        $club = Club::with([
            // Fetch only required fields from gsDivision
            'gsDivision:id,divisionName,divisionNo',

            // Fetch only managers where user has not been soft-deleted
            'clubManagers' => function ($query) {
                $query->whereHas('user', function ($userQuery) {
                    $userQuery->whereNull('deleted_at');
                })->select('id', 'club_id', 'firstName', 'lastName', 'contactNo', 'gender', 'user_id');
                // ->with(['user:id,image']);
            },

            // Fetch only required fields from clubSports and related relationships
            'clubSports' => function ($query) {
                $query->select('id', 'club_id', 'sports_id', 'sports_arena_id')
                    ->with([
                        'sportsCategory:id,name',
                        'sportsArena:id,name'
                    ]);
            },

            // Fetch only members where user has not been soft-deleted
            'members' => function ($query) {
                $query->whereHas('user', function ($userQuery) {
                    $userQuery->whereNull('deleted_at');
                })->select('id', 'club_id', 'firstName', 'lastName', 'position', 'gender', 'contactNo', 'user_id')
                    ->orderBy('firstName', 'asc')
                    ->orderBy('lastName', 'asc');
            }
        ])->findOrFail($id);

        // Generate the PDF
        $pdf = PDF::loadView('club_details_pdf', compact('club'));

        // Generate a filename (sanitize club name to avoid issues)
        $filename = 'club_details_' . preg_replace('/[^A-Za-z0-9\-]/', '_', $club->clubName) . '.pdf';

        // Return the PDF for download
        return $pdf->download($filename);
    }

    // Controller method
    public function downloadAllClubs()
    {
        // Retrieve the clubs with necessary relationships and counts
        $clubs = Club::select('id', 'clubName', 'clubAddress', 'regNo', 'gs_id')
            ->with([
                'gsDivision:id,divisionName,divisionNo',
                'clubSports' => function ($query) {
                    $query->select('id', 'club_id', 'sports_id')
                        ->with(['sportsCategory:id,name']);
                }
            ])
            // Count male members
            ->withCount([
                'members as male_members' => function ($query) {
                    $query->where('gender', 'Male')
                        ->whereHas('user', function ($q) {
                            $q->whereNull('deleted_at');
                        });
                }
            ])
            // Count female members
            ->withCount([
                'members as female_members' => function ($query) {
                    $query->where('gender', 'Female')
                        ->whereHas('user', function ($q) {
                            $q->whereNull('deleted_at');
                        });
                }
            ])
            // Count male managers
            ->withCount([
                'clubManagers as male_managers' => function ($query) {
                    $query->where('gender', 'Male')
                        ->whereHas('user', function ($q) {
                            $q->whereNull('deleted_at');
                        });
                }
            ])
            // Count female managers
            ->withCount([
                'clubManagers as female_managers' => function ($query) {
                    $query->where('gender', 'Female')
                        ->whereHas('user', function ($q) {
                            $q->whereNull('deleted_at');
                        });
                }
            ])
            ->get();

        // Check if all clubs have a `regNo`
        $allHaveRegNo = $clubs->every(function ($club) {
            return !empty($club->regNo);
        });

        // Apply sorting logic
        if ($allHaveRegNo) {
            // If all clubs have a regNo, sort by regNo
            $clubs = $clubs->sortBy('regNo');
        } else {
            // If at least one club has an empty regNo, sort by clubName
            $clubs = $clubs->sortBy('clubName');
        }

        // Map to calculate total gender counts
        $clubs = $clubs->map(function ($club) {
            $club->male_count = (int)$club->male_members + (int)$club->male_managers;
            $club->female_count = (int)$club->female_members + (int)$club->female_managers;
            return $club;
        });

        // Generate the PDF
        $pdf = PDF::loadView('all_clubs_pdf', compact('clubs'));

        // Generate filename with current date
        $filename = 'all_clubs_' . date('Y-m-d') . '.pdf';

        // Return the PDF for download
        return $pdf->download($filename);
    }
}
