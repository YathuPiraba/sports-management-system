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
use App\Services\TokenService;

class AuthenticateToken
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function handle(Request $request, Closure $next)
    {
        if ($request->route()->getName() === 'token.refresh') {
            return $next($request);
        }

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

 protected function handleExpiredToken(Request $request, Closure $next)
    {
        try {
            $sessionId = $request->cookie('refresh_token');

            if (!$sessionId) {
                Log::error('No refresh token cookie found');
                return response()->json([
                    'message' => 'Session expired',
                    'code' => 'TOKEN_EXPIRED'
                ], 401);
            }

            $refreshToken = $this->tokenService->getRefreshTokenFromSession($sessionId);

            if (!$refreshToken) {
                Log::error('No refresh token found in Redis for session: ' . $sessionId);
                return response()->json([
                    'message' => 'Session invalid',
                    'code' => 'INVALID_SESSION'
                ], 401);
            }

            $userId = $this->tokenService->verifyToken($refreshToken, 'refresh');

            if (!$userId) {
                Log::error('Invalid refresh token for session: ' . $sessionId);
                return response()->json([
                    'message' => 'Invalid refresh token',
                    'code' => 'INVALID_REFRESH_TOKEN'
                ], 401);
            }

            $newAccessToken = $this->tokenService->generateAccessToken($userId);
            $user = User::findOrFail($userId);
            $request->merge(['user' => $user]);

            $response = $next($request);
            $response->headers->set('New-Access-Token', $newAccessToken);
            Log::info('Successfully refreshed access token for user: ' . $userId);

            return $response;

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
            Log::error('Exception trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Failed to refresh token',
                'code' => 'REFRESH_FAILED'
            ], 401);
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
