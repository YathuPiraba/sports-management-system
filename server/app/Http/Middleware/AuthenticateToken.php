<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class AuthenticateToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if (!$token) {
            return response()->json(['message' => 'Token is required'], 401);
        }

        $userId = $this->getUserIdFromToken($token);

        if (!$userId) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        // Optionally, you can retrieve user from the database here
        // $user = User::find($userId);

        return $next($request);
    }

    protected function getUserIdFromToken($token)
    {
        // Check the token in the storage directory
        $files = File::files(storage_path('tokens'));

        foreach ($files as $file) {
            $storedToken = file_get_contents($file->getPathname());
            if (trim($storedToken) === $token) {
                return basename($file->getPathname(), '.txt');
            }
        }

        return null;
    }
}
