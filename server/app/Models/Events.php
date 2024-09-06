<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
    ];

    /**
     * Many-to-many relationship with Sports Categories through event_sports
     */
    public function sportsCategories()
    {
        return $this->belongsToMany(Sports_Categories::class, 'event_sports', 'event_id', 'sports_id');
    }

    /**
     * One-to-many relationship with EventSports
     */
    public function sports()
    {
        return $this->hasMany(EventSports::class,'event_id');
    }

    /**
     * Get all clubs participating in the event through EventSports
     */
    public function clubs()
    {
        return $this->belongsToMany(Club::class, 'event_clubs', 'event_sports_id', 'club_id')
            ->withPivot('rank');
    }

    /**
     * Get all participants in the event through EventClubs
     */
    public function participants()
    {
        return $this->hasManyThrough(
            Event_Participants::class,
            EventClub::class,
            'event_id', // Foreign key on EventClub table
            'event_clubs_id', // Foreign key on EventParticipants table
            'id', // Local key on Events table
            'id'  // Local key on EventClub table
        );
    }
}
