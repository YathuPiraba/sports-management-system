<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sports_Categories extends Model
{
    use HasFactory;

    protected $table = 'sports_categories';

    protected $fillable = [
        'name',
        'type',
        'description',
        'image',
        'min_Players'
    ];

    // One-to-many relationship with Skills
    public function skills()
    {
        return $this->hasMany(Skills::class, 'sports_id');
    }

    // Many-to-many relationship with Clubs through ClubSports
    public function clubs()
    {
        return $this->belongsToMany(Club::class, 'club_sports', 'sports_id', 'club_id');
    }

    // Many-to-many relationship with Members through MemberSports
    public function members()
    {
        return $this->belongsToMany(Member::class, 'member_sports', 'sports_id', 'member_id');
    }

    // Many-to-many relationship with Events through EventSports
    public function events()
    {
        return $this->belongsToMany(Events::class, 'event_sports', 'sports_id', 'event_id');
    }
}
