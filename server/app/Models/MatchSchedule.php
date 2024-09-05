<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_sport_id',
        'club_1_id',
        'club_2_id',
        'match_date',
        'match_time',
        'venue',
    ];

    /**
     * Get the event sport that owns the MatchSchedule.
     */
    public function eventSport()
    {
        return $this->belongsTo(EventSports::class, 'event_sport_id');
    }

    /**
     * Get the first club participating in the match.
     */
    public function club1()
    {
        return $this->belongsTo(Club::class, 'club_1_id');
    }

    /**
     * Get the second club participating in the match.
     */
    public function club2()
    {
        return $this->belongsTo(Club::class, 'club_2_id');
    }
}
