<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event_participants extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'member_sports_id',
        'participatedDate',
        'place',
    ];

    // Relationships
    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }

    public function memberSport()
    {
        return $this->belongsTo(Member_Sports::class, 'member_sports_id');
    }
}
