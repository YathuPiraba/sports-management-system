<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event_Participants extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_clubs_id',
        'member_sports_id',
        'participatedDate',
        'rank',
    ];

    public function eventClub()
    {
        return $this->belongsTo(EventClub::class, 'event_clubs_id');
    }

    public function memberSport()
    {
        return $this->belongsTo(Member_Sports::class, 'member_sports_id');
    }
}
