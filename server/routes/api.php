<?php

use App\Http\Controllers\ClubController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\GsDivisionController;
use App\Http\Controllers\ManagerController;

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
    Route::get('/user/details', [UserController::class, 'getUserDetails']);

    Route::post('/clubs/create', [ClubController::class, 'clubCreate']);
    Route::delete('clubs/{id}', [ClubController::class, 'clubDelete']);

    Route::post('/manager/create', [ManagerController::class, 'managerCreate']);
    Route::get('/manager/list', [ManagerController::class, 'getAllManagers']);

    Route::delete('manager/deleteManager/{user_id}', [ManagerController::class, 'deleteManager']);
    Route::get('/gs-divisions/list', [GsDivisionController::class, 'getAllGsDivisions']);


    Route::put('/manager/update-verification/{managerId}', [ManagerController::class, 'updateVerificationStatus']);
    Route::delete('manager/reject/{club_id}/{user_id}', [ManagerController::class, 'requestDelete']);
});

Route::post('/manager/apply', [ManagerController::class, 'managerApply']);
