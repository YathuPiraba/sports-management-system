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
        'ClubImage',
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
}
