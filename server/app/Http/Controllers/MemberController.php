<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Club_Manager;
use App\Models\Role;
use App\Models\Gs_Division;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Events\MemberApplied;
use App\Events\UserVerified;
use App\Events\UserRejected;
use App\Models\Member;
use App\Models\Member_Skills;
use App\Models\Member_Sports;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Cloudinary\Cloudinary;



class MemberController extends Controller
{

    protected $cloudinary;

    public function __construct(Cloudinary $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    //POST => http://127.0.0.1:8000/api/member/apply
    public function memberApply(Request $request)
    {
        $request->validate([
            'userName' => 'required|string|max:255|unique:users,userName',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string',
            'position' => 'required|string',
            'divisionName' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'address' => 'required|string|max:255',
            'experience' => 'nullable|string|max:255',
            'nic' => 'nullable|string|max:20',
            'contactNo' => 'required|string|max:15',
            'whatsappNo' => 'nullable|string|max:15',
            'sports' => 'required|array',
            'sports.*.id' => 'required|exists:sports_categories,id',
            'sports.*.skills' => 'sometimes|array|min:1',
            'sports.*.skills.*' => 'sometimes|exists:skills,id',
            'clubName' => 'required|string|exists:clubs,clubName',
        ]);

        DB::beginTransaction();

        try {
            $roleName = 'Club Member';
            $role = Role::where('role_name', $roleName)->firstOrFail();

            $dateOfBirth = Carbon::parse($request->date_of_birth)->startOfDay();
            $today = Carbon::now('UTC')->startOfDay();
            $age = $today->diffInYears($dateOfBirth);

            // Find the gs_id based on the divisionName
            $gsDivision = Gs_Division::where('divisionName', $request->divisionName)->first();

            // Handle image upload if provided
            $userImageUrl = null;
            if ($request->hasFile('image')) {
                $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
                $userImageUrl = $result['secure_url'];
            }

            $user = User::create([
                'userName' => $request->userName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role->id,
                'image' => $userImageUrl,
                'is_verified' => false
            ]);

            // Get clubId based on clubName
            $club = Club::where('clubName', $request->clubName)->firstOrFail();
            $clubId = $club->id;

            // Find the manager based on the club_id
            $manager = Club_Manager::where('club_id', $clubId)->first();
            $managerId = $manager->id;
            $managerUserId = $manager->user_id;


            $member = Member::create([
                'user_id' => $user->id,
                'club_id' => $clubId,
                'gs_id' => $gsDivision->id,
                'manager_id' => $managerId,
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'position' => $request->position,
                'date_of_birth' => $request->date_of_birth,
                'age' => $age,
                'address' => $request->address,
                'experience' => $request->experience,
                'nic' => $request->nic,
                'contactNo' => $request->contactNo,
                'whatsappNo' => $request->whatsappNo,
            ]);

            if ($request->has('sports') && !empty($request->sports)) {

                foreach ($request->sports as $sportData) {
                    $playerSport = Member_Sports::create([
                        'member_id' => $member->id,
                        'sports_id' => $sportData['id'],
                    ]);

                    if (isset($sportData['skills']) && !empty($sportData['skills'])) {
                        foreach ($sportData['skills'] as $skillId) {
                            Member_Skills::create([
                                'member_sport_id' => $playerSport->id,
                                'skill_id' => $skillId,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            event(new MemberApplied($member, $managerUserId));

            return response()->json([
                'message' => 'Member Applied successfully ',
                'userId' => $user->id,
                'userName' => $request->userName,
                'email' => $request->email,
                'role_id' => $role->id,
                'is_verified' => 0,
                'image' => $user->image,
                'member' => $member,
                'sports' => $request->sports
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to apply with sports and skills: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to register player', 'details' => $e->getMessage()], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/pendingMembers
    public function pendingMembers(Request $request)
    {

        try {
            // Get the userId from the request
            $userId = $request->input('userId');
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'UserId is required',
                ], 400);
            }

            // Get the page number and items per page from the request, or use defaults
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 12);

            // Find the club manager and associated manager_id
            $clubManager = Club_Manager::where('user_id', $userId)->first();

            if (!$clubManager) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club manager not found for the given userId',
                ], 404);
            }

            // Fetch pending members associated with the club manager
            $members = Member::with(['memberSports.sport', 'memberSports.skills', 'user'])
                ->where('manager_id', $clubManager->id)
                ->whereHas('user', function ($query) {
                    $query->where('is_verified', 0);
                })
                ->paginate($perPage, ['*'], 'page', $page);

            $membersWithSportsAndSkills = collect($members->items())->map(function ($member) {
                $memberDivision = Gs_Division::where('id', $member->gs_id)->first();

                $sportsDetails = $member->memberSports->map(function ($memberSport) {
                    $skills = $memberSport->skills->map(function ($skill) {
                        return [
                            'skill_id' => $skill->id ?? null,
                            'skill_name' => $skill->skill ?? null,
                        ];
                    })->values();

                    return [
                        'sport_id' => $memberSport->sport->id,
                        'sport_name' => $memberSport->sport->name,
                        'skills' => $skills,
                    ];
                })->values();

                return [
                    'member_id' => $member->id,
                    'firstName' => $member->firstName,
                    'lastName' => $member->lastName,
                    'date_of_birth' => $member->date_of_birth,
                    'address' => $member->address,
                    'nic' => $member->nic,
                    'contactNo' => $member->contactNo,
                    'whatsappNo' => $member->whatsappNo,
                    'experience' => $member->experience,
                    'age' => $member->age,
                    'position' => $member->position,
                    'gs_id' => $member->gs_id,
                    'divisionName' => $memberDivision ? $memberDivision->divisionName : null,
                    'created_at' => $member->created_at->toDateString(),
                    'user' => $member->user->safeAttributes(),
                    'sports' => $sportsDetails->isEmpty() ? null : $sportsDetails,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $membersWithSportsAndSkills,
                'pagination' => [
                    'total' => $members->total(),
                    'per_page' => $members->perPage(),
                    'current_page' => $members->currentPage(),
                    'last_page' => $members->lastPage(),
                    'from' => $members->firstItem(),
                    'to' => $members->lastItem(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching pending members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending members: ' . $e->getMessage(),
            ], 500);
        }
    }

    // DELETE => http://127.0.0.1:8000/api/deleteMember/{memberId}
    public function deleteMember($memberId)
    {
        try {
            // Find the member
            $member = Member::findOrFail($memberId);

            // Begin a database transaction
            DB::beginTransaction();

            $user_id = $member->user_id;

            $managerId = $member->manager_id;
            $manager = Club_Manager::findOrFail($managerId);
            $managerUserId = $manager->user_id;

            try {

                event(new UserRejected($user_id));
                event(new MemberApplied($member, $managerUserId));

                // Delete related member sports and skills
                foreach ($member->memberSports as $memberSport) {
                    // Delete related skills from the pivot table
                    $memberSport->skills()->detach();

                    // If you have a separate member_skills table, you might need to delete from it directly
                    DB::table('member_skills')->where('member_sport_id', $memberSport->id)->delete();

                    // Delete the member sport
                    $memberSport->delete();
                }

                // Delete the member's user account if it exists
                if ($member->user) {
                    $member->user->delete();
                }

                // Delete the member
                $member->delete();

                // Commit the transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Member and all related data deleted successfully',
                ], 200);
            } catch (\Exception $e) {
                // Rollback the transaction in case of any error
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error deleting member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting member: ' . $e->getMessage(),
            ], 500);
        }
    }

    // POST => http://127.0.0.1:8000/api/verifyMember/{memberId}
    public function verifyMember($memberId)
    {
        try {
            // Find the member
            $member = Member::findOrFail($memberId);

            $managerId = $member->manager_id;
            $manager = Club_Manager::findOrFail($managerId);
            $managerUserId = $manager->user_id;

            // Check if the member has an associated user
            if (!$member->user) {
                return response()->json([
                    'success' => false,
                    'message' => 'No associated user found for this member',
                ], 404);
            }

            // Update the user's verification status
            $member->user->is_verified = true;
            $member->user->save();

            $user_id = $member->user->id;

            event(new UserVerified($user_id));
            event(new MemberApplied($member, $managerUserId));

            return response()->json([
                'success' => true,
                'message' => 'Member verified successfully',
                'data' => [
                    'member_id' => $member->id,
                    'user_id' => $member->user->id,
                    'is_verified' => $member->user->is_verified,
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error verifying member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error verifying member: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/membersList
    public function membersList(Request $request)
    {
        try {
            // Get the userId from the request
            $userId = $request->input('userId');
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'UserId is required',
                ], 400);
            }

            // Find the club manager and associated manager_id
            $clubManager = Club_Manager::where('user_id', $userId)->first();

            if (!$clubManager) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club manager not found for the given userId',
                ], 404);
            }

            // Fetch  members associated with the club manager
            $members = Member::with(['memberSports.sport', 'memberSports.skills', 'user'])
                ->where('manager_id', $clubManager->id)
                ->whereHas('user', function ($query) {
                    $query->where(function ($subQuery) {
                        $subQuery
                            ->WhereNull('deleted_at'); // Include non-deleted members
                    });
                })
                ->get();

            if ($members->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                ], 200);
            }

            $membersWithSportsAndSkills = $members->map(function ($member) {
                $memberDivision = Gs_Division::where('id', $member->gs_id)->first();

                $sportsDetails = $member->memberSports->map(function ($memberSport) {
                    $skills = $memberSport->skills->map(function ($skill) {
                        return [
                            'skill_id' => $skill->id ?? null,
                            'skill_name' => $skill->skill ?? null,
                        ];
                    })->values();

                    return [
                        'sport_id' => $memberSport->sport->id,
                        'sport_name' => $memberSport->sport->name,
                        'skills' => $skills,
                    ];
                })->values();

                return [
                    'member_id' => $member->id,
                    'firstName' => $member->firstName,
                    'lastName' => $member->lastName,
                    'date_of_birth' => $member->date_of_birth,
                    'address' => $member->address,
                    'nic' => $member->nic,
                    'contactNo' => $member->contactNo,
                    'whatsappNo' => $member->whatsappNo,
                    'experience' => $member->experience,
                    'age' => $member->age,
                    'position' => $member->position,
                    'gs_id' => $member->gs_id,
                    'divisionName' => $memberDivision ? $memberDivision->divisionName : null,
                    'created_at' => $member->created_at->toDateString(),
                    'user' => $member->user ? $member->user->safeAttributes() : null,
                    'sports' => $sportsDetails->isEmpty() ? null : $sportsDetails,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $membersWithSportsAndSkills,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching pending members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending members: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/queryMembers
    public function queryMembers(Request $request)
    {
        try {
            // Get the userId from the request
            $userId = $request->input('userId');
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'UserId is required',
                ], 400);
            }

            // Get the page number, items per page, sort order, and sort column from the request, or use defaults
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 12);
            $sort = $request->input('sort', 'asc');
            $sortBy = $request->input('sortBy', 'name');
            $search = $request->input('search', '');

            // Find the club manager and associated manager_id
            $clubManager = Club_Manager::where('user_id', $userId)->first();

            if (!$clubManager) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club manager not found for the given userId',
                ], 404);
            }

            // Fetch both verified and soft-deleted members associated with the club manager
            $query = Member::with([
                'memberSports.sport',
                'memberSports.skills',
                'user' => function ($query) {
                    $query->withTrashed();
                }
            ])->where('manager_id', $clubManager->id)
                ->whereHas('user', function ($query) {
                    $query->where('is_verified', 1)
                        ->withTrashed();
                });

            // Apply search filter if a search term is provided
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('firstName', 'like', "%{$search}%")
                        ->orWhere('lastName', 'like', "%{$search}%")
                        ->orWhere('contactNo', 'like', "%{$search}%")
                        ->orWhere('whatsappNo', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            if ($sortBy === 'name') {
                $query->orderBy('firstName', $sort)
                    ->orderBy('lastName', $sort);
            } elseif ($sortBy === 'created_at') {
                $query->orderBy('created_at', $sort);
            }

            // Paginate the results
            $members = $query->paginate($perPage, ['*'], 'page', $page);

            if ($members->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                ], 200);
            }

            // Transform the members data
            $membersWithSportsAndSkills = collect($members->items())->map(function ($member) {
                $memberDivision = Gs_Division::where('id', $member->gs_id)->first();
                $user = $member->user;

                return [
                    'member_id' => $member->id,
                    'firstName' => $member->firstName,
                    'lastName' => $member->lastName,
                    'date_of_birth' => $member->date_of_birth,
                    'contactNo' => $member->contactNo,
                    'whatsappNo' => $member->whatsappNo,
                    'age' => $member->age,
                    'position' => $member->position,
                    'created_at' => $member->created_at->toDateString(),
                    'user' => $user ? $user->safeAttributes() : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $membersWithSportsAndSkills,
                'pagination' => [
                    'total' => $members->total(),
                    'per_page' => $members->perPage(),
                    'current_page' => $members->currentPage(),
                    'last_page' => $members->lastPage(),
                    'from' => $members->firstItem(),
                    'to' => $members->lastItem(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching verified members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching verified members: ' . $e->getMessage(),
            ], 500);
        }
    }


    // GET => http://127.0.0.1:8000/api/memberDetails/{memberId}
    public function getMemberDetails($memberId)
    {
        try {
            // Find the member by memberId
            $member = Member::with([
                'memberSports.sport',
                'memberSports.skills',
                'club',
                'user' => function ($query) {
                    $query->withTrashed();
                }
            ])
                ->where('id', $memberId)
                ->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found for the given memberId',
                ], 404);
            }

            // Get the member's division details
            $memberDivision = Gs_Division::where('id', $member->gs_id)->first();

            // Get the sports details associated with the member
            $sportsDetails = $member->memberSports->map(function ($memberSport) {
                $skills = $memberSport->skills->map(function ($skill) {
                    return [
                        'skill_id' => $skill->id ?? null,
                        'skill_name' => $skill->skill ?? null,
                    ];
                })->values();

                return [
                    'sport_id' => $memberSport->sport->id,
                    'sport_name' => $memberSport->sport->name,
                    'skills' => $skills,
                ];
            })->values();

            // Prepare the response data
            $memberData = [
                'member_id' => $member->id,
                'firstName' => $member->firstName,
                'lastName' => $member->lastName,
                'date_of_birth' => $member->date_of_birth,
                'address' => $member->address,
                'nic' => $member->nic,
                'contactNo' => $member->contactNo,
                'whatsappNo' => $member->whatsappNo,
                'experience' => $member->experience,
                'age' => $member->age,
                'position' => $member->position,
                'gs_id' => $member->gs_id,
                'divisionName' => $memberDivision ? $memberDivision->divisionName : null,
                'created_at' => $member->created_at->toDateString(),
                'user' => $member->user->safeAttributes(),
                'sports' => $sportsDetails->isEmpty() ? null : $sportsDetails,
                'club' => $member->club,
            ];

            return response()->json([
                'success' => true,
                'data' => $memberData,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching member details: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching member details: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/membersBySport
    public function membersBySport(Request $request)
    {
        try {
            // Get the userId and sports_id from the request
            $userId = $request->input('userId');
            $sportsId = $request->input('sports_id');

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'UserId is required',
                ], 400);
            }

            if (!$sportsId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sports ID is required',
                ], 400);
            }

            // Find the club manager using userId
            $clubManager = Club_Manager::where('user_id', $userId)->first();

            if (!$clubManager) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club manager not found for the given userId',
                ], 404);
            }

            // Fetch members associated with the club manager and filter by sports_id
            $members = Member::where('manager_id', $clubManager->id)
                ->whereHas('user', function ($query) {
                    $query->whereNull('deleted_at'); // Include non-deleted members
                })
                ->whereHas('memberSports', function ($query) use ($sportsId) {
                    $query->where('sports_id', $sportsId);
                })
                ->with(['memberSports' => function ($query) use ($sportsId) {
                    $query->where('sports_id', $sportsId)
                        ->with(['skills' => function ($skillQuery) {
                            $skillQuery->select('member_skills.id as member_skill_id', 'skills.skill as skill_name', 'member_skills.member_sport_id')
                                ->join('skills as s', 's.id', '=', 'member_skills.skill_id');
                        }])
                        ->select('id', 'member_id', 'sports_id');
                }])
                ->get(['id', 'firstName', 'lastName', 'position', 'club_id']);

            if ($members->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                ], 200);
            }

            // Map the results to include only required fields along with skills
            $filteredMembers = $members->map(function ($member) {
                $memberSports = $member->memberSports->map(function ($memberSport) {
                    $skills = $memberSport->skills->map(function ($skill) {
                        return [
                            'member_skill_id' => $skill->member_skill_id,
                            'skill_name' => $skill->skill_name,
                        ];
                    })->values();

                    return [
                        'id' => $memberSport->id,
                        'skills' => $skills,
                    ];
                });

                return [
                    'member_id' => $member->id,
                    'firstName' => $member->firstName,
                    'lastName' => $member->lastName,
                    'club_id' => $member->club_id,
                    'member_position' => $member->position,
                    'member_sports' => $memberSports,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $filteredMembers,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching members by sport: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching members by sport: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/memberDetailsByUserId/{userId}
    public function getMemberDetailsByUserId($userId)
    {
        try {
            // Find the member by userId
            $member = Member::with([
                'memberSports.sport',
                'memberSports.skills',
                'club',
                'user' => function ($query) {
                    $query->withTrashed();
                }
            ])
                ->where('user_id', $userId)
                ->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found for the given userId',
                ], 404);
            }

            // Get the member's division details
            $memberDivision = Gs_Division::where('id', $member->gs_id)->first();

            // Get the sports details associated with the member
            $sportsDetails = $member->memberSports->map(function ($memberSport) {
                $skills = $memberSport->skills->map(function ($skill) {
                    return [
                        'skill_id' => $skill->id ?? null,
                        'skill_name' => $skill->skill ?? null,
                    ];
                })->values();

                return [
                    'sport_id' => $memberSport->sport->id,
                    'sport_name' => $memberSport->sport->name,
                    'skills' => $skills,
                ];
            })->values();

            // Prepare the response data
            $memberData = [
                'member_id' => $member->id,
                'firstName' => $member->firstName,
                'lastName' => $member->lastName,
                'date_of_birth' => $member->date_of_birth,
                'address' => $member->address,
                'nic' => $member->nic,
                'contactNo' => $member->contactNo,
                'whatsappNo' => $member->whatsappNo,
                'experience' => $member->experience,
                'age' => $member->age,
                'position' => $member->position,
                'gs_id' => $member->gs_id,
                'divisionName' => $memberDivision ? $memberDivision->divisionName : null,
                'created_at' => $member->created_at->toDateString(),
                'user' => $member->user->safeAttributes(),
                'sports' => $sportsDetails->isEmpty() ? null : $sportsDetails,
                'club' => $member->club,
            ];

            return response()->json([
                'success' => true,
                'data' => $memberData,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching member details: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching member details: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateMemberDetails(Request $request, $userId)
    {
        $request->validate([
            'firstName' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date',
            'address' => 'sometimes|string|max:255',
            'nic' => 'sometimes|string|max:20',
            'contactNo' => 'sometimes|string|max:15',
            'whatsappNo' => 'nullable|string|max:15',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $userId,
            'userName' => 'sometimes|string|max:255|unique:users,userName,' . $userId,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg,webp|max:2048',
            'divisionName' => 'sometimes|string|max:255',
            'currentPassword' => 'required_with:password|string',
            'password' => 'sometimes|string',
        ]);

        DB::beginTransaction();

        try {
            $user = User::findOrFail($userId);
            $member = Member::where('user_id', $userId)->firstOrFail();

            // Update Member details
            if ($request->has('firstName')) {
                $member->firstName = $request->firstName;
            }
            if ($request->has('lastName')) {
                $member->lastName = $request->lastName;
            }
            if ($request->has('date_of_birth')) {
                $member->date_of_birth = $request->date_of_birth;
                // Recalculate age
                $dateOfBirth = Carbon::parse($request->date_of_birth)->startOfDay();
                $today = Carbon::now('UTC')->startOfDay();
                $member->age = $today->diffInYears($dateOfBirth);
            }
            if ($request->has('address')) {
                $member->address = $request->address;
            }
            if ($request->has('nic')) {
                $member->nic = $request->nic;
            }
            if ($request->has('contactNo')) {
                $member->contactNo = $request->contactNo;
            }
            if ($request->has('whatsappNo')) {
                $member->whatsappNo = $request->whatsappNo;
            }
            if ($request->has('divisionName')) {
                $gsDivision = Gs_Division::where('divisionName', $request->divisionName)->firstOrFail();
                $member->gs_id = $gsDivision->id;
            }

            $member->save();

            // Update User details
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('userName')) {
                $user->userName = $request->userName;
            }
            // Handle image upload if provided
            if ($request->hasFile('image')) {
                if ($user->image) {
                    // Optionally delete the old image from Cloudinary
                    $this->cloudinary->uploadApi()->destroy($user->image);
                }

                $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
                $user->image = $result['secure_url'];
            }

            // Update password if provided
            if ($request->has('password')) {
                if (!$request->has('currentPassword')) {
                    return response()->json(['error' => 'Current password is required to change password'], 400);
                }

                if (!Hash::check($request->currentPassword, $user->password)) {
                    return response()->json(['error' => 'Current password is incorrect'], 400);
                }

                $user->password = Hash::make($request->password);
            }

            $user->save();

            DB::commit();

            return response()->json([
                'message' => 'Member details updated successfully',
                'member' => $member,
                'user' => $user->safeAttributes()
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to update member details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update member details', 'details' => $e->getMessage()], 500);
        }
    }


    public function updateMemberSports(Request $request, $userId)
    {
        $request->validate([
            'sports' => 'required|array',
            'sports.*.sport_id' => 'required|integer|exists:sports,id',
            'sports.*.skills' => 'nullable|array',
            'sports.*.skills.*.skill_id' => 'nullable|integer|exists:skills,id',
        ]);

        DB::beginTransaction();

        try {
            // Find the member by user_id
            $member = Member::where('user_id', $userId)->firstOrFail();

            // Get the sport IDs included in the request
            $newSportIds = array_column($request->sports, 'sport_id');

            // Find existing sports for the member that are not in the request and delete them
            $existingSports = $member->memberSports->pluck('sport_id')->toArray();
            $sportsToDelete = array_diff($existingSports, $newSportIds);

            // Delete sports that are no longer associated with the member
            if (!empty($sportsToDelete)) {
                Member_Sports::where('member_id', $member->id)
                    ->whereIn('sport_id', $sportsToDelete)
                    ->each(function ($memberSport) {
                        $memberSport->skills()->detach(); // Detach skills
                        $memberSport->delete(); // Delete the MemberSport entry
                    });
            }

            // Update or create each sport and skill association
            foreach ($request->sports as $sportData) {
                $sportId = $sportData['sport_id'];

                // Find or create the MemberSport entry
                $memberSport = Member_Sports::updateOrCreate(
                    [
                        'member_id' => $member->id,
                        'sport_id' => $sportId
                    ]
                );

                if (isset($sportData['skills'])) {
                    $skillIds = array_column($sportData['skills'], 'skill_id');
                    // Sync the skills with the MemberSport
                    $memberSport->skills()->sync($skillIds);
                } else {
                    // Clear skills if no skills are provided for the sport
                    $memberSport->skills()->detach();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Member sports and skills updated successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating member sports and skills: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error updating member sports and skills: ' . $e->getMessage(),
            ], 500);
        }
    }
}
