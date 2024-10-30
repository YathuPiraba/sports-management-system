<?php

namespace App\Http\Controllers;

use App\Events\userDeactivation;
use App\Events\UserRejected;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\TokenService;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Cloudinary\Cloudinary;
use App\Events\UserVerified;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

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
            $accessToken = $this->tokenService->generateAccessToken($user->id);
            $refreshToken = $this->tokenService->generateRefreshToken($user->id);
            $sessionId = Str::uuid()->toString();

            $this->tokenService->storeRefreshToken($sessionId, $refreshToken, $user->id);

            $response = response()->json([
                'message' => 'Login successful',
                'access_token' => $accessToken,
                'session_id' => $sessionId
            ], 200);

            return $response->withCookie($this->tokenService->setRefreshTokenCookie($sessionId));
        } else {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }
    }

    //POST => http://127.0.0.1:8000/api/logout
    public function logout(Request $request)
    {
        $sessionId = $request->cookie('refresh_token');

        if ($sessionId) {
            $this->tokenService->removeRefreshToken($sessionId);
        }

        return response()->json(['message' => 'Logged out successfully'])
            ->withCookie(Cookie::forget('refresh_token'));
    }


    public function refresh(Request $request)
    {
        $sessionId = $request->cookie('refresh_token');

        if (!$sessionId) {
            return response()->json([
                'message' => 'No refresh token provided',
                'code' => 'NO_REFRESH_TOKEN'
            ], 401);
        }

        $refreshToken = $this->tokenService->getRefreshTokenFromSession($sessionId);

        if (!$refreshToken) {
            return response()->json([
                'message' => 'Invalid session',
                'code' => 'INVALID_SESSION'
            ], 401);
        }

        try {
            $userId = $this->tokenService->verifyToken($refreshToken, 'refresh');

            if (!$userId) {
                return response()->json([
                    'message' => 'Invalid refresh token',
                    'code' => 'INVALID_REFRESH_TOKEN'
                ], 401);
            }

            $newAccessToken = $this->tokenService->generateAccessToken($userId);

            return response()->json([
                'message' => 'Token refreshed successfully',
                'access_token' => $newAccessToken
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh error in controller: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to refresh token',
                'code' => 'REFRESH_FAILED'
            ], 401);
        }
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
                'deleted_at' => $user->deleted_at,
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

        $user_id =  $user->id;

        event(new userDeactivation($user_id));
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

        $user_id =  $user->id;

        event(new UserVerified($user_id));

        $user->restore();

        return response()->json([
            'message' => 'User successfully restored'
        ], 200);
    }

    public function deleteImage($id)
    {
        // Fetch the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Check if the user has an image
        if (!$user->image) {
            return response()->json([
                'message' => 'No image to delete'
            ], 400);
        }

        // Delete the image from Cloudinary (or any other service you're using)
        try {
            $this->cloudinary->uploadApi()->destroy($user->image);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete image',
                'error' => $e->getMessage(),
            ], 500);
        }

        // Set image field to null
        $user->image = null;
        $user->save();

        return response()->json([
            'message' => 'Image deleted successfully'
        ], 200);
    }
}
