<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key; // Import Key class if you need to specify algorithms
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TokenService
{

    public function generateToken($userId)
    {
        $rawSecret = env('JWT_SECRET');
        $secret = base64_decode($rawSecret);


        $payload = [
            'iss' => 'vsds',
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() + 86400 
        ];

        $token = JWT::encode($payload, $secret, 'HS256');


        return $token;
    }

    public function storeToken($userId, $token)
    {
        $filePath = storage_path('tokens/' . $userId . '.txt');
        file_put_contents($filePath, $token);
    }
}
