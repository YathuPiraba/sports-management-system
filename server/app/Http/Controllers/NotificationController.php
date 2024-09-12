<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    /**
     * Create a new notification.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'event_id' => 'sometimes|nullable|exists:events,id',
            'status' => 'required|in:unread,read',
        ]);

        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'user_id' => $request->user_id,
            'event_id' => $request->event_id,
            'status' => $request->status,
        ]);

        return response()->json($notification, Response::HTTP_CREATED);
    }

    /**
     * Get all notifications for a specific user.
     *
     * @param int $userId
     * @return \Illuminate\Http\Response
     */
    public function index($userId)
    {
        $notifications = Notification::where('user_id', $userId)->get();
        return response()->json($notifications);
    }

    /**
     * Get a specific notification.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $notification = Notification::findOrFail($id);
        return response()->json($notification);
    }

    /**
     * Update a specific notification.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'user_id' => 'sometimes|required|exists:users,id',
            'event_id' => 'sometimes|nullable|exists:events,id',
            'status' => 'sometimes|required|in:unread,read',
        ]);

        $notification = Notification::findOrFail($id);
        $notification->update($request->all());

        return response()->json($notification);
    }

    /**
     * Delete a specific notification.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    // Get all unread notifications
    public function getUnreadNotifications()
    {
        $notifications = Notification::where('is_read', false)->with(['eventSport', 'club'])->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ], 200);
    }

    // Mark a notification as read
    public function markAsRead($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->is_read = true;
            $notification->save();

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error marking notification as read: ' . $e->getMessage(),
            ], 500);
        }
    }
}
