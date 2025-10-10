<?php

namespace App\Http\Controllers;

use App\Mail\EventRegistrationConfirmation;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

        if (
            Participant::where('email', $validated['email'])
                ->where('event_id', $validated['event_id'])
                ->exists()
        ) {
            return response()->json([
                'message' => 'This email is already registered for this event.'
            ], 409);
        }

        $event = Event::findOrFail($validated['event_id']);
        $participant = Participant::create($validated);

        try {
            Mail::to($participant->email)
                ->send(new EventRegistrationConfirmation($participant, $event));
        } catch (\Exception $e) {
            // Log the error but don't fail the registration because of email
            \Log::error('Failed to send registration email to ' . $participant->email . ': ' . $e->getMessage());
            // You can optionally return a different message or log the error.
        }

        return response()->json([
            'message' => 'Registration successful! See you at the event.',
            'participant' => $participant
        ], 201);
    }
}
