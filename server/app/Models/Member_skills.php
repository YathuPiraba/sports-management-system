<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member_Skills extends Model
{
    use HasFactory;
    protected $fillable = ['member_sport_id', 'skill_id'];

    /**
     * Get the member sport associated with this skill.
     */
    public function memberSport()
    {
        return $this->belongsTo(Member_Sports::class, 'member_sport_id');
    }

    /**
     * Get the skill associated with this record.
     */
    public function skill()
    {
        return $this->belongsTo(Skills::class, 'skill_id');
    }
}
