<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_sport_id',
        'club_id',
        'rank',
    ];

    /**
     * Get the event sport that owns the Ranking.
     */
    public function eventSport()
    {
        return $this->belongsTo(EventSports::class, 'event_sport_id');
    }

    /**
     * Get the club for the ranking.
     */
    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }
}
