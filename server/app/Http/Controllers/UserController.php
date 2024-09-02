<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\TokenService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Cloudinary\Cloudinary;


class UserController extends Controller
{
    protected $tokenService;
    protected $cloudinary;

    public function __construct(TokenService $tokenService, Cloudinary $cloudinary)
    {
        $this->tokenService = $tokenService;
        $this->cloudinary = $cloudinary;
    }

    public function uploadImage(Request $request)
    {
        $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());

        $imageUrl = $result['secure_url'];

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image_url' => $imageUrl,
        ], 200);
    }


    //POST => http://127.0.0.1:8000/api/login
    public function login(Request $request)
    {
        $request->validate([
            'userName' => 'required|string',
            'password' => 'required|string',
        ]);

        // Retrieve user including soft-deleted users
        $user = User::withTrashed()->where('userName', $request->userName)->first();

        // Check if the user is soft-deleted
        if ($user && $user->trashed()) {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact your Club Manager.',
            ], 403);
        }

        if ($user && Hash::check($request->password, $user->password)) {

            // Generate and store a token
            $token = $this->tokenService->generateToken($user->id);
            $this->tokenService->storeToken($user->id, $token);


            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }
    }

    //POST => http://127.0.0.1:8000/api/logout
    public function logout(Request $request)
    {

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    //GET => http://127.0.0.1:8000/api/user/details
    public function getUserDetails(Request $request)
    {
        $user = $request->user;

        if ($user) {

            return response()->json([
                'userId' => $user->id,
                'userName' => $user->userName,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'is_verified' => $user->is_verified,
                'image' => $user->image,
            ], 200);
        } else {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    // PUT => http://127.0.0.1:8000/api/user/admin-update/{id}
    public function updateAdminDetails(Request $request, $id)
    {
        // Fetch the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $request->validate([
            'userName' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,avif,svg|max:2048',
            'password' => 'sometimes|string',
            'currentPassword' => 'required_with:password|string',
        ]);

        // Update userName and email if provided
        if ($request->has('userName')) {
            $user->userName = $request->userName;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
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

        // Handle image upload if provided
        if ($request->hasFile('image')) {

            if ($user->image) {
                // Optionally delete the old image from Cloudinary
                $this->cloudinary->uploadApi()->destroy($user->image);
            }

            $result = $this->cloudinary->uploadApi()->upload($request->file('image')->getRealPath());
            $user->image = $result['secure_url'];
        }

        // Save the updated user information
        $user->save();


        return response()->json([
            'message' => 'User details updated successfully',
            'user' => [
                'userId' => $user->id,
                'userName' => $user->userName,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'is_verified' => $user->is_verified,
                'image' =>  $user->image,
            ],
        ], 200);
    }

    public function deactivateUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Soft delete the user
        $user->delete();

        return response()->json([
            'message' => 'User successfully soft deleted'
        ], 200);
    }

    public function restoreUser($id)
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $user->restore();

        return response()->json([
            'message' => 'User successfully restored'
        ], 200);
    }
}
