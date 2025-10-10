<x-mail::message>
# Registration Confirmed! 🎉

Dear {{ $participant->name }},

We're excited to confirm your successful registration for the event **{{ $event->name }}**!

Here are your event details:

| Detail | Value |
| :--- | :--- |
| **Event Name** | {{ $event->name }} |
| **Date** | {{ \Carbon\Carbon::parse($event->start_time)->format('F jS, Y') }} |
| **Time** | {{ \Carbon\Carbon::parse($event->start_time)->format('g:i A') }} - {{ \Carbon\Carbon::parse($event->end_time)->format('g:i A') }} |
| **Type Event** | {{ $event->type === 'OnStage' ? $event->location : 'Online Event' }} |

<x-mail::button :url="config('app.frontend_url') . '/event/' . $event->id">
View Event Details
</x-mail::button>

We look forward to seeing you there!

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>