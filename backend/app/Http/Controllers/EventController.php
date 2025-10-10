<?php

namespace App\Http\Controllers;

use App\Models\Event;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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
            'category_id' => 'required|exists:categories,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:scheduled,ongoing,completed,cancelled',
            'type' => 'required|in:Online,OnStage',
            'location' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
            'image' => 'required|string|url|max:255',
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
        $event = Event::findOrFail($event->id)->load('organizer', 'category');

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
            'category_id' => 'sometimes|required|exists:categories,id',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'status' => 'sometimes|required|in:scheduled,ongoing,completed,cancelled',
            'type' => 'sometimes|required|in:Online,OnStage',
            'location' => 'sometimes|nullable|string|max:255',
            'link' => 'sometimes|nullable|url|max:255',
            'image' => 'sometimes|nullable|string|url|max:255',
        ]);

        if ($request->has('image') && $event->image) {
            $newImageUrl = $request->input('image');
            $oldImageUrl = $event->image;

            // Delete the old image ONLY if the URL is different (i.e., a new one was uploaded)
            // AND the new value is NOT null (which would be a removal, handled below)
            if ($newImageUrl !== $oldImageUrl && $newImageUrl !== null) {
                try {
                    $publicId = $this->getPublicIdFromUrl($oldImageUrl);
                    if ($publicId) {
                        Cloudinary::destroy($publicId); // 💡 Use the Cloudinary Facade
                    }
                } catch (\Exception $e) {
                    \Log::error("Cloudinary update deletion failed: " . $e->getMessage());
                    // Log the error but proceed with updating the database record
                }
            }
        }

        if ($request->input('image') === null && $event->image) {
            try {
                $publicId = $this->getPublicIdFromUrl($event->image);
                if ($publicId) {
                    Cloudinary::destroy($publicId);
                }
            } catch (\Exception $e) {
                \Log::error("Cloudinary removal deletion failed: " . $e->getMessage());
            }
        }

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

        if ($event->image) {
            try {
                $publicId = $this->getPublicIdFromUrl($event->image);
                if ($publicId) {
                    Cloudinary::destroy($publicId); // 💡 Use the Cloudinary Facade
                }
            } catch (\Exception $e) {
                \Log::error("Cloudinary destruction failed for event {$event->id}: " . $e->getMessage());
                // Log the error but proceed with database deletion
            }
        }

        $event->delete();

        return response()->json([
            'message' => 'Event Deleted Successfully'
        ], 201);
    }

    // --- 💡 HELPER FUNCTION FOR PUBLIC ID EXTRACTION ---
    /**
     * Extracts the Public ID from a full Cloudinary URL.
     * @param string $url The Cloudinary image URL.
     * @return string|null The Cloudinary Public ID.
     */
    private function getPublicIdFromUrl(string $url): ?string
    {
        // Cloudinary URLs are typically: .../v<version>/public_id.ext
        // We look for the path component after 'upload/'
        $url_parts = explode('/upload/', $url);
        if (count($url_parts) < 2) {
            return null; // Not a standard Cloudinary URL
        }

        // Get the part after '/upload/' which includes the version and public ID
        $path_with_version = $url_parts[1];

        // Remove the version segment (vXXXXXXXXXX/)
        $path_without_version = preg_replace('/v\d+\//', '', $path_with_version, 1);

        // Remove the file extension (e.g., .jpg, .png)
        $public_id = pathinfo($path_without_version, PATHINFO_FILENAME);

        // If the public ID includes folder paths (e.g., 'events/my-event-image'), 
        // the public ID returned by Cloudinary is the full path.
        // The above pathinfo logic is for simple IDs. For robustness, if you use folders:

        // 1. Find the index of the version segment (e.g., 'v1678888888')
        $path_segments = explode('/', parse_url($url, PHP_URL_PATH));
        $version_index = array_search(
            current(preg_grep('/^v\d+$/', $path_segments)),
            $path_segments
        );

        if ($version_index !== false && isset($path_segments[$version_index + 1])) {
            // Get all segments from the one after the version number to the end
            $public_id_parts = array_slice($path_segments, $version_index + 1);

            // Join them back with '/', and remove the file extension from the last part
            $last_part = array_pop($public_id_parts);
            $last_part_no_ext = pathinfo($last_part, PATHINFO_FILENAME);
            $public_id_parts[] = $last_part_no_ext;

            return implode('/', $public_id_parts);
        }

        return pathinfo($path_without_version, PATHINFO_FILENAME);
    }

}
