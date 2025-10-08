<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();

        return response()->json([
            'message' => 'Events Fetched Successfully',
            'events' => $events
        ], 201);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticted'], 401);
        }

        if (!$user->hasRole('organizer')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:scheduled,ongoing,completed',
            'type' => 'required|in:Online,OnStage',
            'location' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $event = new Event($validated);
        $event->organizer_id = $user->id;
        $event->save();

        return response()->json([
            'message' => 'Event Created Successfully',
            'event' => $event
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event = Event::findOrFail($event->id)->load('organizer');

        return response()->json([
            'message' => 'Event Fetched Successfully',
            'event' => $event
        ], 201);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticted'], 401);
        }

        if (!$user->hasRole('organizer')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = Event::findOrFail($event->id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'status' => 'sometimes|required|in:scheduled,ongoing,completed',
            'type' => 'sometimes|required|in:Online,On Stage',
            'location' => 'sometimes|nullable|string|max:255',
            'link' => 'sometimes|nullable|url|max:255',
            'image' => 'sometimes|nullable|string|max:255',
        ]);

        $event->update(attributes: $validated);

        return response()->json([
            'message' => 'Event Updated Sucessfully',
            'event' => $event
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticted'], 401);
        }

        if (!$user->hasRole('organizer')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event Deleted Successfully'
        ], 201);
    }
}
