<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'user_id',
        'event_id',
        'status',
    ];

    /**
     * Get the user that owns the Notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the event related to the Notification.
     */
    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }
}
