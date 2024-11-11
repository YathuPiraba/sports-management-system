<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchSchedule extends Model  // Rename the class to SportMatch
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'event_sports_id',
        'home_club_id',
        'away_club_id',
        'match_date',
        'time',
    ];

    /**
     * Get the event sport associated with the match.
     */
    public function eventSport()
    {
        return $this->belongsTo(EventSports::class, 'event_sports_id');
    }

    /**
     * Get the home club associated with the match.
     */
    public function homeClub()
    {
        return $this->belongsTo(Club::class, 'home_club_id');
    }

    /**
     * Get the away club associated with the match.
     */
    public function awayClub()
    {
        return $this->belongsTo(Club::class, 'away_club_id');
    }
}
