<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\TokenService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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

    public function getUserDetails(Request $request)
{
    $user = $request->user;

    if ($user) {
        return response()->json([
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
}
