<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventApplied implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    /**
     * Create a new event instance.
     *
     * @param array $notification
     * @return void
     */
    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Use a private channel, e.g., for an admin or a specific user
        return ['notifications'];
    }

    /**
     * Data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'notification' => $this->notification,
        ];
    }

    public function broadcastAs()
    {
        return 'Notifications';
    }
}
