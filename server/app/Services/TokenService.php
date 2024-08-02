<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key; // Import Key class if you need to specify algorithms
use Illuminate\Support\Str;

class TokenService
{
    private $secretKey = 'abscd';

    public function generateToken($userId)
    {
        $payload = [
            'iss' => 'vsds',
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() +  86400
        ];


        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function storeToken($userId, $token)
    {
        $filePath = storage_path('tokens/' . $userId . '.txt');
        file_put_contents($filePath, $token);
    }
}
