<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_schedule_id',
        'winner_club_id',
        'score_club_1',
        'score_club_2',
    ];

    /**
     * Get the match schedule that owns the MatchResult.
     */
    public function matchSchedule()
    {
        return $this->belongsTo(MatchSchedule::class, 'match_schedule_id');
    }

    /**
     * Get the club that won the match.
     */
    public function winnerClub()
    {
        return $this->belongsTo(Club::class, 'winner_club_id');
    }
}