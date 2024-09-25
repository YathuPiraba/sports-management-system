<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class AuthenticateToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json(['message' => 'Token is required'], 401);
        }

        try {
            $rawSecret = env('JWT_ACCESS_SECRET');
            $secret = base64_decode($rawSecret);


            $payload = JWT::decode($token, new Key($secret, 'HS256'));


            $user = User::findOrFail($payload->sub);
            $request->merge(['user' => $user]);
            return $next($request);
        } catch (\Exception $e) {
            Log::error('Token validation error: ' . $e->getMessage());
            Log::error('Exception trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Invalid token'], 401);
        }
    }

    protected function extractToken(Request $request)
    {
        $header = $request->header('Authorization');
        if ($header && preg_match('/^Bearer\s(\S+)$/', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
