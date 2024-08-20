<?php

use App\Http\Controllers\ClubController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\GsDivisionController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PasswordResetController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/logout', [UserController::class, 'logout']);


Route::middleware('auth.token')->group(function () {
    Route::get('/details', [UserController::class, 'getUserDetails']);
    Route::put('/user/admin-update/{id}', [UserController::class, 'updateAdminDetails']);

    Route::post('/clubs/create', [ClubController::class, 'clubCreate']);
    Route::delete('clubs/{id}', [ClubController::class, 'clubDelete']);

    Route::post('/manager/create', [ManagerController::class, 'managerCreate']);
    Route::get('/manager/list', [ManagerController::class, 'getAllManagers']);
    Route::get('/manager/query', [ManagerController::class, 'queryManagers']);
    Route::put('/manager/update/personal/{userId}', [ManagerController::class, 'updateManagerDetails']);
    Route::delete('/manager/deleteManager/{user_id}', [ManagerController::class, 'deleteManager']);
    Route::get('/manager/{userId}', [ManagerController::class, 'fetchManagerDetails']);
    Route::get('/pending', [ManagerController::class, 'pendingManagers']);

    Route::put('/manager/update-verification/{managerId}', [ManagerController::class, 'updateVerificationStatus']);
    Route::delete('manager/reject/{club_id}/{user_id}', [ManagerController::class, 'requestDelete']);
});


Route::post('/member/apply', [MemberController::class, 'memberApply']);
Route::get('/pendingMembers', [MemberController::class, 'pendingMembers']);
Route::post('/manager/apply', [ManagerController::class, 'managerApply']);
Route::get('/gs-divisions/list', [GsDivisionController::class, 'getAllGsDivisions']);

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/verify-otp', [PasswordResetController::class, 'verifyOTP']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
