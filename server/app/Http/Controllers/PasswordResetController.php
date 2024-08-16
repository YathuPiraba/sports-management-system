<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    //POST => http://127.0.0.1:8000/api/forgot-password
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $user = User::where('email', $request->email)->first();
        $otp = mt_rand(100000, 999999);

        $user->update([
            'password_reset_token' => $otp,
            'password_reset_expires_at' => now()->addMinutes(10),
        ]);

        // Send OTP via email
        Mail::send('emails.otp', [
            'otp' => $otp,
            'name' => $user->userName 
        ], function ($message) use ($user) {
            $message->to($user->email)->subject('Password Reset OTP');
        });

        return response()->json(['message' => 'OTP sent to your email']);
    }

    //POST => http://127.0.0.1:8000/api/verify-otp
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
            ->where('password_reset_token', $request->otp)
            ->where('password_reset_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        return response()->json(['message' => 'OTP verified successfully']);
    }

    //POST => http://127.0.0.1:8000/api/reset-password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'otp' => 'required|string',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::where('email', $request->email)
            ->where('password_reset_token', $request->otp)
            ->where('password_reset_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_expires_at' => null,
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }
}
