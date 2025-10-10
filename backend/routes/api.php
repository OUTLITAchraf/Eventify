<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('api')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/events',[EventController::class, 'index']);
    Route::get('/event/{event}', [EventController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/register-participant', [ParticipantController::class, 'store']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user()->load('roles');
        });
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
        Route::post('/create-event', [EventController::class, 'store']);
        Route::put('/update-event/{event}', [EventController::class, 'update']);
        Route::delete('/delete-event/{event}', [EventController::class, 'destroy']);
    });
});
