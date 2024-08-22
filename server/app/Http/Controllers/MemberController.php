<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Club_Manager;
use App\Models\Club_Sports;
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
            'nic' => 'required|string|max:20',
            'contactNo' => 'required|string|max:15',
            'whatsappNo' => 'nullable|string|max:15',
            'sports' => 'required|array',
            'sports.*.id' => 'required|exists:sports,id',
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
            // Get the page number and items per page from the request, or use defaults
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 12);

            // Fetch pending members with optional sports and skills
            $members = Member::with(['sports.sportsCategory', 'sports.skills', 'user'])
                ->whereHas('user', function ($query) {
                    $query->where('is_verified', 0);
                })
                ->paginate($perPage, ['*'], 'page', $page);


            $membersWithSportsAndSkills =  collect($members->items())->map(function ($member) {
                // Gather sports and skills details if available
                $sportsDetails = $member->sports->map(function ($memberSport) {
                    return [
                        'sport_id' => $memberSport->sportsCategory->id,
                        'sport_name' => $memberSport->sportsCategory->name,
                        'skills' => $memberSport->skills->map(function ($skill) {
                            return [
                                'skill_id' => $skill->id,
                                'skill_name' => $skill->name,

                            ];
                        }),
                    ];
                });

                return [
                    'member_id' => $member->id,
                    'firstName' => $member->firstName,
                    'lastName' => $member->lastName,
                    'date_of_birth' => $member->date_of_birth,
                    'address' => $member->address,
                    'nic' => $member->nic,
                    'contactNo' => $member->contactNo,
                    'whatsappNo' => $member->whatsappNo,
                    'gs_id' => $member->gs_id,
                    'created_at' => $member->created_at->toDateTimeString(), // Include created_at from the members table
                    'user' => $member->user->safeAttributes(), // Using safeAttributes() to get user details
                    'sports' => $sportsDetails->isEmpty() ? null : $sportsDetails, // Conditionally include sports details
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
}
