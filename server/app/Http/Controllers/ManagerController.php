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
use App\Events\ManagerApplied;
use App\Events\UserVerified;
use App\Events\UserRejected;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Cloudinary\Cloudinary;


class ManagerController extends Controller
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

    //POST => http://127.0.0.1:8000/api/manager/apply
    public function managerApply(Request $request)
    {
        $roleName = 'Club Manager';

        $request->validate([
            'clubName' => 'required|string|max:255',
            'clubDivisionName' => 'required|string|max:255',
            'clubAddress' => 'required|string|max:255',
            'club_history' => 'nullable|string',
            'clubContactNo' => 'required|string|max:15',
            'clubImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
            'userName' => 'required|string|max:255|unique:users,userName',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
            'divisionName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'address' => 'required|string|max:255',
            'nic' => 'required|string|max:20',
            'contactNo' => 'required|string|max:15',
            'whatsappNo' => 'nullable|string|max:15',
        ]);

        DB::beginTransaction();

        try {

            $role = Role::where('role_name', $roleName)->first();

            if (!$role) {
                return response()->json(['error' => 'Invalid role name'], 404);
            }

            // Find the gs_id based on the divisionName
            $gsDivision = Gs_Division::where('divisionName', $request->divisionName)->first();

            // Find the gs_id based on the divisionName
            $gsDivision1 = Gs_Division::where('divisionName', $request->clubDivisionName)->first();

            if (!$gsDivision) {
                return response()->json(['error' => 'Invalid manager division name'], 404);
            }

            if (!$gsDivision1) {
                return response()->json(['error' => 'Invalid club division name'], 404);
            }

            $dateOfBirth = Carbon::parse($request->date_of_birth)->startOfDay();
            $today = Carbon::now('UTC')->startOfDay();
            $age = $today->diffInYears($dateOfBirth);

            // Handle image upload if provided
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('public/images');
                $imageName = basename($imagePath);
            }

            $clubData = [
                'clubName' => $request->clubName,
                'gs_id' => $gsDivision1->id,
                'clubAddress' => $request->clubAddress,
                'club_history' => $request->club_history,
                'clubContactNo' => $request->clubContactNo,
                "isVerified" => false,
            ];

            if ($request->hasFile('clubImage')) {
                $clubImagePath = $request->file('clubImage')->store('public/images');
                $clubData['clubImage'] = basename($clubImagePath);
            }

            $club = Club::create($clubData);

            $user = User::create([
                'userName' => $request->userName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role->id,
                'image' => $imageName ?? null,
                "is_verified" => false
            ]);

            $manager = Club_Manager::create([
                'user_id' => $user->id,
                'club_id' => $club->id,
                'gs_id' => $gsDivision->id,
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'date_of_birth' => $request->date_of_birth,
                'age' => $age,
                'address' => $request->address,
                'nic' => $request->nic,
                'contactNo' => $request->contactNo,
                'whatsappNo' => $request->whatsappNo,
            ]);

            $clubName = $club->clubName;

            DB::commit();

            event(new ManagerApplied($manager, $clubName));


            return response()->json([
                'message' => 'Request created successfully',
                'userId' => $user->id,
                'userName' => $request->userName,
                'email' => $request->email,
                'role_id' => $role->id,
                'is_verified' => 0,
                'image' => $user->image,
                'manager' => $manager,
                'club' => $club
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create request: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create Request', 'details' => $e->getMessage()], 500);
        }
    }


    //POST => http://127.0.0.1:8000/api/manager/create
    public function managerCreate(Request $request)
    {

        $roleName = 'Club Manager';

        $request->validate([
            'userName' => 'required|string|max:255|unique:users,userName',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'image' => 'nullable|string',
            'club_id' => 'required|integer|exists:clubs,id',
            'divisionName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'address' => 'required|string|max:255',
            'nic' => 'required|string|max:20',
            'contactNo' => 'required|string|max:15',
            'whatsappNo' => 'nullable|string|max:15',
        ]);

        DB::beginTransaction();

        try {

            $role = Role::where('role_name', $roleName)->first();

            if (!$role) {
                return response()->json(['error' => 'Invalid role name'], 404);
            }

            // Find the gs_id based on the divisionName
            $gsDivision = Gs_Division::where('divisionName', $request->divisionName)->first();

            if (!$gsDivision) {
                return response()->json(['error' => 'Invalid division name'], 404);
            }

            $dateOfBirth = Carbon::parse($request->date_of_birth)->startOfDay();
            $today = Carbon::now('UTC')->startOfDay();
            $age = $today->diffInYears($dateOfBirth);

            $user = User::create([
                'userName' => $request->userName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role->id,
                'image' => $request->image,
            ]);

            $manager = Club_Manager::create([
                'user_id' => $user->id,
                'club_id' => $request->club_id,
                'gs_id' => $gsDivision->id,
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'date_of_birth' => $request->date_of_birth,
                'age' => $age,
                'address' => $request->address,
                'nic' => $request->nic,
                'contactNo' => $request->contactNo,
                'whatsappNo' => $request->whatsappNo,
            ]);

            DB::commit();

            return response()->json(['message' => 'Manager created successfully', 'manager' => $manager], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create manager: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create manager', 'details' => $e->getMessage()], 500);
        }
    }

    // DELETE => http://127.0.0.1:8000/api/manager/delete/{club_id}/{user_id}
    public function requestDelete($club_id, $user_id)
    {
        DB::beginTransaction();

        try {
            // Find the manager by user_id and club_id
            $manager = Club_Manager::where('user_id', $user_id)->where('club_id', $club_id)->first();

            if (!$manager) {
                return response()->json(['error' => 'Manager not found'], 404);
            }

            // Find the user by user_id
            $user = User::find($user_id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Find the club by club_id
            $club = Club::find($club_id);

            if (!$club) {
                return response()->json(['error' => 'Club not found'], 404);
            }

            // Store the firstName, lastName, and clubName for the response
            $firstName = $manager->firstName;
            $lastName = $manager->lastName;
            $clubName = $club->clubName;


            try {
                event(new ManagerApplied($manager, $clubName));
                event(new UserRejected($user_id));
            } catch (\Exception $e) {
                Log::error('Event failed: ' . $e->getMessage());
            }

            // Delete the manager record
            $manager->delete();

            // Delete the user record
            $user->delete();

            // Delete the club record if required
            $club->delete();

            DB::commit();

            return response()->json([
                'message' => "Manager $firstName $lastName and associated club $clubName deleted successfully",
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to delete manager, user, and associated club',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE => http://127.0.0.1:8000/api/manager/deleteManager/{user_id}
    public function deleteManager($user_id)
    {
        DB::beginTransaction();
        try {
            // Find the manager by user ID
            $manager = Club_Manager::where('user_id', $user_id)->first();

            if (!$manager) {
                return response()->json(['error' => 'Manager not found'], 404);
            }

            // Store manager's first name, last name, and club name for the response
            $firstName = $manager->firstName;
            $lastName = $manager->lastName;
            $clubName = $manager->club->clubName;

            // Delete the manager
            $manager->delete();

            // Delete the associated user
            User::find($user_id)->delete();

            DB::commit();

            return response()->json(['message' => "Manager $firstName $lastName from club $clubName deleted successfully"], 200);
        } catch (Exception $e) {

            DB::rollBack();
            // Handle any errors that may occur
            return response()->json(['error' => 'Failed to delete manager and user', 'details' => $e->getMessage()], 500);
        }
    }

    //GET => http://127.0.0.1:8000/api/manager/list
    public function getAllManagers()
    {
        try {

            $managers = Club_Manager::with(['user', 'club'])->get();

            // Map the division names by matching gs_id for both manager and club
            $managersWithDivision = $managers->map(function ($manager) {
                $managerDivision = Gs_Division::where('id', $manager->gs_id)->first();
                $clubDivision = Gs_Division::where('id', $manager->club->gs_id)->first();

                return [
                    'managerId' => $manager->id,
                    'firstName' => $manager->firstName,
                    'lastName' => $manager->lastName,
                    'date_of_birth' => $manager->date_of_birth,
                    'address' => $manager->address,
                    'nic' => $manager->nic,
                    'contactNo' => $manager->contactNo,
                    'whatsappNo' => $manager->whatsappNo,
                    'gs_id' => $manager->gs_id,
                    'divisionName' => $managerDivision ? $managerDivision->divisionName : null,
                    'user' => [
                        'user_id' => $manager->user->id,
                        'email' => $manager->user->email,
                        'userName' => $manager->user->userName,
                        'image' => $manager->user->image,
                        "is_verified" => $manager->user->is_verified
                    ],
                    'club' => [
                        'club_id' => $manager->club->id,
                        'clubName' => $manager->club->clubName,
                        'clubDivisionName' => $clubDivision ? $clubDivision->divisionName : null,
                        'clubAddress' => $manager->club->clubAddress,
                        'club_history' => $manager->club->club_history,
                        'clubImage' => $manager->club->clubImage,
                        'clubContactNo' => $manager->club->clubContactNo,
                        "isVerified" => $manager->club->isVerified,
                        'club_gs_id' => $manager->club->gs_id,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $managersWithDivision
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching Managers: ' . $e->getMessage()
            ], 500);
        }
    }

    // PUT => http://127.0.0.1:8000/api/manager/update-verification/{managerId}
    public function updateVerificationStatus($managerId)
    {
        try {
            // Find the manager record by its ID
            $manager = Club_Manager::with(['user', 'club'])->find($managerId);

            if (!$manager) {
                return response()->json(['error' => 'Manager not found'], 404);
            }

            // Update the user's is_verified field to true
            $manager->user->is_verified = true;
            $manager->user->save();

            // Update the club's isVerified field to true
            $manager->club->isVerified = true;
            $manager->club->save();

            // Retrieve the division name for the club and manager
            $clubDivision = Gs_Division::where('id', $manager->club->gs_id)->first();
            $clubName = $manager->club->clubName;
            $user_id = $manager->user->id;

            event(new ManagerApplied($manager, $clubName));

            event(new UserVerified($user_id));

            return response()->json([
                'success' => true,
                'message' => 'Verification status updated successfully',
                'data' => [
                    'user' => [
                        'email' => $manager->user->email,
                        'userName' => $manager->user->userName,
                        'image' => $manager->user->image,
                        'is_verified' => $manager->user->is_verified,
                    ],
                    'club' => [
                        'clubName' => $manager->club->clubName,
                        'clubDivisionName' => $clubDivision ? $clubDivision->divisionName : null,
                        'clubAddress' => $manager->club->clubAddress,
                        'club_history' => $manager->club->club_history,
                        'clubContactNo' => $manager->club->clubContactNo,
                        'isVerified' => $manager->club->isVerified,
                    ],
                    'manager' => $manager
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating verification status: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/manager/query
    public function queryManagers(Request $request)
    {
        try {
            // Get the page number and items per page from the request, or use defaults
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 12);
            $sortDirection = $request->input('sort_direction', 'asc');

            $managers = Club_Manager::with(['user', 'club'])
                ->orderBy('firstName', $sortDirection)
                ->paginate($perPage, ['*'], 'page', $page);

            $managersWithDivision = collect($managers->items())->map(function ($manager) {
                $managerDivision = Gs_Division::where('id', $manager->gs_id)->first();
                $clubDivision = Gs_Division::where('id', $manager->club->gs_id)->first();

                return [
                    'managerId' => $manager->id,
                    'firstName' => $manager->firstName,
                    'lastName' => $manager->lastName,
                    'date_of_birth' => $manager->date_of_birth,
                    'address' => $manager->address,
                    'nic' => $manager->nic,
                    'contactNo' => $manager->contactNo,
                    'whatsappNo' => $manager->whatsappNo,
                    'gs_id' => $manager->gs_id,
                    'divisionName' => $managerDivision ? $managerDivision->divisionName : null,
                    'user' => [
                        'user_id' => $manager->user->id,
                        'email' => $manager->user->email,
                        'userName' => $manager->user->userName,
                        'image' => $manager->user->image,
                        "is_verified" => $manager->user->is_verified
                    ],
                    'club' => [
                        'club_id' => $manager->club->id,
                        'clubName' => $manager->club->clubName,
                        'clubDivisionName' => $clubDivision ? $clubDivision->divisionName : null,
                        'clubAddress' => $manager->club->clubAddress,
                        'club_history' => $manager->club->club_history,
                        'clubContactNo' => $manager->club->clubContactNo,
                        'clubImage' => $manager->club->clubImage,
                        "isVerified" => $manager->club->isVerified,
                        'club_gs_id' => $manager->club->gs_id,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $managersWithDivision,
                'pagination' => [
                    'total' => $managers->total(),
                    'per_page' => $managers->perPage(),
                    'current_page' => $managers->currentPage(),
                    'last_page' => $managers->lastPage(),
                    'from' => $managers->firstItem(),
                    'to' => $managers->lastItem()
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching Managers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching Managers: ' . $e->getMessage()
            ], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/manager/pending
    public function pendingManagers(Request $request)
    {
        try {
            // Get the page number and items per page from the request, or use defaults
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 12);

            $managers = Club_Manager::with(['user', 'club'])
                ->whereHas('user', function ($query) {
                    $query->where('is_verified', 0);
                })
                ->paginate($perPage, ['*'], 'page', $page);

            $managersWithDivision = collect($managers->items())->map(function ($manager) {
                $managerDivision = Gs_Division::where('id', $manager->gs_id)->first();
                $clubDivision = Gs_Division::where('id', $manager->club->gs_id)->first();

                return [
                    'managerId' => $manager->id,
                    'firstName' => $manager->firstName,
                    'lastName' => $manager->lastName,
                    'date_of_birth' => $manager->date_of_birth,
                    'address' => $manager->address,
                    'nic' => $manager->nic,
                    'contactNo' => $manager->contactNo,
                    'whatsappNo' => $manager->whatsappNo,
                    'gs_id' => $manager->gs_id,
                    'divisionName' => $managerDivision ? $managerDivision->divisionName : null,
                    'user' => [
                        'user_id' => $manager->user->id,
                        'email' => $manager->user->email,
                        'userName' => $manager->user->userName,
                        'image' => $manager->user->image,
                        "is_verified" => $manager->user->is_verified
                    ],
                    'club' => [
                        'club_id' => $manager->club->id,
                        'clubName' => $manager->club->clubName,
                        'clubDivisionName' => $clubDivision ? $clubDivision->divisionName : null,
                        'clubAddress' => $manager->club->clubAddress,
                        'club_history' => $manager->club->club_history,
                        'clubContactNo' => $manager->club->clubContactNo,
                        'clubImage' => $manager->club->clubImage,
                        "isVerified" => $manager->club->isVerified,
                        'club_gs_id' => $manager->club->gs_id,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $managersWithDivision,
                'pagination' => [
                    'total' => $managers->total(),
                    'per_page' => $managers->perPage(),
                    'current_page' => $managers->currentPage(),
                    'last_page' => $managers->lastPage(),
                    'from' => $managers->firstItem(),
                    'to' => $managers->lastItem()
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching Managers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching Managers: ' . $e->getMessage()
            ], 500);
        }
    }

    // PUT => http://127.0.0.1:8000/api/manager/update/personal/userId
    public function updateManagerDetails(Request $request, $userId)
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
            $manager = Club_Manager::where('user_id', $userId)->firstOrFail();

            // Update Club_Manager details
            if ($request->has('firstName')) {
                $manager->firstName = $request->firstName;
            }
            if ($request->has('lastName')) {
                $manager->lastName = $request->lastName;
            }
            if ($request->has('date_of_birth')) {
                $manager->date_of_birth = $request->date_of_birth;
                // Recalculate age
                $dateOfBirth = Carbon::parse($request->date_of_birth)->startOfDay();
                $today = Carbon::now('UTC')->startOfDay();
                $manager->age = $today->diffInYears($dateOfBirth);
            }
            if ($request->has('address')) {
                $manager->address = $request->address;
            }
            if ($request->has('nic')) {
                $manager->nic = $request->nic;
            }
            if ($request->has('contactNo')) {
                $manager->contactNo = $request->contactNo;
            }
            if ($request->has('whatsappNo')) {
                $manager->whatsappNo = $request->whatsappNo;
            }
            if ($request->has('divisionName')) {
                $gsDivision = Gs_Division::where('divisionName', $request->divisionName)->firstOrFail();
                $manager->gs_id = $gsDivision->id;
            }


            $manager->save();

            // Update User details
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('userName')) {
                $user->userName = $request->userName;
            }
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image) {
                    Storage::delete('public/images/' . $user->image);
                }
                $imagePath = $request->file('image')->store('public/images');
                $user->image = basename($imagePath);
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
                'message' => 'Manager details updated successfully',
                'manager' => $manager,
                'user' => $user->safeAttributes()
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to update manager details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update manager details', 'details' => $e->getMessage()], 500);
        }
    }

    // GET => http://127.0.0.1:8000/api/manager/userId
    public function fetchManagerDetails($userId)
    {
        try {
            $user = User::findOrFail($userId);
            $manager = Club_Manager::where('user_id', $userId)->firstOrFail();

            // Load the club and division relationships
            $manager->load('club', 'gsDivision');

            return response()->json([
                'manager' => [
                    'id' => $manager->id,
                    'firstName' => $manager->firstName,
                    'lastName' => $manager->lastName,
                    'date_of_birth' => $manager->date_of_birth,
                    'age' => $manager->age,
                    'address' => $manager->address,
                    'nic' => $manager->nic,
                    'contactNo' => $manager->contactNo,
                    'whatsappNo' => $manager->whatsappNo,
                    'club' => [
                        'id' => $manager->club->id,
                        'clubName' => $manager->club->clubName,
                        'clubAddress' => $manager->club->clubAddress,
                        'clubContactNo' => $manager->club->clubContactNo,
                        'clubImage' => $manager->club->clubImage,
                        'isVerified' => $manager->club->isVerified,
                    ],
                    'gsDivision' => [
                        'id' => $manager->gsDivision->id,
                        'divisionName' => $manager->gsDivision->divisionName,
                    ],
                ],
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Manager or User not found'], 404);
        } catch (Exception $e) {
            Log::error('Failed to fetch manager details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch manager details', 'details' => $e->getMessage()], 500);
        }
    }
}
