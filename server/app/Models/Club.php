<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'clubName',
        'gs_id',
        'clubAddress',
        'club_history',
        'clubContactNo',
        'clubImage',
        'isVerified',
    ];

    // Relationships
    public function gsDivision()
    {
        return $this->belongsTo(Gs_Division::class, 'gs_id');
    }

    public function clubManagers()
    {
        return $this->hasMany(Club_Manager::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function sportsCategories()
    {
        return $this->belongsToMany(Sports_Categories::class, 'club_sports');
    }

    public function sportsArenas()
    {
        return $this->hasMany(Sports_Arena::class);
    }

    public function eventClubs()
    {
        return $this->hasMany(EventClub::class);
    }

    public function clubSports()
    {
        return $this->hasMany(Club_Sports::class);
    }

    public function homeMatches()
    {
        return $this->hasMany(MatchSchedule::class, 'home_club_id');
    }

    // Define relationship for matches where the club is the away team
    public function awayMatches()
    {
        return $this->hasMany(MatchSchedule::class, 'away_club_id');
    }

    // Define a unified relationship to get all matches involving this club
    public function allMatches()
    {
        return MatchSchedule::where('home_club_id', $this->id)
            ->orWhere('away_club_id', $this->id);
    }

    public function matchResults()
    {
        return $this->hasMany(MatchResult::class, 'winner_club_id');
    }
}
