<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\TokenService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }


    //POST => http://127.0.0.1:8000/api/login
    public function login(Request $request)
    {
        $request->validate([
            'userName' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('userName', $request->userName)->first();

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

    //GET => http://127.0.0.1:8000/api//user/details
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
            $user->password = Hash::make($request->password);
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {

            if ($user->image) {
                $oldImagePath = 'public/images/' . $user->image;

                if (Storage::exists($oldImagePath)) {

                    Storage::delete($oldImagePath);
                } else {
                    Log::warning('Old image not found for deletion', ['path' => $oldImagePath]);
                }
            }

            $imagePath = $request->file('image')->store('public/images');
            $user->image = basename($imagePath);
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
}
