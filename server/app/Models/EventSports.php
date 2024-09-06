<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventSports extends Model
{
    use HasFactory;
    protected $fillable = [
        'sports_id',
        'event_id',
        'name',
        'start_date',
        'end_date',
        'apply_due_date',
        'place',
    ];



    /**
     * Get the event that owns the EventSport.
     */
    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }


    /**
     * Get the sports category that owns the EventSport.
     */
    public function sportsCategory()
    {
        return $this->belongsTo(Sports_Categories::class, 'sports_id');
    }


    public function eventClubs()
    {
        return $this->hasMany(EventClub::class);
    }
}
