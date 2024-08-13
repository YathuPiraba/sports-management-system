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
    public $clubName;

    public function __construct(Club_Manager $manager, $clubName)
    {
        $this->manager = $manager;
        $this->clubName = $clubName;
    }

    public function broadcastOn()
    {
        return ['managers'];
    }

    public function broadcastAs()
    {
        return 'ManagerApplied';
    }
}
