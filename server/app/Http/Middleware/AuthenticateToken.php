<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
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
            // Decode the JWT token
            $payload = JWT::decode($token, env('JWT_SECRET'), ['HS256']);

            // Ensure the payload is a stdClass object
            if (!is_object($payload)) {
                throw new \UnexpectedValueException('Invalid token payload');
            }

            // Extract user ID from the payload (e.g., sub claim)
            $userId = $payload->sub;

            // Find the user by ID
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 401);
            }

            // Optionally, you can set the user in the request for further use
            $request->attributes->set('user', $user);

        } catch (ExpiredException $e) {
            return response()->json(['message' => 'Token has expired'], 401);
        } catch (SignatureInvalidException $e) {
            return response()->json(['message' => 'Invalid token signature'], 401);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['message' => 'Invalid token payload'], 401);
        } catch (\Exception $e) {
            Log::error('Token validation error: ' . $e->getMessage());
            return response()->json(['message' => 'Invalid token'], 401);
        }

        return $next($request);
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
