<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\TokenService;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

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
                'user' => $user,
                'token' => $token,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }
    }

    public function logout(Request $request)
    {

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }
}
