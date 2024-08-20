<?php

namespace App\Events;

use App\Models\Member;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MemberApplied implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $member;
    public $managerUserId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Member $member, $managerUserId)
    {
        $this->member = $member;
        $this->managerUserId = $managerUserId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return ['members'];
    }

    public function broadcastAs()
    {
        return 'MemberApplied';
    }
}
