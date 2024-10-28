<?php

use App\Http\Controllers\ClubController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\GsDivisionController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SportsArenaController;
use App\Http\Controllers\SportsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventParticipantController;
use App\Http\Controllers\EventSportController;
use App\Http\Controllers\MatchResultController;
use App\Http\Controllers\MatchScheduleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RankingController;

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
Route::post('/refresh', [UserController::class, 'refresh']);
Route::delete('/image/{id}', [UserController::class, 'deleteImage']);

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

    Route::get('/pendingMembers', [MemberController::class, 'pendingMembers']);
    Route::delete('/deleteMember/{memberId}', [MemberController::class, 'deleteMember']);
    Route::put('/verifyMember/{memberId}', [MemberController::class, 'verifyMember']);

    Route::delete('/user/{id}', [UserController::class, 'deactivateUser']);
    Route::patch('/user/{id}/restore', [UserController::class, 'restoreUser']);
});

Route::put('/club/{id}', [ClubController::class, 'clubUpdate']);


Route::get('/download-club-details/{id}', [ClubController::class, 'downloadDetails']);

Route::get('/clubs/list', [ClubController::class, 'getAllClubs']);
Route::get('/clubs/details', [ClubController::class, 'getAllClubsDetails']);

Route::get('/sports/list', [SportsController::class, 'getSports']);
Route::post('/sports/create', [SportsController::class, 'createSports']);
Route::put('/sport/{id}', [SportsController::class, 'updateSports']);
Route::delete('/sport/{id}', [SportsController::class, 'deleteSports']);
Route::get('/sports/counts', [SportsController::class, 'getTotalCounts']);

Route::get('/clubs-sports/list', [ClubController::class, 'getAllClubSports']);
Route::post('/clubs-sports/create', [ClubController::class, 'createClubSports']);
Route::get('/clubs-sports/one', [ClubController::class, 'getAClubSports']);
Route::delete('/club-sports', [ClubController::class, 'deleteClubSports']);
Route::put('/club-sports/{clubId}', [ClubController::class, 'updateClubSports']);

Route::get('/club-details', [ClubController::class, 'getClubsByUserId']);

Route::get('/skills/by-sport', [SportsController::class, 'getSkillsBySport']);

Route::post('/member/apply', [MemberController::class, 'memberApply']);
Route::post('/manager/apply', [ManagerController::class, 'managerApply']);
Route::get('/gs-divisions/list', [GsDivisionController::class, 'getAllGsDivisions']);

Route::get('/membersList', [MemberController::class, 'membersList']);
Route::get('/queryMembers', [MemberController::class, 'queryMembers']);
Route::get('/memberDetails/{memberId}', [MemberController::class, 'getMemberDetails']);
Route::get('/membersBySport', [MemberController::class, 'membersBySport']);

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/verify-otp', [PasswordResetController::class, 'verifyOTP']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::prefix('sports-arenas')->group(function () {

    // Update a sports arena by ID
    Route::put('/{id}', [SportsArenaController::class, 'updateSportsArena']);

    // Get all sports arenas based on a club ID
    Route::get('/club/{clubId}', [SportsArenaController::class, 'getSportsArenasByClub']);
});

// Get all sports arenas
Route::get('/arena/list', [SportsArenaController::class, 'getAllSportsArenas']);
Route::get('/arena/sports/{clubId}/{arenaId}', [SportsArenaController::class, 'getSportsBySportsArena']);

Route::delete('/arena/{clubId}/{arenaId}', [SportsArenaController::class, 'deleteSportsArena']);

Route::prefix('events')->group(function () {
    Route::get('/', [EventController::class, 'index']); // Get all events
    Route::post('/', [EventController::class, 'store']); // Create a new event
    Route::get('/{id}', [EventController::class, 'show']); // Get a specific event
    Route::put('/{id}', [EventController::class, 'update']); // Update a specific event
    Route::delete('/{id}', [EventController::class, 'destroy']); // Delete a specific event
});

Route::post('/addEventParticipants', [EventParticipantController::class, 'addEventParticipants']);
Route::get('/getEventParticipants/{eventId}', [EventParticipantController::class, 'getEventParticipants']);
Route::get('/getSpecificEventParticipants', [EventParticipantController::class, 'getSpecificEventParticipants']);
Route::get('/download-eventsports-details/{eventSportsId}', [EventParticipantController::class, 'generateEventParticipantsPDF']);

Route::prefix('events/{eventId}/sports')->group(function () {
    Route::post('/', [EventSportController::class, 'store']); // Add a new sport to an event
    Route::get('/', [EventSportController::class, 'index']); // Get all sports for a specific event
    Route::get('/{id}', [EventSportController::class, 'show']); // Get a specific sport for a specific event
    Route::put('/{id}', [EventSportController::class, 'update']); // Update a specific sport in an event
    Route::delete('/{id}', [EventSportController::class, 'destroy']); // Delete a specific sport from an event
});

Route::get('/notifications', [NotificationController::class, 'getUnreadNotifications']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

Route::prefix('event-clubs/{eventClubId}/participants')->group(function () {
    Route::post('/', [EventParticipantController::class, 'store']); // Add a new participant to an event club
    Route::get('/', [EventParticipantController::class, 'index']); // Get all participants for a specific event club
    Route::get('/{id}', [EventParticipantController::class, 'show']); // Get a specific participant
    Route::put('/{id}', [EventParticipantController::class, 'update']); // Update a specific participant
    Route::delete('/{id}', [EventParticipantController::class, 'destroy']); // Delete a specific participant
});

Route::prefix('event-sports/{eventSportId}/matches')->group(function () {
    Route::post('/', [MatchScheduleController::class, 'store']); // Create a new match schedule
    Route::get('/', [MatchScheduleController::class, 'index']); // Get all matches for a specific event sport
    Route::get('/{id}', [MatchScheduleController::class, 'show']); // Get a specific match
    Route::put('/{id}', [MatchScheduleController::class, 'update']); // Update a specific match schedule
    Route::delete('/{id}', [MatchScheduleController::class, 'destroy']); // Delete a specific match schedule
});

Route::prefix('matches/{matchScheduleId}/results')->group(function () {
    Route::post('/', [MatchResultController::class, 'store']); // Create a new match result
    Route::get('/', [MatchResultController::class, 'index']); // Get all results for a specific match schedule
    Route::get('/{id}', [MatchResultController::class, 'show']); // Get a specific match result
    Route::put('/{id}', [MatchResultController::class, 'update']); // Update a specific match result
    Route::delete('/{id}', [MatchResultController::class, 'destroy']); // Delete a specific match result
});

Route::prefix('event-sports/{eventSportId}/rankings')->group(function () {
    Route::post('/', [RankingController::class, 'store']); // Create or update a ranking
    Route::get('/', [RankingController::class, 'index']); // Get all rankings for a specific event sport
    Route::get('/{clubId}', [RankingController::class, 'show']); // Get a specific ranking
    Route::put('/{clubId}', [RankingController::class, 'update']); // Update a specific ranking
    Route::delete('/{clubId}', [RankingController::class, 'destroy']); // Delete a specific ranking
});


Route::prefix('users/{userId}/notifications')->group(function () {
    Route::post('/', [NotificationController::class, 'store']); // Create a new notification
    Route::get('/', [NotificationController::class, 'index']); // Get all notifications for a specific user
    Route::get('/{id}', [NotificationController::class, 'show']); // Get a specific notification
    Route::put('/{id}', [NotificationController::class, 'update']); // Update a specific notification
    Route::delete('/{id}', [NotificationController::class, 'destroy']); // Delete a specific notification
});
