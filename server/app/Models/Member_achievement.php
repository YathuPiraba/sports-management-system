<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member_Achievement extends Model
{
    use HasFactory;

    protected $fillable = ['member_sport_id', 'achievement', 'achievement_date'];

    /**
     * Get the member sport associated with this achievement.
     */
    public function memberSport()
    {
        return $this->belongsTo(Member_Sports::class, 'member_sport_id');
    }
}
