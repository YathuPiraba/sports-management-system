<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventClub extends Model
{
    use HasFactory;
    protected $fillable = [
        'club_id',
        'event_sports_id',
        'rank',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function eventSport()
    {
        return $this->belongsTo(EventSports::class, 'event_sports_id');
    }

    public function eventParticipants()
    {
        return $this->hasMany(Event_Participants::class);
    }
}
