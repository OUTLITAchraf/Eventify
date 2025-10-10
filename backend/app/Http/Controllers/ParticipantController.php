<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => 'required|string',
                'email' => 'required|string',
                'event_id' => 'required|exists:events,id'
            ]
        );

        if (Participant::where('email', $validated['email'])
                        ->where('event_id', $validated['event_id'])
                        ->exists()) {
            return response()->json([
                'message' => 'This email is already registered for this event.'
            ], 409);
        }

        $participant = Participant::create($validated);

        return response()->json([
            'message' => 'Registration successful! See you at the event.',
            'participant' => $participant
        ], 201);
    }
}
