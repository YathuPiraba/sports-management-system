<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TokenService
{

    private $accessTokenExpiry = 900; // 15 minutes
    private $refreshTokenExpiry = 604800; // 1 week

    public function generateAccessToken($userId)
    {
        $rawSecret = env('JWT_ACCESS_SECRET');

        $secret = base64_decode($rawSecret);

        $payload = [
            'iss' => 'vsds',
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() + $this->accessTokenExpiry
        ];

        $token = JWT::encode($payload, $secret, 'HS256');
        Log::info('Generated token: ' . $token);

        return $token;
    }

    public function generateRefreshToken($userId)
    {
        $rawSecret = env('JWT_REFRESH_SECRET');
        $secret = base64_decode($rawSecret);

        $payload = [
            'iss' => 'vsds',
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() + $this->refreshTokenExpiry
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    public function verifyToken($token, $type = 'access')
    {
        $rawSecret = $type === 'access' ? env('JWT_ACCESS_SECRET') : env('JWT_REFRESH_SECRET');
        $secret = base64_decode($rawSecret);

        if (empty($secret)) {
            Log::error('Secret is empty!');
            return false;
        }
        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            Log::info('Token decoded successfully. Payload: ' . json_encode($decoded));
            return $decoded->sub;
        } catch (\Exception $e) {
            Log::error('Token validation error: ' . $e->getMessage());
            Log::error('Token being validated: ' . $token);
            return false;
        }
    }

    public function setRefreshTokenCookie($token)
    {
        return Cookie::make(
            'refresh_token',              // Cookie name
            $token,                       // Token value
            $this->refreshTokenExpiry / 60, // Expiry time in minutes
            '/',                          // Path, making the cookie available site-wide
            null,                         // Domain (null defaults to current domain)
            false,                        // Secure (set to true in production for HTTPS)
            true,                         // HttpOnly (prevents client-side access to the cookie)
            false,                        // Raw (leave as false)
            'Lax'                         // SameSite policy, 'Lax' is more permissive than 'Strict'
        );
    }
}
