<?php

namespace App\Services;

use Illuminate\Support\Str;

class TokenService
{
    public function generateToken()
    {
        // Generate a new token
        return Str::random(60);
    }

    public function storeToken($userId, $token)
    {
        // Store the token in a file (or use database storage)
        $filePath = storage_path('tokens/' . $userId . '.txt');
        file_put_contents($filePath, $token);
    }
}
