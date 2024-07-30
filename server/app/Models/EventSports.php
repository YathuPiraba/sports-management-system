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
    ];

    /**
     * Get the event that owns the EventSport.
     */
    public function event()
    {
        return $this->belongsTo(Events::class);
    }

    /**
     * Get the sports category that owns the EventSport.
     */
    public function sportsCategory()
    {
        return $this->belongsTo(Sports_categories::class, 'sports_id');
    }
}
