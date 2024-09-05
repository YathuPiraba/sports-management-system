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
        'end_date'
     ];

         // Many-to-many relationship with Sports Categories
     public function sportsCategories()
     {
        return $this->belongsToMany(Sports_Categories::class, 'event_sports', 'event_id', 'sports_category_id');
     }

     public function sports()
     {
         return $this->hasMany(EventSports::class);
     }

     public function clubs()
     {
         return $this->hasManyThrough(
             Club::class,
             EventSports::class,
             'event_id', // Foreign key on EventSport table
             'id',       // Foreign key on Club table
             'id',       // Local key on Event table
             'club_id'   // Local key on EventSport table
         );
     }

     public function participants()
     {
         return $this->hasManyThrough(
             Event_Participants::class,
             EventClub::class,
             'event_id', // Foreign key on EventClub table
             'event_clubs_id', // Foreign key on EventParticipant table
             'id', // Local key on Event table
             'id'  // Local key on EventClub table
         );
     }
}
