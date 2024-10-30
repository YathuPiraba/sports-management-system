<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class TokenService
{

    private $accessTokenExpiry = 900; // 15 minutes
    private $refreshTokenExpiry = 604800; // 1 week
    private $redisPrefix = 'refresh_token:';

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

    public function storeRefreshToken($sessionId, $refreshToken, $userId)
    {
        $key = $this->redisPrefix . $sessionId;
        $data = [
            'token' => $refreshToken,
            'user_id' => $userId
        ];

        Redis::setex($key, $this->refreshTokenExpiry, json_encode($data));
        Log::info('Stored refresh token in Redis for session: ' . $sessionId);
    }

    public function getRefreshTokenFromSession($sessionId)
    {
        $key = $this->redisPrefix . $sessionId;
        $data = Redis::get($key);

        if (!$data) {
            return null;
        }

        $decoded = json_decode($data, true);
        return $decoded['token'] ?? null;
    }

    public function removeRefreshToken($sessionId)
    {
        $key = $this->redisPrefix . $sessionId;
        Redis::del($key);
        Log::info('Removed refresh token from Redis for session: ' . $sessionId);
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

    public function setRefreshTokenCookie($sessionId)
    {
        return Cookie::make(
            'refresh_token',           // Cookie name
            $sessionId,                // Session ID value
            $this->refreshTokenExpiry / 60, // Expiry time in minutes
            '/',                       // Path
            null,                      // Domain
            env('SECURE_COOKIE', true), // Secure
            true,                      // HttpOnly
            false,                     // Raw
            env('SAME_SITE', 'None')   // SameSite
        );
    }
}
