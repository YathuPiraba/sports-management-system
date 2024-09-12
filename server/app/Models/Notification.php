<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_id',
        'event_sports_id',
        'club_id',
        'type',
        'content',
        'is_read',
    ];

    /**
     * Get the recipient (user) that owns the Notification.
     */
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the event sport related to the Notification.
     */
    public function eventSport()
    {
        return $this->belongsTo(EventSports::class, 'event_sports_id');
    }

    /**
     * Get the club related to the Notification.
     */
    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }
}
