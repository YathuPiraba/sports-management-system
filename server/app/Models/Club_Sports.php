<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club_Sports extends Model
{
    use HasFactory;
    protected $fillable = [
        'club_id',
        'sports_id',
        'sports_arena_id',
    ];

    // Relationships
    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }

    public function sportsCategory()
    {
        return $this->belongsTo(Sports_categories::class, 'sports_id');
    }

    public function sportsArena()
    {
        return $this->belongsTo(Sports_arena::class, 'sports_arena_id');
    }
}
