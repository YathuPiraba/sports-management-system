<?php

namespace App\Events;

use App\Models\Club_Manager;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ManagerApplied implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $manager;

    public function __construct(Club_Manager $manager)
    {
        $this->manager = $manager;
        Log::info('ManagerApplied event fired.', ['manager' => $manager]);
    }

    public function broadcastOn()
    {
        Log::info('ManagerApplied event broadcast on channel.', ['manager' => $this->manager]);
        return new Channel('managers');
    }

    public function broadcastAs()
    {
        return 'ManagerApplied';
    }
}
